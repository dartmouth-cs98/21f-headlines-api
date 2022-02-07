import { Router } from 'express';
import * as Articles from './controllers/article_controller';
import * as Questions from './controllers/question_controller';
import * as Users from './controllers/user_controller';
import * as DailyChallenge from './controllers/daily_challenges_controller';
import * as UserChallenge from './controllers/user_challenges_controller';

const router = Router();

router.get('/api', (req, res) => {
  res.json({ message: 'welcome to our quiz api!' });
});

router.route('/articles')
  .get(async (req, res) => {
    try {
      if (req.currentUser) {
        const articles = await Articles.getArticles();
        res.json(articles);
      } else {
        res.status(401).send('Not authorized');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
  // Again not authenticated to allow python code to access it.
  .post(async (req, res) => {
    try {
      const articleId = await Articles.createArticle(req.body.articleInfo);
      const questions = [];
      if (req.body.questions) {
        // eslint-disable-next-line no-restricted-syntax
        for (const qn of req.body.questions) {
          // eslint-disable-next-line no-await-in-loop
          const qnId = await Questions.createQuestion(articleId, qn);
          questions.push(qnId);
        }
      }
      const updatedArticle = await Articles.updateArticle(articleId, { questions });
      res.json(updatedArticle);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/articles/:articleID')
  .get(async (req, res) => {
    try {
      if (req.currentUser) {
        const article = await Articles.getArticle({ _id: req.params.articleID });
        res.json(article);
      } else {
        res.status(401).send('Not authorized');
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  });

router.route('/questions')
  .get(async (req, res) => {
    try {
      if (req.currentUser) {
        const questions = await Questions.getNumQuestions(req.query.num);
        res.json({ questions });
      } else {
        res.status(401).send('Not authorized');
      }
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  })
  // req.body needs to be a dictionary with two keys:
  // "articleInfo" whose value is a one key dict of form {"url": "wwww.example.com"}
  // or {_id: "h192992hskas"}. Second key in req.body should be "question"
  // whose value is a dict with question info such as
  // statement, answers, correct_answer etc
  // Unfortunately we can't authenticate this right now because the python calls these endpoints without being authenticated rn.
  .post(async (req, res) => {
    try {
      const article = await Articles.getArticle(req.body.articleInfo);
      const question = await Questions.createQuestion(article.id, req.body.question);
      const qns = article.questions;
      qns.push(question);
      const updatedArticle = await Articles.updateArticle(article.id, { questions: qns });
      res.json({ updatedArticle });
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/questions/:questionID')
// this is to update a question
  .put(async (req, res) => {
    try {
      if (req.currentUser) {
        const question = await Questions.updateQuestion(req.params.questionID, req.body.question);
        res.json(question);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/adminQuestions')
  .get(async (req, res) => {
    try {
      if (true) {
        const question = await Questions.getQuestionsToCheck(req.query, req.query.num);
        res.json(question);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

// Endpoint for rating a question
router.put('/rateQuestion/:questionId', async (req, res) => {
  try {
    const data = req.body;
    if (req.currentUser) {
      await Questions.rateQuestion(req.params.questionId, data.change);
      res.json({ success: 'true' });
    } else {
      res.status(401).send('Not Authenticated');
    }
  } catch (error) {
    res.status(420).send({ error: error.toString() });
  }
});

router.delete('/deleteQuestions/:lowScore', async (req, res) => {
  try {
    await Questions.deleteBadQuestions(req.params.lowScore);
    res.json({ success: 'true' });
  } catch (error) {
    res.status(420).send({ error: error.toString() });
  }
});

router.route('/dailyChallenges')
  .post(async (req, res) => {
    try {
      if (req.currentUser) {
        const challengeId = await DailyChallenge.createDailyChallenge(req.body.challenge);
        res.json(challengeId);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
  .get(async (req, res) => {
    try {
      if (req.currentUser) {
        const challenge = await DailyChallenge.getDailyChallenge(req.query.date);
        res.json(challenge);
      } else {
        res.status(401).send('Not authorized');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/dailyChallenges/:id/questions')
  // this is used specifically for adding a question to a daily challenge
  .put(async (req, res) => {
    try {
      if (req.currentUser) {
        const challenge = await DailyChallenge.addQuestionToDailyChallenge(req.params.id, req.query.qId);
        res.json(challenge);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/userChallenges')
  .post(async (req, res) => {
    try {
      if (req.currentUser) {
        const challengeId = await UserChallenge.createUserChallenge(req.body.challenge);
        res.json(challengeId);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
  // gets the top ten performers on the daily challenge today (if they exist)
  .get(async (req, res) => {
    try {
      if (req.currentUser) {
        const challenges = await UserChallenge.getTopUserChallenges(req.query.date);
        res.json(challenges);
      } else {
        res.status(401).send('Not authorized');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

// returns a users last 7 days of performance in list
router.route('/userChallenges/:userID')
  .get(async (req, res) => {
    try {
      if (req.currentUser) {
        const challenge = await UserChallenge.getUserChallenges(req.params.userID, req.query.date);
        res.json(challenge);
      } else {
        res.status(401).send('Not authorized');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/userChallenges/friends/:userID')
  .get(async (req, res) => {
    try {
      if (req.currentUser) {
        const friendChallenges = await UserChallenge.getUserFriendChallenges(req.params.userID, req.query.date);
        res.json(friendChallenges);
      } else {
        res.status(401).send('Not authorized');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

// Route for users. Can get a query result of users or post to users a new users
router.route('/users')
  .get(async (req, res) => {
    try {
      if (req.currentUser) {
        const users = await Users.getUsers(req.query.term);
        res.json(users);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
  .post(async (req, res) => {
    console.log('post request made');
    try {
      if (req.currentUser) {
      // console.log(req.body);
      // call postUser to create a new user with the given information. They do not need to be authenticated for this
        const user = await Users.postUser(req.body);
        res.json(user);
      } else {
        res.status(401).send('Not authorized');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
      console.log(error.toString());
    }
  });

router.route('/users/contacts')
// this is really a get, making it a post to include a body
  .post(async (req, res) => {
    try {
      if (req.currentUser) {
        const users = await Users.getContacts(req.body.phoneNumbers);
        res.json(users);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });
// This route is for accessing a specific user in order to update their information
// For get it can be either mongo id or firebase id
router.route('/users/:userID')
  .put(async (req, res) => { // to update user info
    try {
      console.log('Put from userID');
      if (req.currentUser) {
        const user = await Users.updateUser(req.params.userID, req.body, req.query.remove);
        res.json(user);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  }).get(async (req, res) => { // to get user info
    try {
      if (req.currentUser) {
        console.log('getting user');
        let user;
        console.log(req.query);
        if (req.query.isFirebase === 'true') {
          user = await Users.getUser(null, req.params.userID);
        } else {
          user = await Users.getUser(req.params.userID, null, null);
        }
        res.json(user);
      } else {
        res.status(401).send('Not Authenticated');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/users/exists/:userID')
  .get(async (req, res) => { // to see if a user exists or not
    try {
      const user = await Users.getUser(null, req.params.userID);
      if (user) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }

    // Get user throws error if user doesn't exists.
    } catch (error) {
      res.json({ exists: false });
    }
  });

// Endpoint for simply checking if a username is taken or not, very, COUld be condensed into /exists endpoint
router.get('/users/checkUsername/:attemptedUsername', async (req, res) => {
  try {
    const user = await Users.getUser(null, null, req.params.attemptedUsername);
    if (user) {
      res.json({ taken: true });
    } else {
      res.json({ taken: false });
    }
  } catch (error) {
    console.log(error);
    res.status(420).send({ error: error.toString() });
  }
});
export default router;

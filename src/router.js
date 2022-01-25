import { Router } from 'express';
import * as Articles from './controllers/article_controller';
import * as Questions from './controllers/question_controller';
import * as Users from './controllers/user_controller';
import * as DailyChallenge from './controllers/daily_challenges_controller';
import * as UserChallenge from './controllers/user_challenges_controller';
import { requireSignin } from './services/passport';

const router = Router();

router.get('/api', (req, res) => {
  res.json({ message: 'welcome to our quiz api!' });
});

router.route('/articles')
  .get(async (req, res) => {
    try {
      const articles = await Articles.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
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
      const article = await Articles.getArticle({ _id: req.params.articleID });
      res.json(article);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

router.route('/questions')
  .get(async (req, res) => {
    try {
      const questions = await Questions.getNumQuestions(req.query.num);
      res.json({ questions });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  })
  // req.body needs to be a dictionary with two keys:
  // "articleInfo" whose value is a one key dict of form {"url": "wwww.example.com"}
  // or {_id: "h192992hskas"}. Second key in req.body should be "question"
  // whose value is a dict with question info such as
  // statement, answers, correct_answer etc
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
      const question = await Questions.updateQuestion(req.params.questionID, req.body.question );
      res.json(question);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/adminQuestions')
  .get(async (req, res) => {
    try {
      const question = await Questions.getQuestionsToCheck(req.query, req.query.num);
      res.json(question);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });


router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = Users.signin(req.user);
    res.json({ token, email: req.user.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const token = await Users.signup(req.body);
    res.json({ token, email: req.body.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

// Endpoint for simply checking if a username is taken or not
router.get('/checkUsername/:attemptedUsername', async (req, res) => {
  try {
    const isAllowed = await Users.checkUsername(req.params.attemptedUsername);
    res.json({ isAllowed });
  } catch (error) {
    res.status(420).send({ error: error.toString() });
  }
});

// Endpoint for updating a user's profile name.
router.put('/setUsername/:userId', async (req, res) => {
  try {
    const data = req.body;
    const didChange = await Users.chooseUsername(data.attemptedUsername, req.params.userId);
    // Return back whether or not the username was actually changed.
    res.json({ didChange });
  } catch (error) {
    res.status(420).send({ error: error.toString() });
  }
});

router.route('/dailyChallenges')
  .post(async (req, res) => {
    try {
      const challengeId = await DailyChallenge.createDailyChallenge(req.body.challenge);
      res.json(challengeId);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
  .get(async (req, res) => {
    try {
      const challenge = await DailyChallenge.getDailyChallenge(req.query.date);
      res.json(challenge);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/dailyChallenges/:id/questions')
  // this is used specifically for adding a question to a daily challenge
  .put(async (req, res) => {
    try {
      const challenge = await DailyChallenge.addQuestionToDailyChallenge(req.params.id, req.query.qId);
      res.json(challenge);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/userChallenges')
  .post(async (req, res) => {
    try {
      const challengeId = await UserChallenge.createUserChallenge(req.body.challenge);
      res.json(challengeId);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
  // gets the top ten performers on the daily challenge today (if they exist)
  .get(async (req, res) => {
    try {
      const challenges = await UserChallenge.getTopUserChallenges(req.query.date);
      res.json(challenges);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

// returns a users last 7 days of performance in list
router.route('/userChallenges/:userID')
  .get(async (req, res) => {
    try {
      // the 7 means we are getting the last week
      const challenge = await UserChallenge.getUserChallenges(req.params.userID, 7);
      res.json(challenge);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/userChallenges/friends/:userID')
  .get(async (req, res) => {
    try {
      const friendChallenges = await UserChallenge.getUserFriendChallenges(req.params.userID, req.query.date);
      res.json(friendChallenges);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/users')
  .get(async (req, res) => {
    try {
      const users = await Users.getUsers(req.query.term);
      res.json(users);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/users/contacts')
// this is really a get, making it a post to include a body
  .post(async (req, res) => {
    try {
      const users = await Users.getContacts(req.body.phoneNumbers);
      res.json(users);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/users/:userID')
  .put(async (req, res) => { // to update user info
    try {
      const user = await Users.updateUser(req.params.userID, req.body);
      res.json(user);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

// req.body needs to be a dict with a key "idList",
// whose value is an array of articles ids as strs
router.route('/learn')
  .post(async (req, res) => {
    try {
      const articles = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const i of req.body.idList) {
      // eslint-disable-next-line no-await-in-loop
        const article = await Articles.getArticle({ _id: i });
        if (article) {
          articles.push(article);
        }
      }
      res.json({ articles });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
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

// Endpoint for rating a question
router.put('/rateQuestion/:questionId', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    await Questions.rateQuestion(req.params.questionId, data.change);
    res.json({ success: 'true' });
  } catch (error) {
    res.status(420).send({ error: error.toString() });
  }
});
  

export default router;

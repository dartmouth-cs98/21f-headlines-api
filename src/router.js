import { Router } from 'express';
import * as Articles from './controllers/article_controller';
import * as Questions from './controllers/question_controller';
import * as Users from './controllers/user_controller';
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
  });
router.route('/article/:articleID')
  .get(async (req, res) => {
    try {
      const article = await Articles.getArticle(req.params.articleID);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

router.get('/getQuestions', async (req, res) => {
  try {
    const questions = await QuestionController.getNumQuestions(req.query.num);
    res.json({ questions });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

router.route('/addArticle')
  .post(async (req, res) => {
    try {
      const articleId = await Articles.createArticle(req.body.articleInfo);
      const questions = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const qn of req.body.questions) {
        // eslint-disable-next-line no-await-in-loop
        const qnId = await Questions.createQuestion(articleId, qn);
        questions.push(qnId);
      }
      const updatedArticle = await Articles.updateArticle(articleId, { questions });
      res.json(updatedArticle);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = await Users.signin(req.user);
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

export default router;

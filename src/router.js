import { Router } from 'express';
import * as ArticleController from './controllers/article_controller';
import * as UserController from './controllers/user_controller';
import { requireSignin } from './services/passport';

const router = Router();

router.get('/api', (req, res) => {
  res.json({ message: 'welcome to our quiz api!' });
});

router.route('/articles')
  .get(ArticleController.getArticles);

router.route('/addArticle')
  .post(async (req, res) => {
    try {
      res.send('hello in router');
      // to do later
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    res.json({ token, email: req.user.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    res.json({ token, email: req.body.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

export default router;

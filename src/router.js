import { Router } from 'express';
import * as Articles from './controllers/article_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our quiz api!' });
});

router.route('/articles')
  .get(Articles.getArticles);

router.route('/addArticle')
  .post(async (req, res) => {
    try {
      const res = Articles.addArticle({ name: 'name', source: 'source' });
      res.json(res);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

export default router;

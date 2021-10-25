import { Router } from 'express';
import * as Articles from './controllers/article_controller';
import * as Questions from './controllers/question_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our quiz api!' });
});

router.route('/articles')
  .get(Articles.getArticles);

router.route('/addArticle')
  .post(async (req, res) => {
    try {
      const result = await Articles.addArticle(req.body);
      res.json(result);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
});

router.route(':articleID/addQuestion')
  .post(async (req, res) => {
    try {
      const qn = await Questions.addQuestion(req.body);
      const qns = qn.article_ref.questions;
      qns.push(qn);
      const article = await Articles.updateArticle(req.params.articleID, { events });
      res.json(article);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
});

export default router;

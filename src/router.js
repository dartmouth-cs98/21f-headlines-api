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
      const article = Articles.getArticle(req.params.articleID);
      const qns = article.questions;
      qns.push(qn);
      const updatedArticle= await Articles.updateArticle(req.params.articleID, { questions: qns});
      res.json(updatedArticle);

    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
});

export default router;

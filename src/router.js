import { Router } from 'express';
import * as Articles from './controllers/article_controller';
// import * as Questions from './controllers/question_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our quiz api!' });
});

router.route('/articles')
  .get(Articles.getArticles);

router.route('/addArticle')
  .post(async (req, res) => {
    try {
      const id = Articles.createArticle(req.body.articleInfo);
      // const qns = [];
      // req.body.questions.forEach((element) => {
      //   const qnId = Questions.createQuestion(id, element);
      //   qns.push(qnId);
      // });
      // const updatedArticle = Articles.updateArticle(id, { questions: qns });
      res.json(id);
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  });

export default router;

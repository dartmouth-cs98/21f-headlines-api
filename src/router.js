import { Router } from 'express';
import * as Articles from './controllers/article_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our quiz api!' });
});


router.route('/articles')
  .get(Articles.getArticles)


export default router;
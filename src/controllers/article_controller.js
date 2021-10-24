import Article from '../models/article_model';

export const getArticles = (req, res) => {
  Article.find().populate('questions')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).send({ message: 'Unable to get articles' })
    })
}
import Article from '../models/article_model';

export const getArticles = (req, res) => {
  Article.find().populate('questions')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).send({ message: 'Unable to get articles' });
    });
};

export const getArticle = (req, res) => {
  Article.findById(req.params.id).populate('questions')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).send({ message: 'Unable to get article' });
    });
};

export const addArticle = (articleInfo) => {
  const article = new Article();
  article.name = articleInfo.name;
  article.source = articleInfo.source;
  article.url = articleInfo.url;
  article.image_url = articleInfo.image_url;
  article.article_text = articleInfo.article_text;
  article.summary = articleInfo.summary;
  article.questions = articleInfo.questions;
  article.category = articleInfo.category;

  try {
    const savedArticle = article.save();
    return savedArticle;
  } catch (error) {
    throw new Error(`unable to add article to database: ${error}`);
  }
};

export const updateArticle = async (id, info) => {
  try {
    // await updating an article by id
    const options = { new: true };
    const article = await Article.findByIdAndUpdate(id, info, options);
    // return *updated* article object
    return article;
  } catch (error) {
    throw new Error(`update error: ${error}`);
  }
};

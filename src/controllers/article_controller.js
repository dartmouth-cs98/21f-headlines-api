import Article from '../models/article_model';

export const getArticles = async () => {
  try {
    const articles = await Article.find({}).populate('questions');
    return articles;
  } catch (error) {
    throw new Error(`get articles error: ${error}`);
  }
};

export const getArticle = async (id) => {
  try {
    const article = await Article.findById(id).populate('questions');
    return article;
  } catch (error) {
    throw new Error(`get article error: ${error}`);
  }
};

export const createArticle = async (articleInfo) => {
  const article = new Article();
  article.name = articleInfo.name;
  article.source = articleInfo.source;
  article.url = articleInfo.url;
  article.image_url = articleInfo.image_url;
  article.article_text = articleInfo.article_text;
  article.summary = articleInfo.summary;
  article.questions = [];
  article.category = articleInfo.category;

  try {
    const savedArticle = await article.save();
    return savedArticle.id;
  } catch (error) {
    throw new Error(`unable to add article to database: ${error}`);
  }
};

export const updateArticle = async (id, articleInfo) => {
  try {
    const options = { new: true };
    const article = await Article.findByIdAndUpdate(id, articleInfo, options).populate('questions');
    return article;
  } catch (error) {
    throw new Error(`updating article error: ${error}`);
  }
};

import mongoose, { Schema } from 'mongoose';

const ArticleSchema = new Schema({
  name: String,
  source: String,
  url: String,
  image_url: String,
  article_text: String,
  summary: String,
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  category: String,
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;

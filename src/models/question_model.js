import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  statement: String,
  article_ref: { type: Schema.Types.ObjectId, ref: 'Article' },
  answers: [String],
  correct_answer: String,
  likes: Number,
  dislikes: Number,
  question_source: String,
  approved_status: { type: String, default: 'undetermined' },
  in_daily_quiz: { type: Schema.Types.ObjectId, ref: 'DailyChallenge', default: null },
  report: [String],
  user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

export default QuestionModel;

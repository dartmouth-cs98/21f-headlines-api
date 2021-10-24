import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  statement: String,
  article_ref: { type: Schema.Types.ObjectId, ref: 'Article' },
  answers: [String],
  correct_answer: String,
  times_attempted: Number,
  times_correct: Number,
  likes: Number,
  dislikes: Number,
  question_source: String,
  manually_approved: Boolean,
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

export default QuestionModel;

import mongoose, { Schema } from 'mongoose';

const ArchiveQuestionSchema = new Schema({
  questionId: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  userId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const ArchiveQuestionModel = mongoose.model('ArchiveQuestion', ArchiveQuestionSchema);

export default ArchiveQuestionModel;

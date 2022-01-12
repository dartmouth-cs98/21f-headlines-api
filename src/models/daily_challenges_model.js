import mongoose, { Schema } from 'mongoose';

const DailyChallengesSchema = new Schema({
  date: Date,
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const DailyChallengeModel = mongoose.model('DailyChallenge', DailyChallengesSchema);

export default DailyChallengeModel;

import mongoose, { Schema } from 'mongoose';

const UserChallengesSchema = new Schema({
  date: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  number_correct: Number,
  seconds_taken: Number,
  day_of: Boolean,
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const UserChallengeModel = mongoose.model('UserChallenge', UserChallengesSchema);

export default UserChallengeModel;

import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, unique: true, default: '' },
  fullName: { type: String, unique: false, default: '' },
  phone: { type: String, unique: true, default: '' },
  unformattedPhone: { type: String, unique: true, default: '' },
  firebaseID: { type: String, unique: true, default: '' },
  following: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
  followers: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
  days_played: { type: [Date], default: [] },
  current_streak: { type: Number, default: 0 },
  longest_streak: { type: Number, default: 0 },
  reliability_score: { type: Number, default: 0 },
  user_score: { type: Number, default: 0 },
  role: { type: String, default: 'player' },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

import mongoose, { Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, default: '' },
  password: { type: String },
  friends: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
  days_played: { type: [Date], default: [] },
  questions_answered_by_category: { type: Map, of: Number, default: {} },
  correct_answers_by_category: { type: Map, of: Number, default: {} },
  questions_answered: { type: [{ type: Schema.Types.ObjectId, ref: 'Question' }], default: [] },
  user_score: { type: Number, default: 0 },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

// eslint-disable-next-line consistent-return
UserSchema.pre('save', function beforeUserSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // when done run the **next** callback with no arguments
  // call next with an error if you encounter one
  // return next();
  // eslint-disable-next-line consistent-return
  bcryptjs.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcryptjs.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  const comparison = await bcryptjs.compare(candidatePassword, this.password);
  return comparison;
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

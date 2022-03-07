import mongoose, { Schema } from 'mongoose';

const WordSchema = new Schema({
  date: Date,
  word: String
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const WordModel = mongoose.model('Word', WordSchema);

export default WordModel;
import Word from '../models/word_model';
import { getStartEndDate } from '../helpers/helpers';

export const createWord = async (word) => {
  const newWord = new Word();
  newWord.date = word.date;
  newWord.word = word.word;

  try {
    const savedWord = await word.save();
    return savedWord.id;
  } catch (error) {
    throw new Error(`unable to save word: ${error}`);
  }
};

export const getWord = async (date) => {
  try {
    // used this: https://stackoverflow.com/questions/29327222/mongodb-find-created-results-by-date-today/29327353
    const { start, end } = getStartEndDate(date);
    const word = await Word.findOne({ date: { $gte: start, $lt: end } });
    return word;
  } catch (error) {
    throw new Error(`get word error: ${error}`);
  }
};

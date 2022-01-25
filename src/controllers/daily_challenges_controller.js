import DailyChallenge from '../models/daily_challenges_model';
import { getStartEndDate } from '../helpers/helpers';

export const createDailyChallenge = async (challenge) => {
  const dailyChallenge = new DailyChallenge();
  dailyChallenge.date = challenge.date;
  dailyChallenge.questions = challenge.questions;

  try {
    const savedChallenge = await dailyChallenge.save();
    return savedChallenge.id;
  } catch (error) {
    throw new Error(`unable to save daily challenge: ${error}`);
  }
};

export const getDailyChallenge = async (date) => {
  try {
    // used this: https://stackoverflow.com/questions/29327222/mongodb-find-created-results-by-date-today/29327353
    const { start, end } = getStartEndDate(date);
    const challenge = await DailyChallenge.findOne({ date: { $gte: start, $lt: end } }).populate('questions');
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

export const addQuestionToDailyChallenge = async (challengeId, questionId) => {
  try {
    // used this: https://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose
    console.log(questionId);
    const newChallenge = await DailyChallenge.findByIdAndUpdate(challengeId, { $push: { questions: questionId } }, { safe: true, upsert: true, new: true });
    return newChallenge;
  } catch (error) {
    throw new Error(`update daily challenge error: ${error}`);
  }
};

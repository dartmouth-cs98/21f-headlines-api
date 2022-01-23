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
    console.log(start);
    console.log(end);
    const challenge = await DailyChallenge.findOne({ date: { $gte: start, $lt: end } }).populate('questions');
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

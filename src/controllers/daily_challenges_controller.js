import DailyChallenge from '../models/daily_challenges_model';
import * as Questions from './question_controller';
import { DateTime } from 'luxon';

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

export const getDailyChallenge = async () => {
  try {
    // used this: https://stackoverflow.com/questions/29327222/mongodb-find-created-results-by-date-today/29327353
    const start = DateTime.now().setZone('America/New_York').startOf('day').toISO();
    console.log(start);

    const end = DateTime.now().setZone('America/New_York').endOf('day').toISO();

    const questions = [];
    const challenge = await DailyChallenge.findOne({ date: { $gte: start, $lt: end } }).populate('questions');
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

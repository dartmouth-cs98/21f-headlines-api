import DailyChallenge from '../models/daily_challenges_model';

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
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const challenge = await DailyChallenge.findOne({ date: { $gte: start, $lt: end } }).populate('questions');
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

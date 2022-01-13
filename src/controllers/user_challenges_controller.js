import UserChallenge from '../models/user_challenges_model';

export const createUserChallenge = async (challenge) => {
  const userChallenge = new UserChallenge();
  userChallenge.date = challenge.date;
  userChallenge.user = challenge.user_id;
  userChallenge.number_correct = challenge.number_correct;
  userChallenge.seconds_taken = challenge.seconds_taken;

  try {
    const savedChallenge = await userChallenge.save();
    return savedChallenge.id;
  } catch (error) {
    throw new Error(`unable to save user challenge: ${error}`);
  }
};

export const getTopUserChallenges = async (num = 10) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // used this: https://stackoverflow.com/questions/61178772/mongodb-how-to-find-the-10-largest-values-in-a-collection
    const challenge = await UserChallenge.find({ date: { $gte: start, $lt: end } }).sort({ number_correct: 1, seconds_taken: -1 }).limit(num);
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

export const getUserChallenges = async (id, daysBack = 1) => {
  try {
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    start -= (daysBack - 1) * 60 * 60 * 24 * 1000;

    console.log(`days back: ${daysBack}`);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // used this: https://stackoverflow.com/questions/61178772/mongodb-how-to-find-the-10-largest-values-in-a-collection
    const challenge = await UserChallenge.find({ user_id: id, date: { $gte: start, $lt: end } }).sort({ date: 1 }).populate('user');
    if (daysBack === 1) {
      return challenge[0];
    }
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

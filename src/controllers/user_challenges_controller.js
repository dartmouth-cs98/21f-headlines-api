import UserChallenge from '../models/user_challenges_model';

export const createUserChallenge = async (challenge) => {
  const user_challenge = new UserChallenge();
  user_challenge.date = challenge.date;
  user_challenge.user = challenge.user_id;
  user_challenge.number_correct = challenge.number_correct;
  user_challenge.seconds_taken = challenge.seconds_taken;

  try {
    const saved_challenge = await user_challenge.save();
    return saved_challenge.id;
  } catch (error) {
    throw new Error(`unable to save user challenge: ${error}`);
  }
}

export const getTopUserChallenges = async (num = 10) => {
  try {
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);

    // used this: https://stackoverflow.com/questions/61178772/mongodb-how-to-find-the-10-largest-values-in-a-collection
    const challenge = await UserChallenge.find({date: {$gte: start, $lt: end}}).sort({"number_correct":1, "seconds_taken":-1}).limit(num);
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

export const getUserChallenges = async (id, days_back = 1) => {
  try {
    var start = new Date();
    start.setHours(0,0,0,0);
    start = start - (days_back - 1) * 60 * 60 * 24 * 1000

    console.log(`days back: ${days_back}`);

    var end = new Date();
    end.setHours(23,59,59,999);

    // used this: https://stackoverflow.com/questions/61178772/mongodb-how-to-find-the-10-largest-values-in-a-collection
    const challenge = await UserChallenge.find({user_id: id, date: {$gte: start, $lt: end}}).sort({"date":1}).populate("user");
    if (days_back === 1) {
      return challenge[0];
    }
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

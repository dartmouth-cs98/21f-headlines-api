import UserChallenge from '../models/user_challenges_model';
import * as User from './user_controller';
import { getStartEndDate } from '../helpers/helpers';

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

// Returns global top user challenges from a certain date
export const getTopUserChallenges = async (date, num = 10) => {
  try {
    const { start, end } = getStartEndDate(date);
    console.log(`date: ${date}`);
    console.log(start);
    console.log(end);
    // used this: https://stackoverflow.com/questions/61178772/mongodb-how-to-find-the-10-largest-values-in-a-collection
    const challenge = await UserChallenge.find({ date: { $gte: start, $lt: end } }).sort({ number_correct: -1, seconds_taken: 1 }).limit(num).populate('user');
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

// Returns a list of a specific user's challenges
export const getUserChallenges = async (id, date, daysBack) => {
  try {
    const { start, end } = getStartEndDate(date, daysBack);

    // used this: https://stackoverflow.com/questions/61178772/mongodb-how-to-find-the-10-largest-values-in-a-collection
    const challenges = await UserChallenge.find({ user: id, date: { $gte: start, $lt: end } }).sort({ date: 1 }).populate('user');
    return challenges;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

// Returns a list of a user's friends challenges from a certain date
export const getUserFriendChallenges = async (id, date) => {
  try {
    const { start, end } = getStartEndDate(date, 1, 0);

    // used this: https://stackoverflow.com/questions/15102532/mongo-find-through-list-of-ids
    const user = await User.getUser(id);
    const followingIds = user.following;
    const friendsScores = await UserChallenge.find({ user: { $in: followingIds }, date: { $gte: start, $lt: end } }).sort({ number_correct: -1, seconds_taken: 1 }).populate('user');
    const myScore = await UserChallenge.findOne({ user: id, date: { $gte: start, $lt: end } }).populate('user');
    if (myScore) {
      friendsScores.push(myScore);
    }
    return friendsScores;
  } catch (error) {
    throw new Error(`get user friend challenges error: ${error}`);
  }
};

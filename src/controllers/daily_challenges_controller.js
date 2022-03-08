import DailyChallenge from '../models/daily_challenges_model';
import { getStartEndDate } from '../helpers/helpers';
import { getBackupQuestions } from './question_controller';

export const createDailyChallenge = async (challenge) => {
  const dailyChallenge = new DailyChallenge();
  dailyChallenge.date = challenge.date;
  dailyChallenge.questions = challenge.questions;

  try {
    const savedChallenge = await dailyChallenge.save();
    console.log(savedChallenge);
    return savedChallenge.id;
  } catch (error) {
    throw new Error(`unable to save daily challenge: ${error}`);
  }
};

export const getDailyChallenge = async (date) => {
  try {
    // used this: https://stackoverflow.com/questions/29327222/mongodb-find-created-results-by-date-today/29327353
    const { start, end } = getStartEndDate(date);
    let challenge = await DailyChallenge.findOne({ date: { $gte: start, $lt: end } }).populate('questions');
    // First check that there is a dailyChallenge
    if (challenge == null) {
      // Get 6 questions
      console.log('Daily Challenge hadn\'t been created');
      const backupQuestions = await getBackupQuestions(6);
      const challengeId = await createDailyChallenge({ date, questions: backupQuestions });
      challenge = await DailyChallenge.findOne({ _id: challengeId });
      // console.log(challenge);
      // create a new daily challenge with these questions.
      // questions = await
    } else {
      // Make sure it actually has all 6 questions.
      const questionsMissing = 6 - challenge.questions.length;
      console.log(questionsMissing);
      if (questionsMissing > 0) {
        const backupQuestions = await getBackupQuestions(questionsMissing);
        challenge = await DailyChallenge.findByIdAndUpdate(challenge.id, { $addToSet: { questions: backupQuestions } }, { safe: true, upsert: true, new: true }).populate('questions');
      }
    }
    return challenge;
  } catch (error) {
    throw new Error(`get daily challenge error: ${error}`);
  }
};

export const addQuestionToDailyChallenge = async (challengeId, questionId) => {
  try {
    // used this: https://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose
    console.log(questionId);
    const newChallenge = await DailyChallenge.findByIdAndUpdate(challengeId, { $push: { questions: questionId } }, { safe: true, upsert: true, new: true }).populate('questions');
    return newChallenge;
  } catch (error) {
    throw new Error(`update daily challenge error: ${error}`);
  }
};

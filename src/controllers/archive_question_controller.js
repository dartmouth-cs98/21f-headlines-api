import { ObjectId } from 'bson';
import ArchiveQuestion from '../models/archive_question_model';

export const createArchiveQuestion = async (userId, questionId) => {
  const aqn = new ArchiveQuestion();
  aqn.user_id = userId;
  aqn.question_id = questionId;
  try {
    const savedAqn = await aqn.save();
    console.log(savedAqn);
    return savedAqn.id;
  } catch (error) {
    throw new Error(`unable to create or add archive question to database: ${error}`);
  }
};

export const clearArchiveQuestions = async (userId) => {
  // eslint-disable-next-line new-cap
  const objectID = ObjectId(userId);
  // delete all questions that this user has seen
  const res = await ArchiveQuestion.deleteMany({
    user_id: objectID,
  });
  return res;
};

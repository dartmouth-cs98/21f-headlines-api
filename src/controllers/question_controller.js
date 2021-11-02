import Question from '../models/question_model';

export const addQuestion = (qnInfo) => {
  const qn = new Question();
  qn.statement = qnInfo.statement;
  qn.article_ref = qnInfo.article_ref;
  qn.answers = qnInfo.answers;
  qn.correct_answer = qnInfo.correct_answer;
  qn.times_attempted = qnInfo.times_attempted;
  qn.times_correct = qnInfo.times_correct;
  qn.likes = qnInfo.likes;
  qn.dislikes = qnInfo.dislikes;
  qn.question_source = qnInfo.question_source;
  qn.manually_approved = qnInfo.manually_approved;
  try {
    const savedQn = qn.save();
    return savedQn;
  } catch (error) {
    throw new Error(`unable to add question to database: ${error}`);
  }
};

export const getNumQuestions = async (num) => {
  // used this: https://stackoverflow.com/questions/2824157/random-record-from-mongodb
  // and this: https://stackoverflow.com/questions/33194825/find-objects-created-in-last-week-in-mongo/46906862
  const res = await Question.aggregate([
    { $match: { createdAt: { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) } } },
    { $sample: { size: parseInt(num, 10) } },
  ]);
  return res;
};

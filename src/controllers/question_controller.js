import Question from '../models/question_model';

export const createQuestion = async (articleId, qnInfo) => {
  const qn = new Question();
  qn.article_ref = articleId;
  qn.statement = qnInfo.statement;
  qn.answers = qnInfo.answers;
  qn.correct_answer = qnInfo.correct_answer;
  qn.times_attempted = 0;
  qn.times_correct = 0;
  qn.likes = 0;
  qn.dislikes = 0;
  qn.question_source = qnInfo.question_source;
  qn.manually_approved = qnInfo.manually_approved;
  qn.report = [];
  try {
    const savedQn = await qn.save();
    return savedQn.id;
  } catch (error) {
    throw new Error(`unable to create or add question to database: ${error}`);
  }
};

export const getQuestions = async () => {
  try {
    const qns = await Question.find({}).populate('article_ref');
    return qns;
  } catch (error) {
    throw new Error(`get qns error: ${error}`);
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

export const getQuestion = async (id) => {
  try {
    const qn = await Question.findById(id).populate('article_ref');
    return qn;
  } catch (error) {
    throw new Error(`get question error: ${error}`);
  }
};

export const updateQuestion = async (id, qnInfo) => {
  try {
    const options = { new: true };
    const qn = await Question.findByIdAndUpdate(id, qnInfo, options).populate('article_ref');
    return qn;
  } catch (error) {
    throw new Error(`updating question error: ${error}`);
  }
};

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

// Create a function that given the id of a question, adds or substracts to a like
export const rateQuestion = async (id, isLike, change) => {
  let changeData = {};
  if (isLike) {
    changeData = { $inc: { likes: parseInt(change, 10) } };
  } else {
    changeData = { $inc: { dislikes: parseInt(change, 10) } };
  }
  try {
    console.log(await Question.findByIdAndUpdate(id, changeData));
  } catch (error) {
    console.log(error);
    throw new Error(`Problem rating question: ${error}`);
  }
};

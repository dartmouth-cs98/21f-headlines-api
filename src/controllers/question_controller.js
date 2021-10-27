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

import { ObjectId } from 'bson';
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
  qn.user = qnInfo.user;
  qn.reviewer = [];
  try {
    const savedQn = await qn.save();
    console.log(savedQn);
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
  // this only returns questions that have been in a daily challenge
  const res = await Question.aggregate([
    { $match: { in_daily_quiz: { $ne: null } } },
    { $sample: { size: parseInt(num, 10) } },
    {
      $lookup: {
        from: 'dailychallenges',
        localField: 'in_daily_quiz',
        foreignField: '_id',
        as: 'daily_challenge',
      },
    },
  ]);
  return res;
};

// create a new version of getNumQuestions which only returns questions that have been in a daily challenge
// and which the given user has never seen (doesn't exist as archive question)
// when you call this, you should then check if the returned list is empty
// if it is, then you should call the clear questions thing and then call it again
export const getNumQuestionsForUser = async (num, userId) => {
  // used this: https://stackoverflow.com/questions/2824157/random-record-from-mongodb
  // and this: https://stackoverflow.com/questions/33194825/find-objects-created-in-last-week-in-mongo/46906862
  // this only returns questions that have been in a daily challenge
  const res = await Question.aggregate([
    // {
    // $lookup: {
    //   from: 'dailychallenges',
    //   localField: 'in_daily_quiz',
    //   foreignField: '_id',
    //   as: 'daily_challenge',
    // },
    { $match: { in_daily_quiz: { $ne: null } } },
    { $sample: { size: parseInt(num, 10) } },
    {
      $lookup: {
        from: 'archivequestions',
        localField: '_id',
        foreignField: 'questionId',
        as: 'archivequestion',
      },
    },
    { $match: { 'archivequestion.userId': { $ne: userId } } },
    // {
    //   // eslint-disable-next-line no-dupe-keys
    //   $lookup: {
    //     from: 'dailychallenges',
    //     localField: 'in_daily_quiz',
    //     foreignField: '_id',
    //     as: 'daily_challenge',
    //   },
    // },
    // $and: [
    //   { $match: { in_daily_quiz: { $ne: null } } },
    //   { $match: { 'archivequestion.userId': { $ne: userId } } },
    // {
    //   $or: [
    //     { $match: { 'archivequestion.userId': { $ne: userId } } },
    //     // there's a question that's not in the archive question model at all
    //     // { _id: { $nin: ['archivequestion.questionId'] } },
    //     console.log('archive question question id'),
    //     console.log('archivequestion.questionId'),
    //   ],
    // },
    // ],
    // },
    // console.log('end of aggregation'),
    // { $sample: { size: parseInt(num, 10) } },
  ]);
  return res;
};

export const getQuestionsToRate = async (id) => {
  // eslint-disable-next-line new-cap
  const objectID = ObjectId(id);
  // only returns questions that the user hasn't rated
  //  queries for questions that have not been added to a quiz
  //  and that have not been reviewed by that person already
  const res = await Question.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { reviewer: { $exists: false } },
              {
                $and: [
                  { reviewer: { $nin: [objectID] } },
                  { reviewer: { $exists: true } },
                ],
              },
            ],
          },
          {
            $or: [
              { in_daily_quiz: null },
              { in_daily_quiz: { $exists: false } },
            ],
          },
          {
            $or: [
              { approved_status: 'undetermined' },
              { approved_status: { $exists: false } },
            ],
          },
        ],
      },
    },
    { $sample: { size: 1 } },
  ]);
  return res;
};

export const getQuestionsToCheck = async (filters, num = 10) => {
  const newFilters = {};
  newFilters.approved_status = filters.approved_status;

  if (filters.in_daily_quiz && filters.in_daily_quiz === 'null') {
    newFilters.in_daily_quiz = null;
  }

  const res = await Question.find(newFilters).limit(parseInt(num, 10)).populate('user', 'qns_accepted');
  return res;
};

// Create a function that given the id of a question, adds or substracts to a like
export const rateQuestion = async (id, change) => {
  let changeData = {};
  changeData = { $inc: { likes: parseInt(change, 10) } };
  try {
    console.log(await Question.findByIdAndUpdate(id, changeData));
  } catch (error) {
    console.log(error);
    throw new Error(`Problem rating question: ${error}`);
  }
};

export const getQuestion = async (id) => {
  try {
    const qn = await Question.findById(id).populate('user', 'qns_accepted');
    return qn;
  } catch (error) {
    throw new Error(`get question error: ${error}`);
  }
};

// Call this to clean the mongoDB by deleting all questions lower than a certain rating
export const deleteBadQuestions = async (lowScore) => {
  try {
    await Question.deleteMany({ likes: { $lt: parseInt(lowScore, 10) } });
  } catch (error) {
    throw new Error(`delete question error: ${error}`);
  }
};

export const updateQuestion = async (id, question) => {
  try {
    const options = { new: true };
    const qn = await Question.findByIdAndUpdate(id, question, options).populate('article_ref');
    return qn;
  } catch (error) {
    throw new Error(`updating question error: ${error}`);
  }
};

export const getUserQns = async (userId) => {
  try {
    const qns = await Question.find({ user: userId });
    return qns;
  } catch (error) {
    throw new Error(`fetching user questions error: ${error}`);
  }
};

export const getAcceptedUserQns = async (userId) => {
  try {
    const qns = await Question.find({ user: userId, approved_status: 'approved' });
    return qns;
  } catch (error) {
    throw new Error(`fetching user questions error: ${error}`);
  }
};

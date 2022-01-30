import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

// Allow us to grab a user based on their mongo id or firebase id or username
export const getUser = async (mongoid = null, firebaseId = null, username = null) => {
  try {
    let user;
    if (mongoid) {
      user = await User
        .findOne({ _id: mongoid })
        .populate('following')
        .populate('followers');
    } else if (firebaseId) {
      user = await User
        .findOne({ firebaseID: firebaseId })
        .populate('following')
        .populate('followers');
    } else {
      user = await User
        .findOne({ username })
        .populate('following')
        .populate('followers');
    }
    return user;
  } catch (error) {
    console.log('error here');
    throw new Error(`could not find user: ${error}`);
  }
};

export const getUsers = async (searchTerm) => {
  try {
    // option i is to ignore case sensitivity
    const users = await User
      .find({ username: { $regex: `^${searchTerm}`, $options: 'i' } }).limit(10)
      .populate('following')
      .populate('followers');
    return users;
  } catch (error) {
    throw new Error(`could not find users: ${error}`);
  }
};

export const getContacts = async (phoneNumbers) => {
  try {
    // we are matching unformattedPhone (aka no country code)
    const users = await User
      .find({ unformattedPhone: { $in: phoneNumbers } })
      .populate('following')
      .populate('followers');
    return users;
  } catch (error) {
    throw new Error(`could not find contacts users: ${error}`);
  }
};

// Returns true if a username was able to be switched, false if it already existed
export const chooseUsername = async ({ attemptedUsername, userId }) => {
  // Set the username for this userId
  try {
    await User
      .findByIdAndUpdate(userId, { $set: { username: attemptedUsername } })
      .populate('following')
      .populate('followers');
    return true;
  } catch (error) {
    throw new Error(`choose Username: ${error}`);
  }
};
export const postUser = async (data) => {
  const newUser = new User();
  newUser.username = data.username;
  newUser.fullName = data.fullName;
  newUser.phone = data.phone;
  newUser.unformattedPhone = data.unformattedPhone;
  newUser.firebaseID = data.firebaseid;
  console.log(newUser);
  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error(`unable to add new user to database: ${error}`);
  }
};

export const updateUser = async (id, fields) => {
  try {
    const options = { new: true };
    if (fields.follow) { // following someone
      const update = { following: { $each: [fields.follow] } };
      const user = await User
        .findByIdAndUpdate(id, { $addToSet: update }, options)
        .populate('following')
        .populate('followers');
      return user;
    } else if (fields.followed) { // someone is following us
      const update = { followers: { $each: [fields.followed] } };
      const user = await User
        .findByIdAndUpdate(id, { $addToSet: update }, options)
        .populate('following')
        .populate('followers');
      return user;
    } else { // else we are updating any other fields
      const user = await User
        .findByIdAndUpdate(id, fields, options)
        .populate('following')
        .populate('followers');
      return user;
    }
  } catch (error) {
    console.log(error);
    throw new Error(`update user error: ${error}`);
  }
};

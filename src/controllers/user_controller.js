import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

export const signin = (user) => {
  return tokenForUser(user);
};

export const getUser = async (id) => {
  try {
    const user = await User.findOne({ _id: id });
    return user;
  } catch (error) {
    throw new Error(`could not find user: ${error}`);
  }
};

export const getUsers = async (searchTerm) => {
  try {
    // option i is to ignore case sensitivity
    const users = await User.find({ email: { $regex: `^${searchTerm}`, $options: 'i' } }).limit(10);
    return users;
  } catch (error) {
    throw new Error(`could not find users: ${error}`);
  }
};

export const getContacts = async (phoneNumbers) => {
  try {
    const users = await User.find({ phone: { $in: phoneNumbers } });
    return users;
  } catch (error) {
    throw new Error(`could not find contacts users: ${error}`);
  }
};

export const signup = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('You must provide email and password');
  }

  // See if a user with the given email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If a user with email does exist, return an error
    throw new Error('Email is in use');
  }

  const user = new User({
    email,
    password,
  });

  await user.save();
  return tokenForUser(user);
};

// Only checks the if the username exists or not, doesn't actually update it. true if the username doesn't exist
export const checkUsername = async ({ attemptedUsername }) => {
  const exisitingUser = await User.findOne({ username: attemptedUsername });
  if (exisitingUser) {
    return false;
  } else {
    return true;
  }
};
// Returns true if a username was able to be switched, false if it already existed
export const chooseUsername = async ({ attemptedUsername, userId }) => {
  // Set the username for this userId
  try {
    await User.findByIdAndUpdate(userId, { $set: { username: attemptedUsername } });
    return true;
  } catch (error) {
    throw new Error(`choose Username: ${error}`);
  }
};
// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const updateUser = async (id, fields) => {
  try {
    const options = { new: true };
    if (fields.follow) { // to following someone
      const update = { following: { $each: [fields.follow] } };
      const user = await User.findByIdAndUpdate(id, { $addToSet: update }, options);
      return user;
    } else if (fields.followed) { // someone is following us
      const update = { followers: { $each: [fields.followed] } };
      const user = await User.findByIdAndUpdate(id, { $addToSet: update }, options);
      return user;
    } else { // else we are updating any other fields
      const user = await User.findByIdAndUpdate(id, fields, options);
      return user;
    }
  } catch (error) {
    console.log(error);
    throw new Error(`update user error: ${error}`);
  }
};

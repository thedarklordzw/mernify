import HttpError from '../models/httpError.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import Place from '../models/places.js';

export const getPlaceByUserId = async (req, res, next) => {
  const { id: userId } = req.params;
  const user = await Place.find({ creator: userId });

  if (!user) {
    return next(new HttpError('Could not find user with given id', 404));
  }
  res.json({ user: user.map(_user => _user.toObject({ getters: true })) });
};

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Failed to get all users, try again');
    return next(error);
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

export const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Please enter valid inputs', 422));
  }

  const { email, name, password, image } = req.body;

  let existingUser;
  try {
    existingUser = await User.find({ email: email });
  } catch (err) {
    const error = new HttpError('Signing Up failed, try again later', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User already exists, please login instead',
      500
    );
  }

  const createdUser = new User({ email, password, name, image, places: [] });
  try {
    await createdUser.save();
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError('Failed to create a new user', 500);
    return next(error);
  }

  // res.status(404).json({ meesage: 'Try Again' });
};

export const logIn = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError('Please enter valid inputs', 422);
  }

  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.find({ email: email });
  } catch (err) {
    const error = new HttpError('Logging in failed, try again later', 500);
    return next(error);
  }

  if (!existingUser || existingUser[0].password !== password) {
    console.log(existingUser);
    const error = new HttpError(
      'Invalid credentials, could not log you in. Try again',
      401
    );
    return next(error);
  }

  res.status(200).json({ message: `Welcome back ${existingUser[0].name}` });
};

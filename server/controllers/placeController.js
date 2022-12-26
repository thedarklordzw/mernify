import HttpError from '../models/httpError.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import getCoordsForAddress from '../util/location.js';
import Product from '../models/product.js';
import Place from '../models/places.js';
import mongoose from 'mongoose';

export const getPlacesById = async (req, res, next) => {
  const { id } = req.params;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(id).populate('places');
    const userImg = await User.findById(id).populate('');
    console.log('O__+__O', userImg);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not process this id',
      500
    );

    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    const error = new HttpError('Could not find place with given id', 404);
    return next(error);
  }
  res.json({ places: userWithPlaces.places.toObject({ getters: true }) });
};

export const createPlace = async (req, res, next) => {
  const { title, description, address, creator } = req.body;
  const coordinates = await getCoordsForAddress();

  let createdPlace;
  let user;

  createdPlace = new Place({
    title,
    description,
    image:
      'https://images.pexels.com/photos/5184327/pexels-photo-5184327.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
    address,
    location: coordinates,
    creator,
  });

  try {
    user = await User.findById(creator);
  } catch (error) {
    console.log(error.stack);
    return next(new HttpError('Could not create place, try again.', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user woth given id.', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.stack);
    const error = new HttpError('Failed to upload file', 422);
    return next(error);
  }
  res.json({ message: 'Created Place' });
};

export const getAllPlaces = async (req, res, next) => {
  const products = await Product.find().exec();
  console.log('getting all places');
  res.json(products);
};

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('Invalid Inputs passed, please try again', 422));
  }
  const { id } = req.params;

  const { title, description } = req.body;

  const place = await Place.findById(id);
  if (place) {
    const newPlace = new Place({
      ...place.toObject({ getters: true }),
      _id: null,
      title,
      description,
    });
    newPlace.save();

    res.status(201).json({ newPlace: newPlace });
  } else {
    res.json({ message: 'Could not find this place' }).status(404);
  }
};

export const deletePlace = async (req, res, next) => {
  const { id } = req.params;

  let place;
  try {
    place = await Place.findById(id).populate('creator');
  } catch (err) {
    const error = new HttpError('Could not delete this file, try again', 500);
    return next(error);
  }

  if (!place) {
    return next(new HttpError('Could not find place with given id', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    await place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Could not start session', 401));
  }
  res.status(200).json({ message: 'Deleted place' });
};

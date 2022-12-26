import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser-picture_21104&psig=AOvVaw116vWb4uhHfQOOwh5kTukn&ust=1668249915238000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCNjGnK75pfsCFQAAAAAdAAAAABAE',
  },
  places: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Place',
    },
  ],
});

userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

export default User;

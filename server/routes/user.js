import express from 'express';
import {
  getPlaceByUserId,
  getAllUsers,
  signUp,
  logIn,
} from '../controllers/userController.js';
import { check } from 'express-validator';

const router = express.Router();
router.post(
  '/signup',
  [
    check('email').not().isEmpty(),
    check('password').isLength({ min: 5 }),
    check('name').not().isEmpty(),
  ],
  signUp
);
router.post(
  '/login',
  [
    check('email').not().isEmpty().normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  logIn
);
router.get('/', getAllUsers);
router.get('/:id', getPlaceByUserId);

export default router;

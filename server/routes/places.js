import express from 'express';
import {
  getPlacesById,
  createPlace,
  updatePlace,
  deletePlace,
  getAllPlaces,
} from '../controllers/placeController.js';
import { check } from 'express-validator';

const router = express.Router();

router.get('/', getAllPlaces);
router.get('/:id', getPlacesById);
router.post(
  '/',

  createPlace
);
router.patch(
  '/:id',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  updatePlace
);
router.delete('/:id', deletePlace);

export default router;

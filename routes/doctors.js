import express from 'express';
import * as doctorsController from '../src/controllers/doctorsController.js';

const router = express.Router();

router.get('/', doctorsController.list);
router.get('/:id', doctorsController.get);
router.post('/', doctorsController.create);
router.put('/:id', doctorsController.update);
router.delete('/:id', doctorsController.remove);

export default router;

import express from 'express';
import prescriptionController from '../src/controllers/prescriptionController.js';

const router = express.Router();

router.get('/', prescriptionController.list);
router.get('/:id', prescriptionController.get);
router.post('/', prescriptionController.create);
router.put('/:id', prescriptionController.update);
router.delete('/:id', prescriptionController.remove);

export default router;

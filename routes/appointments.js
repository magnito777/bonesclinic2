import express from 'express';
import * as appointmentsController from '../src/controllers/appointment-controller';

const router = express.Router();

router.get('/', appointmentsController.list);
router.get('/:id', appointmentsController.get);
router.post('/', appointmentsController.create);
router.patch('/:id/status', appointmentsController.updateStatus);
router.post('/:id/notes', appointmentsController.addNote);
router.get('/:id/notes', appointmentsController.listNotes);
router.post('/:id/prescriptions', appointmentsController.addPrescription);
router.get('/:id/prescriptions', appointmentsController.listPrescriptions);

export default router;

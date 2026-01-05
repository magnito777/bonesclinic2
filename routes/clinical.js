import express from 'express';
import clinicalController from '../src/controllers/clinicalController';

console.log('Loading clinical routes...');
const router = express.Router();

router.get('/test', (req, res) => res.json({ message: 'Clinical router is active' }));

// Vitals
router.post('/vitals', clinicalController.addVitals);
router.get('/vitals', clinicalController.listVitals);
router.get('/vitals/patient/:patientId', clinicalController.listVitalsByPatient);

// Clinical Notes
router.post('/notes', clinicalController.addNote);
router.get('/notes', clinicalController.listNotes);
router.get('/notes/patient/:patientId', clinicalController.listNotesByPatient);

export default router;

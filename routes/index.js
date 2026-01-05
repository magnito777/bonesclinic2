import express from 'express';
import patients from './patients.js';
import doctors from './doctors.js';
import appointments from './appointments.js';
import billing from './billing.js';
import specialisation from './specialisation.js';
import prescription from './prescription.js';
import clinical from './clinical.js';

const router = express.Router();

router.use('/patients', patients);
router.use('/doctors', doctors);
router.use('/appointments', appointments);
router.use('/billing', billing);
router.use('/specialisation', specialisation);
router.use('/prescriptions', prescription);
router.use('/clinical', clinical);

export default router;
import express from 'express';
import patients from './patients';
import doctors from './doctors';
import appointments from './appointments';
import billing from './billing';
import specialisation from './specialisation';
import prescription from './prescription';
import clinical from './clinical';

const router = express.Router();

router.use('/patients', patients);
router.use('/doctors', doctors);
router.use('/appointments', appointments);
router.use('/billing', billing);
router.use('/specialisation', specialisation);
router.use('/prescriptions', prescription);
router.use('/clinical', clinical);

export default router;
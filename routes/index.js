import express from 'express';
import patients from './patients';
import doctors from './doctors';
import appointments from './appointments';
import billing from './billing';
import specialisation from './specialisation';

const router = express.Router();

router.use('/patients', patients);
router.use('/doctors', doctors);
router.use('/appointments', appointments);
router.use('/billing', billing);
router.use('/specialisation', specialisation);

export default router;
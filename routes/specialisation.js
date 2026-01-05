import express from 'express';
import * as specialisationController from '../src/controllers/specialisationController.js';

const router = express.Router();

// Get all specialisations
router.get('/', specialisationController.getAllSpecialisations);

// Get specialisation by ID
router.get('/:id', specialisationController.getSpecialisationById);

// Create new specialisation
router.post('/', specialisationController.createSpecialisation);

// Update specialisation
router.put('/:id', specialisationController.updateSpecialisation);

// Delete specialisation
router.delete('/:id', specialisationController.deleteSpecialisation);

export default router;
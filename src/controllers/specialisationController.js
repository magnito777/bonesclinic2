import * as specialisationModel from '../model/specialisationModel.js';

export function getAllSpecialisations(req, res) {
    try {
        const specialisations = specialisationModel.getAllSpecialisations();
        res.status(200).json(specialisations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export function getSpecialisationById(req, res) {
    try {
        const specialisation = specialisationModel.getSpecialisationById(Number(req.params.id));
        if (!specialisation) {
            return res.status(404).json({ message: 'Specialisation not found' });
        }
        res.status(200).json(specialisation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export function createSpecialisation(req, res) {
    try {
        const specialisation = specialisationModel.createSpecialisation(req.body);
        res.status(201).json(specialisation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export function updateSpecialisation(req, res) {
    try {
        const specialisation = specialisationModel.updateSpecialisation(Number(req.params.id), req.body);
        if (!specialisation) {
            return res.status(404).json({ message: 'Specialisation not found' });
        }
        res.status(200).json(specialisation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export function deleteSpecialisation(req, res) {
    try {
        const success = specialisationModel.deleteSpecialisation(Number(req.params.id));
        if (!success) {
            return res.status(404).json({ message: 'Specialisation not found' });
        }
        res.status(200).json({ message: 'Specialisation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
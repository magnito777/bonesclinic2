import Patient from '../model/patientModel';
/**
 * Patient controller - CRUD operations
 */

async function createPatient(req, res) {
    const patient = req.body;
    try {
        const newPatient = await Patient.createPatient(patient);
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error: error.message });
    }
}

function removeNulls(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        return value === null ? undefined : value;
    }));
}

async function getPatients(req, res) {
    try {
        const { search } = req.query;
        const patients = await Patient.getPatients(search);
        res.json(removeNulls(patients));
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving patients', error: error.message });
    }


}

async function getPatientById(req, res) {
    const id = Number(req.params.id);
    try {
        const patient = await Patient.getPatientById(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(removeNulls(patient));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving patient', error: error.message });
    }
}

async function updatePatient(req, res) {
    const id = Number(req.params.id);
    const fields = req.body;
    try {
        const updated = await Patient.updatePatient(id, fields);
        if (!updated) return res.status(404).json({ message: 'Patient not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
}

async function deletePatient(req, res) {
    const id = Number(req.params.id);
    try {
        await Patient.deletePatient(id);
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient', error: error.message });
    }
}


const patientsController = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
};

export default patientsController;
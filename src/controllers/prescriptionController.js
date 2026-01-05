import Prescription from '../model/prescriptionModel';

function removeNulls(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        return value === null ? undefined : value;
    }));
}

async function list(req, res) {
    try {
        const { search } = req.query;
        const prescriptions = await Prescription.getAllPrescriptions(search);
        res.json(removeNulls(prescriptions));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving prescriptions', error: error.message });
    }
}

async function get(req, res) {
    const id = Number(req.params.id);
    try {
        const prescription = await Prescription.getPrescriptionById(id);
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.json(removeNulls(prescription));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving prescription', error: error.message });
    }
}

async function create(req, res) {
    try {
        const newPrescription = await Prescription.createPrescription(req.body);
        res.status(201).json(removeNulls(newPrescription));
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription', error: error.message });
    }
}

async function update(req, res) {
    const id = Number(req.params.id);
    try {
        const updated = await Prescription.updatePrescription(id, req.body);
        if (!updated) return res.status(404).json({ message: 'Prescription not found' });
        res.json(removeNulls(updated));
    } catch (error) {
        res.status(500).json({ message: 'Error updating prescription', error: error.message });
    }
}

async function remove(req, res) {
    const id = Number(req.params.id);
    try {
        await Prescription.deletePrescription(id);
        res.json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting prescription', error: error.message });
    }
}

const prescriptionController = {
    list,
    get,
    create,
    update,
    remove
};

export default prescriptionController;

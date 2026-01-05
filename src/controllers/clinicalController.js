import Clinical from '../model/clinicalModel';

function removeNulls(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        return value === null ? undefined : value;
    }));
}

// Vitals Handlers
async function addVitals(req, res) {
    try {
        const vitals = await Clinical.createVitals(req.body);
        res.status(201).json(removeNulls(vitals));
    } catch (error) {
        res.status(500).json({ message: 'Error recording vitals', error: error.message });
    }
}

async function listVitalsByPatient(req, res) {
    const patientId = Number(req.params.patientId);
    try {
        const list = await Clinical.getVitalsByPatientId(patientId);
        res.json(removeNulls(list));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vitals', error: error.message });
    }
}

async function listVitals(req, res) {
    try {
        const list = await Clinical.getAllVitals();
        res.json(removeNulls(list));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vitals', error: error.message });
    }
}

// Notes Handlers
async function addNote(req, res) {
    try {
        const note = await Clinical.createNote(req.body);
        res.status(201).json(removeNulls(note));
    } catch (error) {
        res.status(500).json({ message: 'Error recording note', error: error.message });
    }
}

async function listNotesByPatient(req, res) {
    const patientId = Number(req.params.patientId);
    try {
        const list = await Clinical.getNotesByPatientId(patientId);
        res.json(removeNulls(list));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notes', error: error.message });
    }
}

async function listNotes(req, res) {
    try {
        const list = await Clinical.getAllNotes();
        res.json(removeNulls(list));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notes', error: error.message });
    }
}

const clinicalController = {
    addVitals,
    listVitalsByPatient,
    listVitals,
    addNote,
    listNotesByPatient,
    listNotes
};

export default clinicalController;

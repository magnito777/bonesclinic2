import Appointment from "../model/appointmentModel";

export async function list(req, res) {
    try {
        const filters = {};
        if (req.query.doctor_id) filters.doctor_id = req.query.doctor_id;
        if (req.query.patient_id) filters.patient_id = req.query.patient_id;
        if (req.query.status_id) filters.status_id = req.query.status_id;

        const appointments = await Appointment.listAppointments(filters);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error listing appointments', error: error.message });
    }
}

export async function get(req, res) {
    const id = Number(req.params.id);
    try {
        const appointment = await Appointment.getAppointmentById(id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving appointment', error: error.message });
    }
}

export async function create(req, res) {
    const appointment = req.body;
    try {
        const newAppointment = await Appointment.createAppointment(appointment);
        if (newAppointment.error) return res.status(409).json({ message: newAppointment.error });
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
}

export async function updateStatus(req, res) {
    const id = Number(req.params.id);
    const { status_id } = req.body;
    try {
        const updated = await Appointment.updateAppointmentStatus(id, status_id);
        if (!updated) return res.status(404).json({ message: 'Appointment not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment status', error: error.message });
    }
}

export async function addNote(req, res) {
    const id = Number(req.params.id);
    const { notes, created_by } = req.body;
    try {
        const note = await Appointment.addNote(id, notes, created_by);
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error adding note', error: error.message });
    }
}

export async function listNotes(req, res) {
    const id = Number(req.params.id);
    try {
        const notes = await Appointment.listNotes(id);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error listing notes', error: error.message });
    }
}

export async function addPrescription(req, res) {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const prescription = await Appointment.addPrescription(id, data);
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ message: 'Error adding prescription', error: error.message });
    }
}

export async function listPrescriptions(req, res) {
    const id = Number(req.params.id);
    try {
        const prescriptions = await Appointment.listPrescriptions(id);
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error listing prescriptions', error: error.message });
    }
}
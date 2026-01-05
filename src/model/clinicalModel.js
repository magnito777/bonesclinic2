import db from '../databases/db.js';

// --- Vitals ---

async function createVitals(data) {
    const {
        patient_id,
        appointment_id,
        temperature,
        blood_pressure_systolic,
        blood_pressure_diastolic,
        heart_rate,
        respiratory_rate,
        oxygen_saturation,
        weight,
        height,
        created_by
    } = data;

    const sql = `
        INSERT INTO vitals (
            patient_id, appointment_id, temperature, 
            blood_pressure_systolic, blood_pressure_diastolic, 
            heart_rate, respiratory_rate, oxygen_saturation, 
            weight, height, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *`;

    return await db.query(sql).get(
        patient_id, appointment_id, temperature,
        blood_pressure_systolic, blood_pressure_diastolic,
        heart_rate, respiratory_rate, oxygen_saturation,
        weight, height, created_by
    );
}

async function getVitalsByPatientId(patientId) {
    const sql = 'SELECT * FROM vitals WHERE patient_id = ? ORDER BY created_at DESC';
    return await db.query(sql).all(patientId);
}

async function getAllVitals() {
    const sql = `
        SELECT v.*, p.first_name || ' ' || p.last_name AS patient_name
        FROM vitals v
        JOIN patient p ON v.patient_id = p.id
        ORDER BY v.created_at DESC
    `;
    return await db.query(sql).all();
}

// --- Clinical Notes ---

async function createNote(data) {
    const { appointment_id, notes, created_by } = data;
    const sql = `
        INSERT INTO appointment_note (appointment_id, notes, created_by)
        VALUES (?, ?, ?)
        RETURNING *`;
    return await db.query(sql).get(appointment_id, notes, created_by);
}

async function getNotesByPatientId(patientId) {
    const sql = `
        SELECT an.*, a.appointment_datetime
        FROM appointment_note an
        JOIN appointment a ON an.appointment_id = a.id
        WHERE a.patient_id = ?
        ORDER BY an.created_at DESC
    `;
    return await db.query(sql).all(patientId);
}

async function getNotesByAppointmentId(appointmentId) {
    const sql = 'SELECT * FROM appointment_note WHERE appointment_id = ? ORDER BY created_at DESC';
    return await db.query(sql).all(appointmentId);
}

async function getAllNotes() {
    const sql = 'SELECT * FROM appointment_note ORDER BY created_at DESC';
    return await db.query(sql).all();
}

const Clinical = {
    createVitals,
    getVitalsByPatientId,
    getAllVitals,
    createNote,
    getNotesByPatientId,
    getNotesByAppointmentId,
    getAllNotes
};

export default Clinical;

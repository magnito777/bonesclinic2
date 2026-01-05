import db from "../databases/db";

async function getAllPrescriptions(search) {
    let sql = `
        SELECT p.*, a.appointment_date, pt.first_name as patient_first_name, pt.last_name as patient_last_name, d.first_name as doctor_first_name, d.last_name as doctor_last_name
        FROM prescription p
        JOIN appointment a ON p.prescribed_appointment_id = a.id
        JOIN patient pt ON a.patient_id = pt.id
        JOIN doctor d ON a.doctor_id = d.id
    `;
    const params = [];

    if (search) {
        sql += ' WHERE p.medicine_name LIKE ?';
        params.push(`%${search}%`);
    }

    sql += ' ORDER BY p.created_at DESC';
    return await db.query(sql).all(...params);
}

async function getPrescriptionById(id) {
    const sql = `
        SELECT p.*, a.appointment_datetime, pt.first_name as patient_first_name, pt.last_name as patient_last_name, d.first_name as doctor_first_name, d.last_name as doctor_last_name
        FROM prescription p
        JOIN appointment a ON p.prescribed_appointment_id = a.id
        JOIN patient pt ON a.patient_id = pt.id
        JOIN doctor d ON a.doctor_id = d.id
        WHERE p.id = ?
    `;
    return await db.query(sql).get(id) || null;
}

async function createPrescription(data) {
    const {
        prescribed_appointment_id,
        medicine_name,
        dosage,
        frequency,
        instructions,
        created_by
    } = data;

    const sql = `
        INSERT INTO prescription (
            prescribed_appointment_id,
            medicine_name,
            dosage,
            frequency,
            instructions,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *`;

    return await db.query(sql).get(
        prescribed_appointment_id,
        medicine_name,
        dosage,
        frequency,
        instructions,
        created_by
    );
}

async function updatePrescription(id, fields = {}) {
    const keys = Object.keys(fields);
    if (!keys.length) return await getPrescriptionById(id);

    const sets = keys.map((k, i) => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    const sql = `UPDATE prescription SET ${sets} WHERE id = ? RETURNING *`;

    return await db.query(sql).get(...values, id);
}

async function deletePrescription(id) {
    const sql = 'DELETE FROM prescription WHERE id = ?';
    await db.query(sql).run(id);
    return true;
}

const Prescription = {
    getAllPrescriptions,
    getPrescriptionById,
    createPrescription,
    updatePrescription,
    deletePrescription
};

export default Prescription;

import db from "../databases/db.js";

async function getPatients(search) {
    let sql = 'SELECT * FROM patient';
    const params = [];

    if (search) {
        sql += ' WHERE first_name LIKE ? OR last_name LIKE ?';
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY last_name, first_name';
    return db.query(sql).all(...params);
}

async function getPatientById(id) {
    const sql = 'SELECT * FROM patient WHERE id = ?';
    return await db.query(sql).get(id) || null;
}

async function createPatient(patientData) {
    const {
        first_name, last_name, gender, date_of_birth, dob,
        phone_number, phone, email_address, email,
        address_line1, address_line2, state, country
    } = patientData;

    // Handle aliases for backward compatibility or convenience
    const d_o_b = date_of_birth || dob;
    const ph = phone_number || phone;
    const em = email_address || email;

    const sql = `
        INSERT INTO patient (
            first_name, last_name, gender, date_of_birth, 
            phone_number, email_address, address_line1, address_line2, 
            state, country
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *`;

    return await db.query(sql).get(
        first_name, last_name, gender, d_o_b,
        ph, em, address_line1, address_line2,
        state, country
    );
}

async function updatePatient(id, fields = {}) {
    const keys = Object.keys(fields);
    if (!keys.length) return await getPatientById(id);

    const sets = keys.map((k, i) => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    const sql = `UPDATE patient SET ${sets} WHERE id = ? RETURNING *`;

    return await db.query(sql).get(...values, id);
}

async function deletePatient(id) {
    const sql = 'DELETE FROM patient WHERE id = ?';
    await db.query(sql).run(id);
    return true;
}





const Patient = {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,

};

export default Patient;
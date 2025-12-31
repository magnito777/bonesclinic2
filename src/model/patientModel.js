import db from "../databases/db";

async function getPatients() {
    const sql = 'SELECT * FROM patients ORDER BY last_name, first_name';
    const res = await db.query(sql);
    return res.rows ?? res;
}

async function getPatientById(id) {
    const sql = 'SELECT * FROM patients WHERE id = $1';
    const res = await db.query(sql, [id]);
    return (res.rows ?? res)[0] ?? null;
}

async function createPatient({ first_name, last_name, dob, phone, email }) {
    const sql = `
        INSERT INTO patients (first_name, last_name, dob, phone, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
    const res = await db.query(sql, [first_name, last_name, dob, phone, email]);
    return (res.rows ?? res)[0];
}

async function updatePatient(id, fields = {}) {
    const keys = Object.keys(fields);
    if (!keys.length) return getPatientById(id);
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map(k => fields[k]);
    const sql = `UPDATE patients SET ${sets} WHERE id = $${keys.length + 1} RETURNING *`;
    const res = await db.query(sql, [...values, id]);
    return (res.rows ?? res)[0];
}

async function deletePatient(id) {
    const sql = 'DELETE FROM patients WHERE id = $1';
    await db.query(sql, [id]);
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
import db from '../databases/db';

export async function listAppointments(filters = {}) {
  const conditions = [];
  const params = [];
  if (filters.doctor_id) { conditions.push('doctor_id = ?'); params.push(filters.doctor_id); }
  if (filters.patient_id) { conditions.push('patient_id = ?'); params.push(filters.patient_id); }
  if (filters.status_id) { conditions.push('status_id = ?'); params.push(filters.status_id); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT a.*, p.first_name || ' ' || p.last_name AS patient_name, d.first_name || ' ' || d.last_name AS doctor_name, s.name AS status_name FROM appointment a
    LEFT JOIN patient p ON p.id = a.patient_id
    LEFT JOIN doctor d ON d.id = a.doctor_id
    LEFT JOIN appointment_status s ON s.id = a.status_id
    ${where}
    ORDER BY appointment_datetime DESC`;
  return await db.query(sql).all(...params);
}

export async function getAppointmentById(id) {
  return await db.query('SELECT * FROM appointment WHERE id = ?').get(id);
}

export async function createAppointment(a) {
  const conflictSql = 'SELECT id FROM appointment WHERE doctor_id = ? AND appointment_datetime = ?';
  const conflict = await db.query(conflictSql).all(a.doctor_id, a.appointment_datetime);
  if (conflict.length) return { error: 'conflict' };

  const sql = 'INSERT INTO appointment (patient_id, doctor_id, appointment_datetime, status_id, reason) VALUES (?, ?, ?, ?, ?) RETURNING id';
  const res = await db.query(sql).get(a.patient_id, a.doctor_id, a.appointment_datetime, a.status_id ?? 1, a.reason ?? null);
  return await getAppointmentById(res.id);
}

export async function updateAppointmentStatus(id, status_id) {
  const sql = 'UPDATE appointment SET status_id = ? WHERE id = ?';
  await db.query(sql).run(status_id, id);
  return await getAppointmentById(id);
}

export async function addNote(appointment_id, notes, created_by) {
  const sql = 'INSERT INTO appointment_note (appointment_id, notes, created_by) VALUES (?, ?, ?) RETURNING id';
  const res = await db.query(sql).get(appointment_id, notes, created_by ?? null);
  return await db.query('SELECT * FROM appointment_note WHERE id = ?').get(res.id);
}

export async function listNotes(appointment_id) {
  return await db.query('SELECT * FROM appointment_note WHERE appointment_id = ? ORDER BY created_at DESC').all(appointment_id);
}

export async function addPrescription(appointment_id, data) {
  const sql = 'INSERT INTO prescription (prescribed_appointment_id, medicine_name, dosage, frequency, instructions, created_by) VALUES (?, ?, ?, ?, ?, ?) RETURNING id';
  const res = await db.query(sql).get(appointment_id, data.medicine_name, data.dosage ?? null, data.frequency ?? null, data.instructions ?? null, data.created_by ?? null);
  return await db.query('SELECT * FROM prescription WHERE id = ?').get(res.id);
}

export async function listPrescriptions(appointment_id) {
  return await db.query('SELECT * FROM prescription WHERE prescribed_appointment_id = ? ORDER BY created_at DESC').all(appointment_id);
}

const Appointment = {
  listAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  addNote,
  listNotes,
  addPrescription,
  listPrescriptions,
};

export default Appointment
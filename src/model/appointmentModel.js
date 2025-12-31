import db from '../databases/db';

export function listAppointments(filters = {}) {
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
  return db.query(sql).all(...params);
}

export function getAppointmentById(id) {
  const rows = db.query('SELECT * FROM appointment WHERE id = ?').all(id);
  return rows[0];
}

export function createAppointment(a) {
  const conflict = db.query('SELECT id FROM appointment WHERE doctor_id = ? AND appointment_datetime = ?').all(a.doctor_id, a.appointment_datetime);
  if (conflict.length) return { error: 'conflict' };
  const info = db.prepare('INSERT INTO appointment (patient_id, doctor_id, appointment_datetime, status_id, reason) VALUES (?, ?, ?, ?, ?)').run(a.patient_id, a.doctor_id, a.appointment_datetime, a.status_id ?? 1, a.reason ?? null);
  const id = info.lastInsertRowid;
  return getAppointmentById(id);
}

export function updateAppointmentStatus(id, status_id) {
  const info = db.prepare('UPDATE appointment SET status_id = ? WHERE id = ?').run(status_id, id);
  if (info.changes === 0) return null;
  return getAppointmentById(id);
}

export function addNote(appointment_id, notes, created_by) {
  const info = db.prepare('INSERT INTO appointment_note (appointment_id, notes, created_by) VALUES (?, ?, ?)').run(appointment_id, notes, created_by ?? null);
  const id = info.lastInsertRowid;
  return db.query('SELECT * FROM appointment_note WHERE id = ?').get(id);
}

export function listNotes(appointment_id) {
  return db.query('SELECT * FROM appointment_note WHERE appointment_id = ? ORDER BY created_at DESC').all(appointment_id);
}

export function addPrescription(appointment_id, data) {
  const info = db.prepare('INSERT INTO prescription (prescribed_appointment_id, medicine_name, dosage, frequency, instructions, created_by) VALUES (?, ?, ?, ?, ?, ?)').run(appointment_id, data.medicine_name, data.dosage ?? null, data.frequency ?? null, data.instructions ?? null, data.created_by ?? null);
  const id = info.lastInsertRowid;
  return db.query('SELECT * FROM prescription WHERE id = ?').get(id);
}

export function listPrescriptions(appointment_id) {
  return db.query('SELECT * FROM prescription WHERE prescribed_appointment_id = ? ORDER BY created_at DESC').all(appointment_id);
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
import db from '../databases/db';

export function listBills() {
  return db.query(`SELECT b.*, a.appointment_datetime, p.first_name || ' ' || p.last_name AS patient_name, pm.name AS payment_method, bs.name AS bill_status
    FROM patient_bill b
    LEFT JOIN appointment a ON a.id = b.appointment_id
    LEFT JOIN patient p ON p.id = a.patient_id
    LEFT JOIN payment_method pm ON pm.id = b.payment_method_id
    LEFT JOIN bill_status bs ON bs.id = b.bill_status_id
    ORDER BY b.created_at DESC`).all();
}

export function getBill(id) {
  const rows = db.query('SELECT * FROM patient_bill WHERE id = ?').all(id);
  return rows[0];
}

export function createBill(appointment_id, amount, bill_status_id, payment_method_id) {
  const info = db.prepare('INSERT INTO patient_bill (appointment_id, amount, bill_status_id, payment_method_id) VALUES (?, ?, ?, ?)').run(appointment_id, amount, bill_status_id || 1, payment_method_id || null);
  const id = info.lastInsertRowid;
  return getBill(id);
}

export function updateBill(id, data) {
  const info = db.prepare('UPDATE patient_bill SET amount = COALESCE(?, amount), bill_status_id = COALESCE(?, bill_status_id), payment_method_id = COALESCE(?, payment_method_id) WHERE id = ?').run(data.amount || null, data.bill_status_id || null, data.payment_method_id || null, id);
  if (info.changes === 0) return null;
  return getBill(id);
}

export function payBill(id, payment_method_id) {
  const info = db.prepare('UPDATE patient_bill SET bill_status_id = (SELECT id FROM bill_status WHERE name = "Paid" LIMIT 1), payment_method_id = COALESCE(?, payment_method_id), bill_paid_datetime = datetime(\'now\') WHERE id = ?').run(payment_method_id || null, id);
  if (info.changes === 0) return null;
  return getBill(id);
}


export const Billing = {
  listBills,
  getBill,
  createBill,
  updateBill,
  payBill,
};

export default Billing;

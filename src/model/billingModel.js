import db from '../databases/db.js';

export async function listBills() {
  return await db.query(`SELECT b.*, a.appointment_datetime, p.first_name || ' ' || p.last_name AS patient_name, pm.name AS payment_method, bs.name AS bill_status
    FROM patient_bill b
    LEFT JOIN appointment a ON a.id = b.appointment_id
    LEFT JOIN patient p ON p.id = a.patient_id
    LEFT JOIN payment_method pm ON pm.id = b.payment_method_id
    LEFT JOIN bill_status bs ON bs.id = b.bill_status_id
    ORDER BY b.created_at DESC`).all();
}

export async function getBill(id) {
  return await db.query('SELECT * FROM patient_bill WHERE id = ?').get(id);
}

export async function createBill(appointment_id, amount, bill_status_id, payment_method_id) {
  const sql = 'INSERT INTO patient_bill (appointment_id, amount, bill_status_id, payment_method_id) VALUES (?, ?, ?, ?) RETURNING id';
  const res = await db.query(sql).get(appointment_id, amount, bill_status_id || 1, payment_method_id || null);
  return await getBill(res.id);
}

export async function updateBill(id, data) {
  const sql = 'UPDATE patient_bill SET amount = COALESCE(?, amount), bill_status_id = COALESCE(?, bill_status_id), payment_method_id = COALESCE(?, payment_method_id) WHERE id = ?';
  await db.query(sql).run(data.amount || null, data.bill_status_id || null, data.payment_method_id || null, id);
  return await getBill(id);
}

export async function payBill(id, payment_method_id) {
  const paidStatusSql = 'SELECT id FROM bill_status WHERE name = ? LIMIT 1';
  const status = await db.query(paidStatusSql).get('Paid');
  if (!status) return null;

  const now = db.isPostgres ? 'CURRENT_TIMESTAMP' : 'datetime(\'now\')';
  const sql = `UPDATE patient_bill SET bill_status_id = ?, payment_method_id = COALESCE(?, payment_method_id), bill_paid_datetime = ${now} WHERE id = ?`;
  await db.query(sql).run(status.id, payment_method_id || null, id);
  return await getBill(id);
}


export const Billing = {
  listBills,
  getBill,
  createBill,
  updateBill,
  payBill,
};

export default Billing;

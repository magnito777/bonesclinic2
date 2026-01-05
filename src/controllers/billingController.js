import * as billingModel from '../model/billingModel.js';

export async function list(req, res) {
  res.json(await billingModel.listBills());
}

export async function get(req, res) {
  const id = Number(req.params.id);
  const r = await billingModel.getBill(id);
  if (!r) return res.status(404).json({ message: 'Bill not found' });
  res.json(r);
}

export async function create(req, res) {
  const { appointment_id, amount, bill_status_id, payment_method_id } = req.body;
  if (!appointment_id || amount == null) return res.status(400).json({ message: 'appointment_id and amount required' });
  const r = await billingModel.createBill(appointment_id, amount, bill_status_id, payment_method_id);
  res.status(201).json(r);
}

export async function update(req, res) {
  const id = Number(req.params.id);
  const r = await billingModel.updateBill(id, req.body);
  if (!r) return res.status(404).json({ message: 'Bill not found' });
  res.json(r);
}

export async function pay(req, res) {
  const id = Number(req.params.id);
  const { payment_method_id } = req.body;
  const r = await billingModel.payBill(id, payment_method_id);
  if (!r) return res.status(404).json({ message: 'Bill not found' });
  res.json(r);
}



import * as doctorModel from '../model/doctorModel.js';

export function list(req, res) {
  res.json(doctorModel.getAllDoctors());
}

export function get(req, res) {
  const id = Number(req.params.id);
  const row = doctorModel.getDoctorById(id);
  if (!row) return res.status(404).json({ message: 'Doctor not found' });
  res.json(row);
}

export function create(req, res) {
  const d = req.body;
  if (!d.first_name || !d.last_name) return res.status(400).json({ message: 'first_name and last_name required' });
  const newRow = doctorModel.createDoctor(d, req.body.specialisation_ids || []);
  res.status(201).json(newRow);
}

export function update(req, res) {
  const id = Number(req.params.id);
  const row = doctorModel.getDoctorById(id);
  if (!row) return res.status(404).json({ message: 'Doctor not found' });
  const updated = doctorModel.updateDoctor(id, req.body, req.body.specialisation_ids);
  res.json(updated);
}

export function remove(req, res) {
  const id = Number(req.params.id);
  const ok = doctorModel.deleteDoctor(id);
  if (!ok) return res.status(404).json({ message: 'Doctor not found' });
  res.json({ message: 'Deleted' });
}

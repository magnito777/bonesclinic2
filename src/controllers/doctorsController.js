import * as doctorModel from '../model/doctorModel.js';

function removeNulls(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    return value === null ? undefined : value;
  }));
}

export async function list(req, res) {
  const { search } = req.query;
  res.json(removeNulls(await doctorModel.getAllDoctors(search)));
}

export async function get(req, res) {
  const id = Number(req.params.id);
  const row = await doctorModel.getDoctorById(id);
  if (!row) return res.status(404).json({ message: 'Doctor not found' });
  res.json(removeNulls(row));
}

export async function create(req, res) {
  const d = req.body;
  if (!d.first_name || !d.last_name) return res.status(400).json({ message: 'first_name and last_name required' });
  const newRow = await doctorModel.createDoctor(d, req.body.specialisation_ids || []);
  res.status(201).json(newRow);
}

export async function update(req, res) {
  const id = Number(req.params.id);
  const row = await doctorModel.getDoctorById(id);
  if (!row) return res.status(404).json({ message: 'Doctor not found' });
  const updated = await doctorModel.updateDoctor(id, req.body, req.body.specialisation_ids);
  res.json(updated);
}

export async function remove(req, res) {
  const id = Number(req.params.id);
  const ok = await doctorModel.deleteDoctor(id);
  if (!ok) return res.status(404).json({ message: 'Doctor not found' });
  res.json({ message: 'Deleted' });
}

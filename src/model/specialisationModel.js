import db from '../databases/db';

export function getAllSpecialisations() {
  return [...db.query('SELECT * FROM specialisation ORDER BY name')];
}

export function getSpecialisationById(id) {
  const rows = [...db.query('SELECT * FROM specialisation WHERE id = ?', [id])];
  return rows[0];
}

export function createSpecialisation({ name }) {
  const info = db.prepare('INSERT INTO specialisation (name) VALUES (?)').run(name);
  const id = info.lastInsertRowid;
  return getSpecialisationById(id);
}

export function updateSpecialisation(id, { name }) {
  const info = db.prepare('UPDATE specialisation SET name = ? WHERE id = ?').run(name, id);
  return info.changes > 0 ? getSpecialisationById(id) : null;
}

export function deleteSpecialisation(id) {
  const info = db.prepare('DELETE FROM specialisation WHERE id = ?').run(id);
  return info.changes > 0;
}


const specialisation = {
  getAllSpecialisations,
  getSpecialisationById,
  createSpecialisation,
  updateSpecialisation,
  deleteSpecialisation,
};


export default specialisation

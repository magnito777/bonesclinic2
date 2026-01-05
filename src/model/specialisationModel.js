import db from '../databases/db';

export async function getAllSpecialisations() {
  return await db.query('SELECT * FROM specialisation ORDER BY name').all();
}

export async function getSpecialisationById(id) {
  return await db.query('SELECT * FROM specialisation WHERE id = ?').get(id);
}

export async function createSpecialisation({ name }) {
  const res = await db.query('INSERT INTO specialisation (name) VALUES (?) RETURNING id').get(name);
  return await getSpecialisationById(res.id);
}

export async function updateSpecialisation(id, { name }) {
  await db.query('UPDATE specialisation SET name = ? WHERE id = ?').run(name, id);
  return await getSpecialisationById(id);
}

export async function deleteSpecialisation(id) {
  await db.query('DELETE FROM specialisation WHERE id = ?').run(id);
  return true;
}


const specialisation = {
  getAllSpecialisations,
  getSpecialisationById,
  createSpecialisation,
  updateSpecialisation,
  deleteSpecialisation,
};


export default specialisation

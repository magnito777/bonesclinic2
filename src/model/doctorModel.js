import db from '../databases/db.js';


export async function getAllDoctors(search) {
  const concatFn = db.isPostgres ? 'STRING_AGG(s.name, \',\')' : 'GROUP_CONCAT(s.name)';
  let sql = `SELECT d.*, ${concatFn} AS specialisations
    FROM doctor d
    LEFT JOIN doctor_specialisations ds ON ds.doctor_id = d.id
    LEFT JOIN specialisation s ON s.id = ds.specialisation_id`;

  const params = [];
  if (search) {
    sql += ' WHERE d.first_name LIKE ? OR d.last_name LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ` GROUP BY d.id
    ORDER BY d.id DESC`;

  return await db.query(sql).all(...params);
}

export async function getDoctorById(id) {
  const concatFn = db.isPostgres ? 'STRING_AGG(s.name, \',\')' : 'GROUP_CONCAT(s.name)';
  const sql = `SELECT d.*, ${concatFn} AS specialisations
    FROM doctor d
    LEFT JOIN doctor_specialisations ds ON ds.doctor_id = d.id
    LEFT JOIN specialisation s ON s.id = ds.specialisation_id
    WHERE d.id = ?
    GROUP BY d.id`;

  return await db.query(sql).get(id);
}

export async function createDoctor(d, specialisation_ids = []) {
  const sql = 'INSERT INTO doctor (first_name, last_name, gender_id) VALUES (?, ?, ?) RETURNING id';
  const res = await db.query(sql).get(d.first_name, d.last_name, d.gender_id ?? null);
  const id = res.id;

  if (Array.isArray(specialisation_ids) && specialisation_ids.length) {
    for (const sid of specialisation_ids) {
      await db.query('INSERT INTO doctor_specialisations (doctor_id, specialisation_id) VALUES (?, ?)').run(id, sid);
    }
  }
  return await getDoctorById(id);
}

export async function updateDoctor(id, d, specialisation_ids) {
  const existing = await getDoctorById(id);
  if (!existing) return null;
  const sql = 'UPDATE doctor SET first_name = ?, last_name = ?, gender_id = ? WHERE id = ?';
  await db.query(sql).run(d.first_name ?? existing.first_name, d.last_name ?? existing.last_name, d.gender_id ?? existing.gender_id, id);

  if (Array.isArray(specialisation_ids)) {
    await db.query('DELETE FROM doctor_specialisations WHERE doctor_id = ?').run(id);
    for (const sid of specialisation_ids) {
      await db.query('INSERT INTO doctor_specialisations (doctor_id, specialisation_id) VALUES (?, ?)').run(id, sid);
    }
  }
  return await getDoctorById(id);
}

export async function deleteDoctor(id) {
  const sql = 'DELETE FROM doctor WHERE id = ?';
  await db.query(sql).run(id);
  return true;
}


const Doctor =
{
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};


export default Doctor;






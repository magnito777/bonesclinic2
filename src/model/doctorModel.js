import db from '../databases/db';


export function getAllDoctors() {
  return [...db.query(`SELECT d.*, GROUP_CONCAT(s.name) AS specialisations
    FROM doctor d
    LEFT JOIN doctor_specialisations ds ON ds.doctor_id = d.id
    LEFT JOIN specialisation s ON s.id = ds.specialisation_id
    GROUP BY d.id
    ORDER BY d.id DESC`)
  ];
}

export function getDoctorById(id) {
  const rows = [...db.query(`SELECT d.*, GROUP_CONCAT(s.name) AS specialisations
    FROM doctor d
    LEFT JOIN doctor_specialisations ds ON ds.doctor_id = d.id
    LEFT JOIN specialisation s ON s.id = ds.specialisation_id
    WHERE d.id = ?
    GROUP BY d.id`, [id])];
  return rows[0];
}

export function createDoctor(d, specialisation_ids = []) {
  const info = db.prepare('INSERT INTO doctor (first_name, last_name, gender_id) VALUES (?, ?, ?)').run(d.first_name, d.last_name, d.gender_id ?? null);
  const id = info.lastInsertRowid;
  if (Array.isArray(specialisation_ids) && specialisation_ids.length) {
    const stmt = db.prepare('INSERT OR IGNORE INTO doctor_specialisations (doctor_id, specialisation_id) VALUES (?, ?)');
    for (const sid of specialisation_ids) stmt.run(id, sid);
  }
  return getDoctorById(id);
}

export function updateDoctor(id, d, specialisation_ids) {
  const existing = getDoctorById(id);
  if (!existing) return null;
  db.prepare('UPDATE doctor SET first_name = ?, last_name = ?, gender_id = ? WHERE id = ?').run(d.first_name ?? existing.first_name, d.last_name ?? existing.last_name, d.gender_id ?? existing.gender_id, id);
  if (Array.isArray(specialisation_ids)) {
    db.prepare('DELETE FROM doctor_specialisations WHERE doctor_id = ?').run(id);
    const stmt = db.prepare('INSERT INTO doctor_specialisations (doctor_id, specialisation_id) VALUES (?, ?)');
    for (const sid of specialisation_ids) stmt.run(id, sid);
  }
  return getDoctorById(id);
}

export function deleteDoctor(id) {
  const info = db.prepare('DELETE FROM doctor WHERE id = ?').run(id);
  return info.changes > 0;
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






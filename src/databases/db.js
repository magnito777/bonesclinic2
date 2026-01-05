import { Database } from "bun:sqlite";
import { SQL } from "bun";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
let dbInstance;
let isPostgres = false;

if (databaseUrl) {
  dbInstance = new SQL(databaseUrl);
  isPostgres = true;
} else {
  dbInstance = new Database('clinic.db');
}

/**
 * Unified Database Wrapper
 * Provides a consistent async interface for both bun:sqlite and bun:sql
 */
export const db = {
  isPostgres,
  query: (sql) => {
    // Convert ? to $1, $2, etc for Postgres if needed
    // Bun SQL actually handles ? but some dialects prefer $1
    // However, Bun's SQL tag and function call support ? or $1
    let processedSql = sql;

    return {
      all: async (...params) => {
        if (isPostgres) {
          return await dbInstance(processedSql, params);
        } else {
          return dbInstance.query(processedSql).all(...params);
        }
      },
      get: async (...params) => {
        if (isPostgres) {
          const result = await dbInstance(processedSql, params);
          return result[0];
        } else {
          return dbInstance.query(processedSql).get(...params);
        }
      },
      run: async (...params) => {
        if (isPostgres) {
          return await dbInstance(processedSql, params);
        } else {
          return dbInstance.query(processedSql).run(...params);
        }
      }
    };
  }
};

const initSql = isPostgres ? `
-- Postgres Schema
CREATE TABLE IF NOT EXISTS gender (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS country (
  id SERIAL PRIMARY KEY,
  country_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS specialisation (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS doctor (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender_id INTEGER REFERENCES gender(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctor_specialisations (
  doctor_id INTEGER NOT NULL REFERENCES doctor(id) ON DELETE CASCADE,
  specialisation_id INTEGER NOT NULL REFERENCES specialisation(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, specialisation_id)
);

CREATE TABLE IF NOT EXISTS patient (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT,
  date_of_birth TEXT,
  phone_number TEXT,
  email_address TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  state TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointment_status (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointment (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patient(id),
  doctor_id INTEGER NOT NULL REFERENCES doctor(id),
  appointment_datetime TEXT NOT NULL,
  status_id INTEGER DEFAULT 1 REFERENCES appointment_status(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointment_note (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointment(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES doctor(id)
);

CREATE TABLE IF NOT EXISTS prescription (
  id SERIAL PRIMARY KEY,
  prescribed_appointment_id INTEGER NOT NULL REFERENCES appointment(id),
  medicine_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES doctor(id)
);

CREATE TABLE IF NOT EXISTS vitals (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patient(id),
  appointment_id INTEGER REFERENCES appointment(id),
  temperature REAL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  oxygen_saturation INTEGER,
  weight REAL,
  height REAL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES doctor(id)
);

CREATE TABLE IF NOT EXISTS payment_method (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bill_status (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS patient_bill (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointment(id),
  amount REAL,
  bill_status_id INTEGER REFERENCES bill_status(id),
  payment_method_id INTEGER REFERENCES payment_method(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  bill_paid_datetime TEXT
);

INSERT INTO gender (id, name) VALUES (1, 'Male'), (2, 'Female'), (3, 'Other') ON CONFLICT (id) DO NOTHING;
INSERT INTO country (id, country_name) VALUES (1, 'USA'), (2, 'Canada'), (3, 'UK') ON CONFLICT (id) DO NOTHING;
INSERT INTO appointment_status (id, name) VALUES (1, 'Scheduled'), (2, 'Completed'), (3, 'Cancelled') ON CONFLICT (id) DO NOTHING;
INSERT INTO bill_status (id, name) VALUES (1, 'Pending'), (2, 'Paid'), (3, 'Overdue') ON CONFLICT (id) DO NOTHING;
INSERT INTO payment_method (id, name) VALUES (1, 'Cash'), (2, 'Credit Card'), (3, 'Insurance') ON CONFLICT (id) DO NOTHING;
` : `
-- SQLite Schema
BEGIN;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS gender (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS country (
  id INTEGER PRIMARY KEY, country_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS specialisation (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS doctor (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (gender_id) REFERENCES gender(id)
);

CREATE TABLE IF NOT EXISTS doctor_specialisations (
  doctor_id INTEGER NOT NULL,
  specialisation_id INTEGER NOT NULL,
  PRIMARY KEY (doctor_id, specialisation_id),
  FOREIGN KEY (doctor_id) REFERENCES doctor(id) ON DELETE CASCADE,
  FOREIGN KEY (specialisation_id) REFERENCES specialisation(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS patient (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT,
  date_of_birth TEXT,
  phone_number TEXT,
  email_address TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  state TEXT,
  country TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS appointment_status (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointment (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  appointment_datetime TEXT NOT NULL,
  status_id INTEGER DEFAULT 1,
  reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patient(id),
  FOREIGN KEY (doctor_id) REFERENCES doctor(id),
  FOREIGN KEY (status_id) REFERENCES appointment_status(id)
);

CREATE TABLE IF NOT EXISTS appointment_note (
  id INTEGER PRIMARY KEY,
  appointment_id INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  created_by INTEGER,
  FOREIGN KEY (appointment_id) REFERENCES appointment(id),
  FOREIGN KEY (created_by) REFERENCES doctor(id)
);

CREATE TABLE IF NOT EXISTS prescription (
  id INTEGER PRIMARY KEY,
  prescribed_appointment_id INTEGER NOT NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  instructions TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  created_by INTEGER,
  FOREIGN KEY (prescribed_appointment_id) REFERENCES appointment(id),
  FOREIGN KEY (created_by) REFERENCES doctor(id)
);

CREATE TABLE IF NOT EXISTS vitals (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  appointment_id INTEGER,
  temperature REAL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  oxygen_saturation INTEGER,
  weight REAL,
  height REAL,
  created_at TEXT DEFAULT (datetime('now')),
  created_by INTEGER,
  FOREIGN KEY (patient_id) REFERENCES patient(id),
  FOREIGN KEY (appointment_id) REFERENCES appointment(id),
  FOREIGN KEY (created_by) REFERENCES doctor(id)
);

CREATE TABLE IF NOT EXISTS payment_method (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bill_status (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS patient_bill (
  id INTEGER PRIMARY KEY,
  appointment_id INTEGER NOT NULL,
  amount REAL,
  bill_status_id INTEGER,
  payment_method_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  bill_paid_datetime TEXT,
  FOREIGN KEY (appointment_id) REFERENCES appointment(id),
  FOREIGN KEY (bill_status_id) REFERENCES bill_status(id),
  FOREIGN KEY (payment_method_id) REFERENCES payment_method(id)
);

INSERT OR IGNORE INTO gender (id, name) VALUES (1, 'Male'), (2, 'Female'), (3, 'Other');
INSERT OR IGNORE INTO country (id, country_name) VALUES (1, 'USA'), (2, 'Canada'), (3, 'UK');
INSERT OR IGNORE INTO appointment_status (id, name) VALUES (1, 'Scheduled'), (2, 'Completed'), (3, 'Cancelled');
INSERT OR IGNORE INTO bill_status (id, name) VALUES (1, 'Pending'), (2, 'Paid'), (3, 'Overdue');
INSERT OR IGNORE INTO payment_method (id, name) VALUES (1, 'Cash'), (2, 'Credit Card'), (3, 'Insurance');

COMMIT;
`;

// Run initialization
if (isPostgres) {
  // For postgres, we run statements one by one
  const statements = initSql.split(';').filter(s => s.trim().length > 0);
  for (const statement of statements) {
    try {
      await dbInstance(statement);
    } catch (e) {
      // Some statements like INSERT might fail if already exists but we have ON CONFLICT
      if (!statement.includes('INSERT')) {
        console.error('Error in Postgres Init:', e.message, 'Statement:', statement);
      }
    }
  }
} else {
  dbInstance.run(initSql);
}

console.log(`Database initialized (${isPostgres ? 'Postgres' : 'SQLite'}).`);

export default db;

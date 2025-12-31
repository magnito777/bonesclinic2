import { Database } from "bun:sqlite";

export const db = new Database('clinic.db');

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

const initSql = `
BEGIN;

CREATE TABLE IF NOT EXISTS gender (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS country (
  id INTEGER PRIMARY KEY,
  country_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS specialisation (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
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
  gender_id INTEGER,
  date_of_birth TEXT,
  phone_number TEXT,
  email_address TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  state TEXT,
  country_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (gender_id) REFERENCES gender(id),
  FOREIGN KEY (country_id) REFERENCES country(id)
);

CREATE TABLE IF NOT EXISTS appointment_status (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
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

CREATE TABLE IF NOT EXISTS payment_method (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bill_status (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
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

db.exec(initSql);




console.log('Database initialized.');

export default db;

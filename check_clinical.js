import clinicalController from './src/controllers/clinicalController.js';
import clinicalRouter from './routes/clinical.js';
import Prescription from './src/model/prescriptionModel.js';
import Clinical from './src/model/clinicalModel.js';

console.log('Clinical stack imported successfully.');
console.log('Controller keys:', Object.keys(clinicalController));
console.log('Model keys:', Object.keys(Clinical));

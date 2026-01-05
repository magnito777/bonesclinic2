import express from 'express';
import routes from './routes/index.js';
import ejs from 'ejs';


const port = process.env.PORT || 8000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/documentation', (req, res) => {
  res.render('documentation');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;






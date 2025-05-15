import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://3.89.226.26:3005';

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", BACKEND_URL],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", BACKEND_URL],
    }
  }
}));

// Static files and view setup
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Home page route
app.get('/', async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/actualites`);
    if (!response.ok) throw new Error('Backend API error');
    const actualiteData = await response.json();
    res.render('index', { actualiteData, error: null });
  } catch (error) {
    console.error('Error fetching actualites:', error);
    res.render('index', { actualiteData: [], error: 'Failed to load data' });
  }
});

// Admin routes
app.get('/admin', (req, res) => res.render('login', { error: null }));

app.post('/login', async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.render('login', { error: error.message });
  }
});

app.get('/admin/dashboard', async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/actualites`);
    if (!response.ok) throw new Error('Failed to fetch data');
    const actualites = await response.json();
    res.render('dashboard', { actualites, error: null });
  } catch (error) {
    res.render('dashboard', { actualites: [], error: error.message });
  }
});

// API proxy routes
app.post('/api/actualites', async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/actualites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${port}`);
  console.log(`Connected to backend at ${BACKEND_URL}`);
});

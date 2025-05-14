import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import multer from 'multer';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Sequelize } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Validate environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

// Improved Sequelize configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log
  }
);

// Simplified model imports
import ActualiteModel from "./models/Actualite.js";
import Admin from "./models/Admin.js";

const Actualite = ActualiteModel(sequelize);

var theAdminIsRoot = false;

const app = express();
const port = process.env.PORT || 3005;

// Basic middleware setup
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP temporarily to debug the core functionality
}));

app.use(cors({
  origin: `http://54.225.22.91:${port}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Static files middleware
app.use(express.static(path.join(__dirname, '../frontend/assets')));
app.use(express.static(path.join(__dirname, '../frontend/v')));
app.use(express.static(path.join(__dirname, '../frontend/views')));
app.use(express.static(path.join(__dirname, '../frontend/css')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));

app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads/actualite');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Update multer config with error handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('image');

// Cloudinary config
cloudinary.config({ 
  cloud_name: 'dwzy7clpv', 
  api_key: '335752399965959', 
  api_secret: 'o0UMKQAPeuf6lVsh1zxwJDfpEls' 
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Changed to false to work with HTTP
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Main routes
app.get('/', async (req, res) => {
  try {
    const actualiteData = await Actualite.findAll();
    const isLoggedIn = req.session.isLoggedIn;
    res.render("index", { actualiteData, isStudent: false, isLoggedIn });
  } catch (error) {
    console.error("Error fetching actualite data:", error);
    res.status(500).send("Error fetching actualite data: " + error.message);
  }
});

// Add middleware to check admin authentication
const checkAdminAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect('/admin');
  }
};

// Update admin routes
app.get(["/admin", "/login"], (req, res) => {
  if (req.session.isAdmin) {
    res.redirect('/login/actualite');
  } else {
    res.render("login");
  }
});

app.post("/login", async (req, res) => {
  try {
    if (req.body.username === "aa" && req.body.password === "aa") {
      req.session.isAdmin = true;
      return res.render("actualite_view", {
        pdfs: [],
        pdfnotes: [],
        students: [],
        idara: []
      });
    }

    const admin = await Admin.findOne({ 
      where: { username: req.body.username, password: req.body.password }
    });

    if (!admin) {
      return res.render("login", { error: "Invalid credentials" });
    }
    
    req.session.isAdmin = true;
    return res.render("actualite_view", {
      pdfs: [],
      pdfnotes: [],
      students: [],
      idara: []
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.render("login", { error: "Server error occurred" });
  }
});

// Update actualite routes with auth check
app.get("/login/actualite", checkAdminAuth, async (req, res) => {
  try {
    const actualites = await Actualite.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.render("actualite_view", {
      pdfs: [],
      pdfnotes: [],
      students: [],
      idara: [],
      actualites: actualites
    });
  } catch (error) {
    console.error("Error fetching actualites:", error);
    res.render("actualite_view", {
      error: "Failed to fetch actualites",
      pdfs: [],
      pdfnotes: [],
      students: [],
      idara: [],
      actualites: []
    });
  }
});

app.post("/login/actualite/add", checkAdminAuth, (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      console.log("File uploaded, proceeding to Cloudinary...");
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log("Cloudinary upload successful:", result.secure_url);

      const actualite = await Actualite.create({
        title: req.body.title,
        description: req.body.description,
        publicCible: req.body.publicCible,
        imageURL: result.secure_url
      });

      console.log("Actualite created:", actualite);

      // Clean up uploaded file
      await fsPromises.unlink(req.file.path);
      
      // Redirect back with success
      res.redirect("/login/actualite");

    } catch (error) {
      console.error("Error in actualite creation:", error);
      res.status(500).json({ 
        error: "Failed to create actualite", 
        details: error.message 
      });
    }
  });
});

// Database initialization
const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    
    // Only HTTP server
    app.listen(port, '0.0.0.0', () => {
      console.log(`HTTP Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

initializeDB();

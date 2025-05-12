const express = require('express');
const { MongoClient } = require('mongodb');
const methodOverride = require("method-override");
const session = require('express-session');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const fs = require("fs");
const PDFNotes = require("./models/PDFNotes");
const PDFEmploi = require("./models/PDFEmploi");
const cloudinary = require('cloudinary').v2;
const Student = require("./models/Student");
const Actualite = require('./models/Actualite');
const Admin = require("./models/Admin");
var theAdminIsRoot = false;
const path = require('path');
const sequelize = require('./config/database');

const app = express();
const port = 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000']
}));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'Uni', 'views', 'menu')));
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads_act/') // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original filename for the saved file
  }
});
const upload = multer({ storage: storage });

cloudinary.config({ 
  cloud_name: 'dwzy7clpv', 
  api_key: '335752399965959', 
  api_secret: 'o0UMKQAPeuf6lVsh1zxwJDfpEls' 
});

sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    return sequelize.sync();
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.get('/', async (req, res) => {
  try {
    // Fetch actualite data from the database
    const actualiteData = await Actualite.findAll();
    const isLoggedIn = req.session.isLoggedIn;

    if (isLoggedIn) {
      console.log(isLoggedIn);
      res.render("index", { actualiteData, isStudent: true, isLoggedIn });
    } else {
      console.log(isLoggedIn);
      res.render("index", { actualiteData, isStudent: false, isLoggedIn });
    }
  } catch (error) {
    console.error("Error fetching actualite data:", error);
    res.status(500).send("Error fetching actualite data: " + error.message);
  }
});

// Navbar routes
app.get('/institut', (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    console.log(isLoggedIn);
    res.render("menu/institut", { isStudent: true, isLoggedIn });
  } else {
    console.log(isLoggedIn);
    res.render("menu/institut", {isStudent: false, isLoggedIn });
  }

});

app.get("/formation", function (req, res) {
  const filePath = path.join(__dirname,'institut.ejs');
  res.sendFile(filePath);
});

app.get("/recherche", function (req, res) {
  const filePath = path.join(__dirname,'institut.ejs');
  res.sendFile(filePath);
});

app.get('/entreprise', function (req, res) {
  const isLoggedIn = req.session.isLoggedIn;

  res.render("menu/entreprise", {isStudent: false, isLoggedIn });
})

app.get('/myspace', async (req, res) => {
  const pdfnotes = await PDFNotes.findAll();
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    console.log(isLoggedIn);
    res.render("myspace", { pdfnotes, isStudent: true, isLoggedIn });
  } else {
    console.log(isLoggedIn);
    res.render("myspace", { pdfnotes, isStudent: false, isLoggedIn });
  }
})

// app.js
app.get("/student_notes", async (req, res) => {
  try {
    // Récupérer la spécialité sélectionnée à partir des paramètres de requête
    const specialite = req.query.class_name;

    console.log("Selected specialite:", specialite); // Log the selected specialite

    // Recherchez tous les PDF associés au specialite sélectionné
    const pdfNotes = await PDFNotes.findAll({
      where: { filename: specialite }
    });

    // Construire une liste de liens HTML pour les PDF
    const pdfLinks = pdfNotes.map(pdf => `<li><a href="/pdf_notes/${pdf.id}">${pdf.filename}</a></li>`).join('');

    // Envoyer la liste de liens HTML en tant que réponse
    res.send(pdfLinks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des PDF.");
  }
});

app.post("/login_student", async (req, res) => {
  try {
    const student = await Student.findOne({ 
      where: { email: req.body.signin_email }
    });
    
    if (!student) {
      return res.send("Username not found");
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.signin_password.trim(),
      student.password
    );

    if (isPasswordMatch) {
      req.session.isLoggedIn = true;
      res.redirect("/");
    } else {
      return res.send("Wrong password");
    }
  } catch (error) {
    console.error(error);
    return res.send("Something went wrong");
  }
});

app.post("/logout_student", (req, res) => {
  // Set isLoggedIn to false in the session
  req.session.isLoggedIn = false;
  // Redirect the user to the home page
  res.redirect("/");
});

app.post("/student_notes", async (req,res) =>{
  try {
     const td = req.body.class_name;
     const pdf_notes = await PDFNotes.find({filename: td});
     res.send(pdf_notes.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in signup. Please try again.");
  }
});
//------------------------------------------------------------------//

// Set up middleware
app.use(methodOverride("_method")); // Enable the method-override middleware
app.set("view engine", "ejs");

// Routes
app.get("/admin", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.send(
        "Username already exists. Please choose a different username."
      );
    }

    // Create a new user in the database
    const newUser = new Admin({ username, password });

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hashedPassword;

    await newUser.save();
    res.send("Signup successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in signup. Please try again.");
  }
});

const requireAuth = (req, res, next) => {
  // Check if the user is logged in
  if (req.session.loggedIn) {
    // If logged in, proceed to the next middleware
    next();
  } else {
    res.redirect('/');

  } 
};

app.post("/login", async (req, res) => {
  const students = await Student.find();
  const idara = await Admin.find();

  const pdfnotes = await PDFNotes.find({});
  const pdfs = await PDFEmploi.find({});

  if (req.body.username == "root" && req.body.password == "root") {
    theAdminIsRoot = true;
    return res.render("actualite_view",{students,idara,pdfnotes,pdfs,});
  } else {
    theAdminIsRoot = false;
    try {
      const check = await Admin.findOne({ username: req.body.username });

      if (check == null) {
        return res.send("Username not found");
      }

      const isPasswordMatch = await bcrypt.compare(
        req.body.password.trim(),
        check.password
      );

      if (isPasswordMatch) {
        return res.render("actualite_view",{students,idara,pdfnotes,pdfs,});

      } else {
        return res.send("Wrong password");
      }
    } catch (error) {
      console.error(error);
      return res.send("Something went wrong");
    }
  }
});

app.get("/logout", (req, res) => {
  // Clear the session data
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    // Redirect the user to the login page after logging out
    res.send("/login");
  });
});

app.get("/login/actualite", async (req, res) => {
  try{
    const students = await Student.find();
    const idara = await Admin.find();

    const pdfnotes = await PDFNotes.find({});
    const pdfs = await PDFEmploi.find({});

  res.render("actualite_view",{students,idara,pdfnotes,pdfs,});
  }catch(error){
    console.log("houni l8alta");
    console.log(error);
  }
});

app.post("/login/actualite/add", upload.single('image'), async (req, res) => {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save the Cloudinary image URL along with other form data
    const newAct = new Actualite({
      title: req.body.title,
      description: req.body.description,
      publicCible: req.body.publicCible,
      imageURL: result.secure_url // URL of the uploaded image
    });
    console.log(req.file);
    console.log(req.body);
    await newAct.save();
    
    res.redirect("/login/actualite");
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error in adding actualite: ${error.message}`);
  }
});

app.get("/etudiants", async (req, res) => {
  // Retrieve all students from the database
  const students = await Student.find({});
  res.render("etudiants", { students });
});

app.get("/students/edit/:id", async (req, res) => {
  // Retrieve the student by ID for editing
  const student = await Student.findById(req.params.id);
  res.render("edit_etudiant", { editingStudent: student });
});

app.post("/students/add", async (req, res) => {
  try {
    await Student.create(req.body);
    res.redirect("/login/actualite");
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).send("CIN or numeroInscription already exists.");
    } else {
      res.status(500).send(error.message);
    }
  }
});

// Example for POST /students/edit/:id route
app.post("/students/edit/:id", async (req, res) => {
  try {
    await Student.update(req.body, {
      where: { id: req.params.id }
    });
    res.redirect("/etudiants");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in updating student.");
  }
});

app.delete("/students/delete/:id", async (req, res) => {
  try {
    await Student.destroy({
      where: { id: req.params.id }
    });
    res.redirect("/etudiants");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting student: " + error.message);
  }
});

app.get("/admins", async (req, res) => {
  if (theAdminIsRoot) {
    try {
      // Fetch all admins from the database
      const admins = await Admin.find();

      // Render the admin.ejs template, passing the admins array
      res.render("admin", { admins: admins });
    } catch (err) {
      // Handle any errors
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.send("barra al3eb b3id");
  }
});

app.post("/addAdmin", async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Create a new admin instance
    const newAdmin = new Admin({
      username,
      password,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Redirect to the "/admins" page after adding the admin
    res.redirect("/login/actualite");
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/deleteAdmin/:id", async (req, res) => {
  if (theAdminIsRoot) {
    try {
    // Extract the admin ID from the request parameters
    const adminId = req.params.id;

    // Find the admin by ID and delete it from the database
    await Admin.findByIdAndDelete(adminId);

    // Redirect to the "/admins" page after deleting the admin
    res.redirect("/login/actualite");
    }catch (err) {
      // Handle any errors
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
    else{
      res.send("barra al3eb b3id");

    }
});

const storage_note = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads_notes/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".pdf");
  },
});
const upload_note = multer({ storage: storage_note });

const storage_emploi = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads_emploi/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".pdf");
  },
});
const upload_emploi = multer({ storage: storage_emploi });

app.post("/upload2", upload_note.single("pdf_file_note"), async (req, res) => {
  try {
    const filename = req.body.filename;
    const pdfFile = req.file;
    
    console.log("Uploaded file path:", pdfFile.path);
    
    if (!fs.existsSync(pdfFile.path)) {
      throw new Error("Uploaded file not found at the specified path");
    }

    const newPDF = new PDFNotes({
      filename: filename, 
      contentType: pdfFile.mimetype,
      data: fs.readFileSync(pdfFile.path), // Corrected path here
    });
    await newPDF.save();
    fs.unlinkSync(pdfFile.path);
    res.redirect("/login/actualite");

  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
});

app.post("/upload", upload_emploi.single("pdf_file_emploi"), async (req, res) => {
  try {
    const filename = req.body.filename;
    const pdfFile = req.file;
    
    console.log("Uploaded file path:", pdfFile.path);
    
    if (!fs.existsSync(pdfFile.path)) {
      throw new Error("Uploaded file not found at the specified path");
    }

    const newPDF = new PDFEmploi({
      filename: filename, 
      contentType: pdfFile.mimetype,
      data: fs.readFileSync(pdfFile.path), // Corrected path here
    });
    await newPDF.save();
    fs.unlinkSync(pdfFile.path);
    res.redirect("/login/actualite");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send(
        "Erreur lors de l'enregistrement du fichier dans la base de données."
      );
  }
});

// Route pour récupérer un PDF par son ID
app.get("/pdf/:id", async (req, res) => {
  try {
    const pdfId = req.params.id;
    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      return res.status(404).send("PDF non trouvé");
    }
    res.setHeader("Content-Type", pdf.contentType);
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + pdf.filename + '"'
    );
    res.send(pdf.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération du PDF");
  }
});

app.post("/pdf/:id/delete", async (req, res) => {
  try {
    const pdfId = req.params.id;

    // Récupérer le document PDF à supprimer
    const pdf = await PDF.findById(pdfId);

    if (!pdf) {
      return res.status(404).send("PDF non trouvé");
    }
    await pdf.deleteOne();
    res.redirect("/emploi");
  } catch (error) {
    console.error("Erreur lors de la suppression du PDF:", error);
    res.status(500).send("Erreur lors de la suppression du PDF");
  }
});

// Route pour télécharger un PDF par son ID
app.get("/pdf_notes/:id", async (req, res) => {
  try {
    const pdf = await PDFNotes.findByPk(req.params.id);
    if (!pdf) {
      return res.status(404).send("PDF non trouvé");
    }
    res.setHeader("Content-Type", pdf.contentType);
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + pdf.filename + '"'
    );
    res.send(pdf.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération du PDF");
  }
});

// Route pour supprimer un PDF par son ID
app.post("/pdf_notes/:id/delete", async (req, res) => {
  try {
    await PDFNotes.destroy({
      where: { id: req.params.id }
    });
    res.redirect("/actualite_view");
  } catch (error) {
    console.error("Erreur lors de la suppression du PDF:", error);
    res.status(500).send("Error deleting PDF");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

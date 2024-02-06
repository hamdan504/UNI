const express = require('express');
const { MongoClient } = require('mongodb');

const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'assets')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
// Set the views directory
app.set('views', 'C:/uni');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://mariem:WecrMJfHDGZ7Jh1c@cluster2.8cbx6bk.mongodb.net/ISIMM_Test")


const testSchema = {
  email: String,
  query: String,
}; 

const test_model = mongoose.model("test", testSchema);

app.post("/pages/institut", function (req, res) {

  const data = new test_model({
     email: req.body.email,
     query: req.body.query,
  });

  data.save()
     .then(() => res.send('Data saved successfully'))
     .catch(err => res.status(500).send('Error saving data: ' + err));
});

app.set('view engine', 'ejs');

const uri = 'mongodb+srv://mariem:WecrMJfHDGZ7Jh1c@cluster2.8cbx6bk.mongodb.net/ISIMM_Test';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const db = client.db('ACTUALITE');
const collection = db.collection('act');


// Define a route to render the HTML page
app.get('/', async (req, res) => {

  const data = await collection.findOne({ /* Your query here */ });
      
  // Render the HTML page with EJS template
  res.render('index', { data });

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

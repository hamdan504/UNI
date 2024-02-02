const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'assets')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

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





// Define a route to render the HTML page
app.get('/', (req, res) => {
  // Use path.join to create an absolute path to the HTML file
  const filePath = path.join(__dirname, './', 'index.html');
  
  // Send the HTML file as the response
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

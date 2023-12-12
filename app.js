const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'assets')));


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

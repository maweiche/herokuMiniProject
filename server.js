const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');
const diagnostics = require('./db/diagnostics.json');
const { readAndAppend } = require('./helpers/fsUtils');

const PORT = process.env.port || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/feedback', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/feedback.html'))
);

//GET Route for diagnostics page
app.get('/api/diagnostics', (req, res) =>
  res.json(diagnostics)
);

//POST Route for diagnostics page
app.post('/api/diagnostics', (req, res) =>{
  console.log(req.body);
  readAndAppend(req.body, './db/diagnostics.json')
  res.json("failed to save tip")
}
);

//GET Route for wildcard page
app.get('*', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/404.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

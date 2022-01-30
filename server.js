const fs = require("fs");
const express = require("express");
const path = require("path");
const database = require("./db/db.json");
const uniqid = require('uniqid');


// Makes a constant for PORT to be used later to deploy
const PORT = process.env.PORT || 3001;

// Makes a constant for express as "app"
const app = express();

// Middleware for prasing JSON and urlencoded form data from the public folder
// Serves the static files
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Gets the data from the db.json and shows it on the page
app.get("/api/notes", (req, res) =>
  res.json(database)
);

// GET /notes should return the notes.html file.
// Gets the notes.html route
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);


// Gets the routes to the public doc
// Gets the index.html route
// GET * should return the index.html file.
app.get("*", (req, res) => 
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// Posts the data on the page
app.post("/api/notes", (req, res) => {
  const {
    title,
    text,
    id
  } = req.body;
  // Requires a Title and Text, then adds the unique ID to it on the Array in the db.json
  if (title && text) {
    let response = {
      title,
      text,
      id: uniqid(),
    };
    // Pushes the response to the database array
    database.push(response);
    fs.writeFile("./db/db.json", JSON.stringify(database), (err) =>
      err ?
      console.error(error) :
      console.log("note added")
    );
    // Sends a response with a note that says note is added to list
    res.send("note added to the list");
  } else {
    res.status(400).json("wrong");
  }
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
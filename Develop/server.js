const express = require("express");
const uuid = require("uuid");
const path = require("path");
const util = require("util");
const fs = require("fs");
const notespage = "/public/notes.html";
const homepage =  "/public/index.html";
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const app = express();
const PORT = process.env.PORT || 3003;

// Using middleware to load proper pages.
app.use(express.json());
app.use(express.urlencoded({ extened: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static('./'));

// Routing for both pages to appear when requested.
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, notespage));
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, homepage));
})

app.get("/api/notes", (req, res) => {
  readFileAsync("./db/db.json", "utf-8")
    .then(data => {
      res.json(JSON.parse(data));
    })
    .catch(err => {
      throw err;
    })
});

// Alow for entry of new posts to be made.
app.post("/api/notes", async (req, res) => {
      const data = await readFileAsync("./db/db.json", "utf-8"); 
      const notes = JSON.parse(data);
      const newNote = req.body;
      const newId = uuid();
      const noteData = {
          id: newId,
          title: newNote.title,
          text: newNote.text
      };
  
      notes.push(noteData);
      res.json(noteData);
  
      await writeFileAsync("./db/db.json", JSON.stringify(notes, null, 2));


});

// Allows for posts to be deleted.
app.delete("/api/notes/:id", async (req, res) => {
      const noteID = req.params.id;
      const data = await readFileAsync("./db/db.json", "utf-8");
      const oldNote = JSON.parse(data);
      const notesString = JSON.stringify(notes, null, 2);
      notes.forEach((element, index) => {
          if (element.id === noteID) {
              oldNote.splice(index, 1);
          }
      });

      await writeFileAsync("./db/db.json", notesSTR);

      res.json(JSON.parse(notesString));

})

// Begins host and alerts you of which port it is being run on.
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
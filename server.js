const express = require('express');
const fs = require('fs');
const path = require('path');
const database = require('./db/db');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static('public'));


app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Notes html and it's "url"
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

//===============================================================================
// GET, POST, DELETE API Endpoints.
//===============================================================================

// Since the GET and POST functions grab from the same route, we can set it once up here.
app.route('/api/notes')
    // Grab the notes list (this should be updated for every new note and deleted note.)
    .get(function (req, res) {
        res.json(database);
    })


    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, '/db/db.json');
        let newNote = req.body;

        let highestId = 99;

        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                highestId = individualNote.id;
            }
        }

        // This assigns an ID to the newNote. 
        newNote.id = highestId + 1;
        // We push it to db.json.
        database.push(newNote)

        // Write the db.json file again.
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log('Your note was saved!');
        });
        // Gives back the response, which is the user's new note. 
        res.json(newNote);
    });


    app.delete('/api/notes/:id', function (req, res) {
        let jsonFilePath = path.join(__dirname, '/db/db.json');

        for (let i = 0; i < database.length; i++) {
            if (database[i].id == req.params.id) {
                // Splice takes i position, and then deletes the 1 note.
                database.splice(i, 1);
                break;

        }
    }
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log('Your note has been deleted');
        }
    });
    res.json(database);

});

app.listen(PORT, function () {
    console.log('App listening on PORT' + PORT);
});
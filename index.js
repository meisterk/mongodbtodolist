const express = require('express');
const app = express();
const bodyParser= require('body-parser');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

// Verbindung mit Datenbank aufbauen
var db;

MongoClient.connect('mongodb://localhost:27017/todolist', function (err, database) {
    if (err) throw err;
    db = database;
    // Webserver startet nur, wenn Datenbankverbindung ok
    app.listen(3000, function(){
        console.log('Höre auf Port 3000');
    });
})

app.get('/', function(req, res){
    db.collection('aufgaben').find().toArray(function (err, result) {
        if (err) throw err
        res.render('index', {liste: result} );
    });
});


app.post('/', function(req, res){
    db.collection('aufgaben').save(req.body, function(err, result){
        if (err) return console.log(err);
        res.redirect('/');
    });
});

app.post('/delete', function(req, res){
    var id = req.body.id;
    console.log(id);
    var aufgabe = { _id: ObjectId(id)};
    console.log(aufgabe);
    db.collection('aufgaben').remove(aufgabe, function(err, result){
        if (err) return console.log(err);
        res.redirect('/');
    });
});


/*
    |----------------------------------------------------------
    | Statement of Authorship:
    | StAuth10065: I Dylan Hernandez, 000307857 certify that this material is my original work. 
    | No other person's work has been used without due acknowledgement. 
    | I have not made my work available to anyone else.
    |----------------------------------------------------------
*/

/*
    |----------------------------------------------------------
    | Starting modules & uses
    |----------------------------------------------------------
*/
var express = require('express');
var http = require('http');
var app = express();
var sqlite3 = require("sqlite3").verbose();
var file = "api.db";

/*
    |----------------------------------------------------------
    | Request Body
    | This will allow the request body to be accessed in any route by calling req.requestBody
    | Runs on each request, 'str' is only converted to JSON on PUT, POST and DELETE
    |----------------------------------------------------------
*/
app.use (function(req, res, next) {
    var str = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       str += chunk; //Adding data chunks
    });
    req.on('end', function() {
        req.requestBody = str; //This will be converted to JSON when requested
        next();
    });
});

/*
    |----------------------------------------------------------
    | Index Route
    |----------------------------------------------------------
*/
app.get('/', function (req, res) {
    res.send('RUNNING');
});

/*
    |----------------------------------------------------------
    | Api GET Collection
    | Returns the whole collection of the data in the database
    |----------------------------------------------------------
*/
app.get('/api/', function (req, res) {
    var db = new sqlite3.Database(file);
    db.serialize(function () {
        db.run('CREATE TABLE IF NOT EXISTS users (userid INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT)');
        db.all('SELECT * FROM users', function (err, rows) {
            res.json(rows);
        });
    });
    db.close();
});

/*
    |----------------------------------------------------------
    | Api GET Id
    | Gets a single row from the collection of the data in the database
    |----------------------------------------------------------
*/
app.get('/api/:id', function (req, res) {
    var numberId = parseInt(req.params.id);
    if(numberId > 0) {
        var db = new sqlite3.Database(file);
        db.serialize(function () {
            db.run('CREATE TABLE IF NOT EXISTS users (userid INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT)');
            db.get('SELECT * FROM users WHERE userid = ' + numberId, function (err, row) {
                res.json(row);
            });
        });
        db.close();
    }
    else {
        res.send('ERROR - INVALID INPUT');
    }
});

/*
    |----------------------------------------------------------
    | Api POST Entry
    |----------------------------------------------------------
*/ 
app.post('/api/', function (req, res) {
    if(!! req.requestBody){
        var data = JSON.parse(req.requestBody);
        if(!! data) {
            var recordName = (!!data.name) ? data.name : '';
            var recordEmail = (!!data.email) ? data.email : '';
            var recordPhone = (!!data.phone) ? data.phone : '';
            var db = new sqlite3.Database(file);
            db.serialize(function () {
                var stmt = db.prepare('INSERT INTO users (name, email, phone) VALUES (?, ?, ?)');
                    stmt.run(recordName, recordEmail, recordPhone);
                stmt.finalize();
            });
            db.close();
            res.send('CREATE ENTRY SUCCESSFUL');
        }
        else {
            res.send('CREATE ENTRY FAILED');
        }
    }
    else{
        res.send('CREATE ENTRY FAILED');
    }
});

/*
    |----------------------------------------------------------
    | Api PUT Collection
    |----------------------------------------------------------
*/ 
app.put('/api/', function (req, res) {
    if(!! req.requestBody){
        var data = JSON.parse(req.requestBody);
        if(!! data) {
            var db = new sqlite3.Database(file);
            db.serialize(function () {
                db.run('DROP TABLE IF EXISTS users');
                db.run('CREATE TABLE IF NOT EXISTS users (userid INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT)');
                for(var row in data) {
                    var recordName = (!!data[row].name) ? data[row].name : '';
                    var recordEmail = (!!data[row].email) ? data[row].email : '';
                    var recordPhone = (!!data[row].phone) ? data[row].phone : '';
                    if(!! recordName || !!recordEmail || !!recordPhone) { //At least 1 piece of data is needed
                        var stmt = db.prepare('INSERT INTO users (name, email, phone) VALUES (?, ?, ?)');
                            stmt.run(recordName, recordEmail, recordPhone);
                        stmt.finalize();
                    }
                }
            });
            db.close();
            res.send('REPLACE COLLECTION SUCCESSFUL');
        }
        else {
            res.send('REPLACE COLLECTION FAILED');
        }
    }
    else{
        res.send('REPLACE COLLECTION FAILED');
    }
});

/*
    |----------------------------------------------------------
    | Api PUT Id
    | Updates a single row of the data in the database
    |----------------------------------------------------------
*/ 
app.put('/api/:id', function (req, res) {
    var numberId = parseInt(req.params.id);
    if(numberId > 0) {
        if(!! req.requestBody) {
            var data = JSON.parse(req.requestBody);
            if(!! data) {
                var recordName = (!!data.name) ? data.name : '';
                var recordEmail = (!!data.email) ? data.email : '';
                var recordPhone = (!!data.phone) ? data.phone : '';
                var db = new sqlite3.Database(file);
                db.serialize(function () {
                    db.run("UPDATE users SET name = '"+recordName+"', email = '"+recordEmail+"', phone = '"+recordPhone+"' WHERE userid = "+numberId+";");
                });
                res.send('UPDATE ITEM SUCCESSFUL');
                db.close();
            }
            else {
                res.send('UPDATE ITEM FAILED');
            }
        }
        else{
            res.send('UPDATE ITEM FAILED');
        }
    }
    else {
        res.send('ERROR - INVALID INPUT');
    }
});

/*
    |----------------------------------------------------------
    | Api DELETE Collection
    |----------------------------------------------------------
*/ 
app.delete('/api/', function (req, res) {
    var db = new sqlite3.Database(file);
    db.serialize(function () {
        db.run('DROP TABLE IF EXISTS users'); //Removes entire table, then re-creates it
        db.run('CREATE TABLE IF NOT EXISTS users (userid INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT)');
    });
    db.close();
    res.send('DELETE COLLECTION SUCCESSFUL');
});

/*
    |----------------------------------------------------------
    | Api DELETE by ID
    |----------------------------------------------------------
*/ 
app.delete('/api/:id', function (req, res) {
    var numberId = parseInt(req.params.id);
    if(numberId > 0) {
        var db = new sqlite3.Database(file);
        db.serialize(function () {
            db.run("DELETE FROM users WHERE userid='" + req.params.id + "'"); 
        });
        db.close();
        res.send('DELETE ITEM SUCCESSFUL');        
    }
    else {
        res.send('ERROR - INVALID INPUT');
    }
});

/*
    |----------------------------------------------------------
    | Server
    |----------------------------------------------------------
*/
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
});
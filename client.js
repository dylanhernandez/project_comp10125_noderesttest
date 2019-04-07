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
var http = require('http');
var API = require('./server');

/*
    |----------------------------------------------------------
    | runGet
    | This is the get request that runs after each function
    |----------------------------------------------------------
*/ 
function runGet() {
    http.request({ host: 'localhost', path: '/api', method: 'GET', port: '8081' }, function(response) {
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            setTimeout(function(){console.log(result);},250);
        });
    }).end();
}

/*
    |----------------------------------------------------------
    | Test 1
    |----------------------------------------------------------
*/ 
function runRequestTest_1() {
    http.request({ 
        host: 'localhost', 
        path: '/api', 
        method: 'GET', 
        port: '8081' 
    }, function(response) {
        console.log("");
        console.log("Run Test #1 Check that an initial GET collection request is empty.");
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            setTimeout(function(){
                console.log(result);
                runRequestTest_2('{"name":"john","email":"john@doe.com","phone":"123-444-5678"}', false); //We are not going to the next test, run another post afterwards
            },1000);
        });
    }).end();
}

/*
    |----------------------------------------------------------
    | Test 2
    | json - this is the string with the json data
    | isNext - if true it goes to test 3, if not it will do another post
    |----------------------------------------------------------
*/ 
function runRequestTest_2(json, isNext) {
    var req = http.request({ 
        host: 'localhost', 
        path: '/api', 
        method: 'POST', 
        port: '8081' 
    }, function(response) {
        console.log("");
        console.log("Run Test #2 Check that two POST collection requests will insert the two items into the collection");
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            runGet();
            setTimeout(function(){
                console.log(result);
                if(isNext === true) {
                    runRequestTest_3('[{"name":"Kevin","email":"kevin@kevinbrowne.ca","phone":"123-123-1234"},{"name":"Larissa","email":"larissa@gmail.com","phone":"289-441-3333"},{"name":"David","email":"david@david.org","phone":"905-456-1235"}]');
                }
                else {
                    runRequestTest_2('{"name":"jane","email":"jane@doe.com","phone":"987-444-5678"}', true); //After this request go to test 3
                }
            },1000);
        });
    });
    req.write(json);
    req.end();
}

/*
    |----------------------------------------------------------
    | Test 3
    |----------------------------------------------------------
*/ 
function runRequestTest_3(json) {
    var req = http.request({ 
        host: 'localhost', 
        path: '/api', 
        method: 'PUT', 
        port: '8081' 
    }, function(response) {
        console.log("");
        console.log("Run Test #3 Check that a PUT collection request with two items in a collection will replace the current collection with this new collection");
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            runGet();
            setTimeout(function(){
                console.log(result);
                runRequestTest_4(true);
            },1000);
        });
    });
    req.write(json);
    req.end();
}

/*
    |----------------------------------------------------------
    | Test 4
    |----------------------------------------------------------
*/
function runRequestTest_4(isNext) {
    http.request({ 
        host: 'localhost', 
        path: '/api', 
        method: 'DELETE', 
        port: '8081' 
    }, function(response) {
        if(isNext === true) {
            console.log("");
            console.log("Run Test #4 Check that a DELETE collection request will remove all items from the collection");
        }
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            if(isNext === true) {
                runGet();
                setTimeout(function(){
                    console.log(result);
                    runRecordReset();
                },1000);    
            }
        });
    }).end();
}

/*
    |----------------------------------------------------------
    | Reset records
    | This will re-add the records from the PUT request to be used in tests 5 - 7
    |----------------------------------------------------------
*/
function runRecordReset() {
    var req = http.request({ 
        host: 'localhost', 
        path: '/api', 
        method: 'PUT', 
        port: '8081' 
    }, function(response) {
        console.log("");
        console.log("Re-adding some records for Tests 5 - 7...");
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            runGet();
            setTimeout(function(){
                console.log(result);
                runRequestTest_5();
            },1000);
        });
    });
    req.write('[{"name":"Kevin","email":"kevin@kevinbrowne.ca","phone":"123-123-1234"},{"name":"Larissa","email":"larissa@gmail.com","phone":"289-441-3333"},{"name":"David","email":"david@david.org","phone":"905-456-1235"}]');
    req.end();
}

/*
    |----------------------------------------------------------
    | Test 5
    |----------------------------------------------------------
*/
function runRequestTest_5() {
    http.request({ 
        host: 'localhost', 
        path: '/api/2', 
        method: 'GET', 
        port: '8081' 
    }, function(response) {
        console.log("");
        console.log("Run Test #5 Check that a GET item request will return USERID 2");
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            setTimeout(function(){
                console.log(result);
                runRequestTest_6();
            },1000);
        });
    }).end();
}

/*
    |----------------------------------------------------------
    | Test 6
    |----------------------------------------------------------
*/
function runRequestTest_6() {
    var req = http.request({ 
        host: 'localhost', 
        path: '/api/2', 
        method: 'PUT', 
        port: '8081' 
    }, function(response) {
        console.log("");
        console.log("Run Test#6 Check that a PUT item request will update USERID 2");
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            runGet();
            setTimeout(function(){
                console.log(result);
                runRequestTest_7();
            },1000);
        });
    });
    req.write('{"name":"Jane","email":"jane@gmail.com","phone":"289-441-3333"}');
    req.end();
}

/*
    |----------------------------------------------------------
    | Test 7
    |----------------------------------------------------------
*/
function runRequestTest_7() {
    http.request({ 
        host: 'localhost', 
        path: '/api/2', 
        method: 'DELETE', 
        port: '8081' 
    }, function(response) {
        console.log("");
        console.log("Run Test #7 Check that a DELETE item request will delete USERID 2");
        var result = '';
        response.on('data', function (chunk) { result += chunk; });
        response.on('end', function () {
            runGet();
            setTimeout(function(){
                console.log(result);
                console.log("");
                console.log("Testing Complete!");
                runRequestTest_4(false); //Re-delete collection, notifications off
            },1000);            
        });
    }).end();   
}

/*
    |----------------------------------------------------------
    | START TESTING HERE!
    |----------------------------------------------------------
*/
runRequestTest_1();
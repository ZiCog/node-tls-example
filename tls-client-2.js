"use strict";

var tls = require('tls'),
    fs = require('fs');

/*
var options = {
   key: fs.readFileSync('client-key-2.pem'),
   cert: fs.readFileSync('client-crt-2.pem')
};
*/
var options = {
   key: fs.readFileSync('ssl/client-2.key'),
   cert: fs.readFileSync('ssl/client-2.crt')
};

var conn = tls.connect(8000, options, function () {
    if (conn.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log("Connection not authorized: " + conn.authorizationError);
    }
    console.log();
});

conn.on("data", function (data) {
    console.log(data.toString());
    //conn.end();
});


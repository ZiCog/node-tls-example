"use strict";

var tls = require('tls'),
    fs = require('fs');

var options = {
    key: fs.readFileSync('ssl/client.key'),
    cert: fs.readFileSync('ssl/client.crt'),
    rejectUnauthorized: false
};

var conn = tls.connect(8000, options, function () {
    if (conn.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log("Connection not authorized: " + conn.authorizationError);
	console.log("Eeek:", conn.authorizationError);
    }
    console.log();
});

conn.on("error", function(err) {
    console.log("Eeek:", err.toString());
});

conn.on("data", function (data) {
    console.log(data.toString());
    //conn.end();
});



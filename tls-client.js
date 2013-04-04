"use strict";

var tls = require('tls'),
    fs = require('fs');

var options = {
    key: fs.readFileSync('ssl/client.key'),
    cert: fs.readFileSync('ssl/client.crt'),
    rejectUnauthorized: false,
/*    ca: [
            fs.readFileSync('ssl/server.crt'),
            fs.readFileSync('ssl/root.crt'),
            fs.readFileSync('ssl/ca1.crt'),
            fs.readFileSync('ssl/ca2.crt'),
            fs.readFileSync('ssl/ca3.crt'),
//            fs.readFileSync('ssl/ca4.crt')
        ]
*/
};

var conn = tls.connect(8000, options, function () {
    if (conn.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log("Connection not authorized: " + conn.authorizationError);
	console.log("Eeek:", conn.authorizationError);
    }
    console.log(conn.getPeerCertificate());
});

conn.on("error", function(err) {
    console.log("Eeek:", err.toString());
});

conn.on("data", function (data) {
    console.log(data.toString());
    //conn.end();
});

conn.on("end", function () {
    console.log("End:");
});

conn.on("close", function () {
    console.log("Close:");
});



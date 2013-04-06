"use strict";

var tls = require('tls'),
    fs = require('fs');

var hosterr = 'Hostname/IP doesn\'t match certificate\'s altnames';

var options = {
    ca: [ fs.readFileSync('keys/ca1-cert.pem') ],
    key: fs.readFileSync('keys/agent2-key.pem'),
    cert: fs.readFileSync('keys/agent2-cert.pem'),
    rejectUnauthorized: false,
};

var conn = tls.connect(8000, options, function () {
    var authorized = conn.authorized ||
                     conn.authorizationError === hosterr;

    if (authorized) {
        console.log("Connection authorized by a Certificate Authority.");
    } else {
        console.log("Connection not authorized: " + conn.authorizationError);
    }
    //console.log(conn.getPeerCertificate());
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



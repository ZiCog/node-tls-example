//
// tls-client.js
//
// Example of a Transport Layer Security (or TSL) client
//
// References:
//    http://nodejs.org/api/tls.html
//    http://docs.nodejitsu.com/articles/cryptography/how-to-use-the-tls-module
//

// Always use JavaScript strict mode. 
"use strict";

var tls = require('tls'),
    fs = require('fs');

var hosterr = 'Hostname/IP doesn\'t match certificate\'s altnames';

// Hoest name and port of server to connect to.
var host = "agent1";
var port = 8000;


var options = {
    // A chain of certificate autorities
    ca: [
          fs.readFileSync('ssl/root-cert.pem'),
          fs.readFileSync('ssl/ca1-cert.pem'),
          fs.readFileSync('ssl/ca2-cert.pem'),
          fs.readFileSync('ssl/ca3-cert.pem'),
          fs.readFileSync('ssl/ca4-cert.pem')
        ],
    // Private key of the server
    key: fs.readFileSync('ssl/agent2-key.pem'),

    cert: fs.readFileSync('ssl/agent2-cert.pem'),
    rejectUnauthorized: false,
};

// A secure (TLS) socket client.
function TLSClient() {
    var conn = tls.connect(port, host, options, function () {
        if (conn.authorized) {
            console.log("TLS connection authorized");
        } else {
            console.log("TLS connection not authorized: " + conn.authorizationError);
        }
        // Send initial message to server
        conn.write("Hi!");
    //    console.log(conn.getPeerCertificate());
    });

    conn.on("error", function (err) {
        console.log("Eeek:", err.toString());
    });

    conn.on("data", function (data) {
        // Try to parse the message as JASON format
        try {
            var message = JSON.parse(data);
            console.log("Date = ", message.date);
            console.log("Lat  = ", message.latitude);
            console.log("Lon  = ", message.longitude);
        } catch (err) {
            // Not valid JSON so just print it
            console.log(data.toString());        
        }
    });

    conn.socket.on("end", function () {
       console.log("End:");
    });
 
    conn.socket.on("close", function () {
        console.log("Close:");
        setTimeout(function () {
            TLSClient();
        }, 1000);
    });
}

TLSClient();










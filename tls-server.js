//
// tls-server.js
//
// Example of a Transport Layer Security (or TSL) server
//
// References:
//    http://nodejs.org/api/tls.html
//    http://docs.nodejitsu.com/articles/cryptography/how-to-use-the-tls-module
//

// Always use JavaScript strict mode. 
"use strict";

var tls = require('tls'),
    fs = require('fs'),
    colors = require('colors'),
    msg = [
        ".-..-..-.  .-.   .-. .--. .---. .-.   .---. .-.",
        ": :; :: :  : :.-.: :: ,. :: .; :: :   : .  :: :",
        ":    :: :  : :: :: :: :: ::   .': :   : :: :: :",
        ": :: :: :  : `' `' ;: :; :: :.`.: :__ : :; ::_;",
        ":_;:_;:_;   `.,`.,' `.__.':_;:_;:___.':___.':_;"
    ].join("\n").cyan;

var options = {
    ca: [
          fs.readFileSync('ssl/root-cert.pem'),
          fs.readFileSync('ssl/ca1-cert.pem'),
          fs.readFileSync('ssl/ca2-cert.pem'),
          fs.readFileSync('ssl/ca3-cert.pem'),
          fs.readFileSync('ssl/ca4-cert.pem')
        ],
    key: fs.readFileSync('ssl/agent1-key.pem'),
    cert: fs.readFileSync('ssl/agent1-cert.pem'),
    requestCert: true 
};


// The data structure to be sent to connected clients
var message = {
    date : new Date(), 
    latitude : 60.1708,
    longitude : 24.9375
};


// A secure (TLS) socket server.
tls.createServer(options, function (s) {
    var intervalId;

    console.log("TLS authorized:", s.authorized);
    if (!s.authorized) {
        console.log("TLS authorization error:", s.authorizationError);
    }
    //console.log(s.getPeerCertificate());
    s.write(msg + "\n");
    intervalId = setInterval(function () {
        s.write("This is encrypted I hope!\n");
        s.write(JSON.stringify(message));
    }, 1000);

    // Echo data incomming dats from stream back out to stream
    //s.pipe(s);

    s.on('data', function(data) {
        console.log("Client says:", data.toString());
    });

    // Handle events on the underlying socket
    s.socket.on("error", function (err) {
        clearInterval(intervalId);
        console.log("Eeek:", err.toString());
    });

    s.socket.on("end", function () {
        clearInterval(intervalId);
        console.log("End:");
    });

    s.socket.on("close", function () {
        clearInterval(intervalId);
        console.log("Close:");
    });
}).listen(8000);







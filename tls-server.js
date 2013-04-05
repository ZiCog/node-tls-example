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


/*
var options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt'),
    // This is necessary only if using the client certificate authentication.
    requestCert: true,
    // This is necessary only if the client uses the self-signed certificate.
    ca: [ 
            //fs.readFileSync('ssl/ca3.crt'),
            //fs.readFileSync('ssl/ca4.crt'),
            fs.readFileSync('ssl/root.crt'),
            //fs.readFileSync('ssl/ca1.crt'),
            //fs.readFileSync('ssl/ca2.crt'),
//            fs.readFileSync('ssl/client.crt')
        ]
};
*/

var options = {
    ca: [ fs.readFileSync('keys/ca1-cert.pem'),
          fs.readFileSync('keys/agent2-cert.pem')     // FIXME: Should not need this (agent2 is self signed just now);
    ],
    key: fs.readFileSync('keys/agent1-key.pem'),
    cert: fs.readFileSync('keys/agent1-cert.pem'),
    requestCert: true
};

tls.createServer(options, function (s) {
    console.log("Authorized:", s.authorized);
    console.log("Authorization error:", s.authorizationError);
    //console.log(s.getPeerCertificate());
    s.write(msg + "\n");
    setInterval(function () {
        s.write("This is encrypted I hope!\n");
    }, 1000);
    s.pipe(s);
}).listen(8000);



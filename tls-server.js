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
    ca: [ fs.readFileSync('keys/ca1-cert.pem')
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



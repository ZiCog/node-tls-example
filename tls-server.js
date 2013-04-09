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

// A secure (TLS) socket server.
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

// A secure web server.
// Test with:
//  $ curl --cacert keys/ca1-cert.pem  https://agent1:8081/
// Or if client authentication is required (requestCert:true)
//  $ curl -v -s --key-type pem --key keys/agent2-key.pem --.pem --cacert keys/ca1-cert.pem https://agent1:8081
var https = require('https');
https.createServer(options, function (req, res) {
    if (req.client.authorized) {
        console.log("https client authorised.");
        res.writeHead(200, {"Content-Type": "application/text"});
        res.end('The server has authorized your client certificate.');
    } else {
        console.log("https client NOT authorised.");
        res.writeHead(401, {"Content-Type": "application/text"});
        res.end('The server has NOT authorized your client certificate.');
        console.log(req.client.getPeerCertificate());
    }
}).listen(8081);



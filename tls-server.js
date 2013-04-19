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

// A secure (TLS) socket server.
tls.createServer(options, function (s) {
    console.log("TLS authorized:", s.authorized);
    if (!s.authorized) {
        console.log("TLS authorization error:", s.authorizationError);
    }
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
//  $ curl -v -s --key-type pem --key keys/agent2-key.pem --cert keys/agent2-cert.pem --cacert keys/ca1-cert.pem https://agent1:8081

var https = require('https');
var express = require('express');
var app = express();
var server = https.createServer(options, app);

server.listen(8443);

app.use(express.logger());

app.use(express.cookieParser());
//app.use(express.cookieParser('some secret'));

// Authenticator
app.use(express.basicAuth(function(user, pass, callback) {
    console.log("Login attempt:", user, pass);
    var result = (user === 'michael' && pass === 'password');
    callback(null /* error */, result);
}));

app.get('/', function(req,res) {
        console.log(req.cookies);

        res.cookie("myCookie", "777", { maxAge: 900000, httpOnly: true });
/*
    if (req.client.authorized) {
        console.log("https client authorised.");
        res.writeHead(200, {"Content-Type": "application/text"});
        res.end('The server has authorized your client certificate.');
    } else {
        console.log('https client NOT authorised.');
        res.writeHead(401, {'WWW-Authenticate': "OpenID realm='My Realm' location='https:/'"});
        res.end('The server has NOT authorized your client certificate.');
        //console.log(req.client.getPeerCertificate());
    }
*/
        //res.writeHead(200, {"Content-Type": "application/text"});
        res.end('Hello.');
});

// Secure web sockets
var io = require('socket.io').listen(server);
io.set('log level', 3);

var chat = io
    .of('/chat')
    .on('connection', function (socket) {
        console.log('chat socket open.');
        // Messages on a chat socket only go to that one chat connection
        socket.emit('chat message', 'Chat, chat..');
    // Messages on chat will go to every chat connection.
    chat.emit('chat message', 'Hi every body!');
});

var news = io
    .of('/news')
    .on('connection', function (socket) {
        console.log('news socket open.');
        socket.emit('item', 'Propeller II release iminent');
});








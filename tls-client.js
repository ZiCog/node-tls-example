"use strict";

var tls = require('tls'),
    fs = require('fs');

var hosterr = 'Hostname/IP doesn\'t match certificate\'s altnames';

var host = "agent1";
var port = 8000;

var options = {
    ca: [
          fs.readFileSync('ssl/root-cert.pem'),
          fs.readFileSync('ssl/ca1-cert.pem'),
          fs.readFileSync('ssl/ca2-cert.pem'),
          fs.readFileSync('ssl/ca3-cert.pem'),
          fs.readFileSync('ssl/ca4-cert.pem')
        ],
    key: fs.readFileSync('ssl/agent2-key.pem'),
    cert: fs.readFileSync('ssl/agent2-cert.pem'),
    rejectUnauthorized: false,
};

// A secure (TLS) socket client.
var conn = tls.connect(port, host, options, function () {
    if (conn.authorized) {
        console.log("TLS connection authorized");
    } else {
        console.log("TLS connection not authorized: " + conn.authorizationError);
    }
//    console.log(conn.getPeerCertificate());
});

conn.on("error", function (err) {
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

// A secure (TLS) https client
var https = require('https');

var options = {
    hostname: 'agent1',
    port: 8443,
    path: '/',
    method: 'GET',
    ca: [
          fs.readFileSync('ssl/root-cert.pem'),
          fs.readFileSync('ssl/ca1-cert.pem'),
          fs.readFileSync('ssl/ca2-cert.pem'),
          fs.readFileSync('ssl/ca3-cert.pem'),
          fs.readFileSync('ssl/ca4-cert.pem')
        ],
    key: fs.readFileSync('ssl/agent2-key.pem'),
    cert: fs.readFileSync('ssl/agent2-cert.pem'),
    rejectUnauthorized: true 
};

var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  console.log("headers: ", res.headers);

  res.on('data', function(d) {
      process.stdout.write(d);
  });
});
req.end();

req.on('error', function(e) {
    console.error(e);
});


// A secure websocket client.
https.globalAgent.options = {
    ca: [
          fs.readFileSync('ssl/root-cert.pem'),
          fs.readFileSync('ssl/ca1-cert.pem'),
          fs.readFileSync('ssl/ca2-cert.pem'),
          fs.readFileSync('ssl/ca3-cert.pem'),
          fs.readFileSync('ssl/ca4-cert.pem')
        ],
    key: fs.readFileSync('ssl/agent2-key.pem'),
    cert: fs.readFileSync('ssl/agent2-cert.pem'),
    rejectUnauthorized: true,
};

var io = require('socket.io-client');
var chatUrl = 'https://agent1:8443/chat';
var newsUrl = 'https://agent1:8443/news';

var chat = io.connect(chatUrl, {secure: true});
var news = io.connect(newsUrl, {secure: true});

chat.on('connect', function () {
    console.log('Chat connected');
    chat.emit('hi!');
});

chat.on('chat message', function (data) {
    console.log('Chat:', data);
    chat.emit('hi!');
});
  
news.on('connect', function () {
    console.log('Chat connected');
});

news.on('item', function (data) {
    console.log('news item:', data);
    news.emit('woot');
});









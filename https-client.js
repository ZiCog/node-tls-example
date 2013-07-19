"use strict";

// A secure (TLS) https client
var https = require('https');
var fs = require('fs');

/*
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
        console.log("##############################################");
        console.log(d.toString());
        console.log("##############################################");
    });
});
req.end();

req.on('error', function(e) {
    console.error("Error: ", e);
});

*/

// A secure websocket client.


https.globalAgent.options = {
    ca: [
          fs.readFileSync('ssl/root-cert.pem')
//          fs.readFileSync('ssl/ca1-cert.pem'),
//          fs.readFileSync('ssl/ca2-cert.pem'),
//          fs.readFileSync('ssl/ca3-cert.pem'),
//          fs.readFileSync('ssl/ca4-cert.pem')
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









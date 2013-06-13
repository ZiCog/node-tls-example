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

// Modules required here
var tls = require('tls'),
    fs = require('fs'),
    util = require('util'),
    events = require('events');

// TLS Client object
var TLSClient = function (host, port) {

    var options = {
        // Chain of certificate autorities
        // Client and server have these to authenticate keys 
        ca: [
              fs.readFileSync('ssl/root-cert.pem'),
              fs.readFileSync('ssl/ca1-cert.pem'),
              fs.readFileSync('ssl/ca2-cert.pem'),
              fs.readFileSync('ssl/ca3-cert.pem'),
              fs.readFileSync('ssl/ca4-cert.pem')
            ],
        // Private key of the client
        key: fs.readFileSync('ssl/agent2-key.pem'),
        // Public key of the client (certificate key)
        cert: fs.readFileSync('ssl/agent2-cert.pem'),

        // Automatically reject clients with invalide certificates.
        rejectUnauthorized: false             // Set false to see what happens.
    };

    var self = this;

    // Incoming JSON chunks are terminated with this.
    var TERM = '\uFFFD';

    // Call the event emitter constructor.  
    events.EventEmitter.call(this);

    function connect() {
        var fragment = '';
        var s;
        s = tls.connect(port, host, options, function () {
            self.emit('connect', null);

            console.log("TLS Server authorized:", s.authorized);
            if (!s.authorized) {
                console.log("TLS authorization error:", s.authorizationError);
            }
            // console.log(s.getPeerCertificate());
        });

        s.on("error", function (err) {
            console.log("Eeek:", err.toString());
        });

        s.on("data", function (data) {
            var info = data.toString().split(TERM);
            info[0] = fragment + info[0];
            fragment = '';

            for ( var index = 0; index < info.length; index++) {
                if (info[index]) {
                    try {
                        var message = JSON.parse(info[index]);
                        self.emit('message', message);
                    } catch (error) {
                        fragment = info[index]; 
                        continue;
                    }
                }
            }
        });

        s.socket.on("end", function () {
           console.log("End:");
        });
 
        s.socket.on("close", function () {
            console.log("Close:");
            self.emit('disconnect', null);

            // Try to reconnect after a delay
            setTimeout(function () {
                // Use "apply" here as the timeout needs to
                // know which objects "connect" to use
                connect.apply(this);
            }, 1000);
        });
    };

    // Make the TLS connection 
    connect();
};

// TLSClient inherits EventEmitter 
util.inherits(TLSClient, events.EventEmitter);

TLSClient.prototype.write = function (message) {
    if (this.s.writable) {
        this.s.write(message);
    }
}

module.exports = TLSClient;

// Test Harness
//-------------
var c1 = new TLSClient('agent1', 8000);


//var c2 = new TLSClient('agent1', 8000);
//var c3 = new TLSClient('agent1', 8000);
//var c4 = new TLSClient('agent1', 8000);
//var c5 = new TLSClient('agent1', 8000);

c1.on('connect', function (err) {
    console.log('Client connected.');
});

c1.on('disconnect', function (err) {
    console.log('Client disconnected');
});

var seqNo = 0;
c1.on('message', function (message) {
    console.log("Tag = ", message.tag);
    console.log("Date = ", message.date);
    console.log("Lat  = ", message.latitude);
    console.log("Lon  = ", message.longitude);
    console.log("Seq  = ", message.seqNo);
    if (message.seqNo !== seqNo) {
        console.log ("Sequence number error, expected: ", seqNo);
        process.exit();
    }
    seqNo += 1;
});

console.log('STARTED');





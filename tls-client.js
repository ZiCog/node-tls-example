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

        // Automatically reject clients with invalid certificates.
        rejectUnauthorized: false             // Set false to see what happens.
    };

    var self = this;

    // Incoming JSON chunks are terminated with the Unicode replacement character.
    this.TERM = '\uFFFD';

    // Call the event emitter constructor.  
    events.EventEmitter.call(this);

    var connect = (function connect() {
        var fragment = '';
        var s;
        self.s = tls.connect(port, host, options, function () {
            self.emit('connect', null);

            console.log("TLS Server authorized:", self.s.authorized);
            if (!self.s.authorized) {
                console.log("TLS authorization error:", self.s.authorizationError);
            }
            // console.log(s.getPeerCertificate());
        });

        self.s.on("error", function (err) {
            console.log("Eeek:", err.toString());
        });

        self.s.on("data", function (data) {
            // Split incoming data into messages around TERM
            var info = data.toString().split(self.TERM);

            // Add any previous trailing chars to the start of the first message
            info[0] = fragment + info[0];
            fragment = '';

            // Parse all the messages into objects
            for ( var index = 0; index < info.length; index++) {
                if (info[index]) {
                    try {
                        var message = JSON.parse(info[index]);
                        self.emit('message', message);
                    } catch (error) {
                        // The last message may be cut short so save its chars for later.
                        fragment = info[index]; 
                        continue;
                    }
                }
            }
        });

        self.s.on("end", function () {
           console.log("End:");
        });
 
        self.s.on("close", function () {
            console.log("Close:");
            self.emit('disconnect', null);

            // Try to reconnect after a delay
            setTimeout(function () {
                connect();
            }, 1000);
        });
    })();
};

// TLSClient inherits EventEmitter 
util.inherits(TLSClient, events.EventEmitter);

TLSClient.prototype.write = function (message) {
    if (this.s.writable) {
        var data = JSON.stringify(message) + this.TERM;
        this.s.write(data);
    }
}

module.exports = TLSClient;






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
var TLSClient = require('./tls-client.js');

var c1 = new TLSClient('agent1', 8000);


//var c2 = new TLSClient('agent1', 8000);
//var c3 = new TLSClient('agent1', 8000);
//var c4 = new TLSClient('agent1', 8000);
//var c5 = new TLSClient('agent1', 8000);

var signOnMsg = {
	"name" : "someone",
        "passwd" : "password",
}

var seqNo = 0;

c1.on('connect', function (err) {
    console.log('Client connected.');
    seqNo = 0;
    setInterval(function () {
        c1.write (signOnMsg);
    }, 100);
});

c1.on('disconnect', function (err) {
    console.log('Client disconnected');
});

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
    if ((message.seqNo % 100) === 0) {
        console.log (process.memoryUsage());
    }
    seqNo += 1;
});

console.log('STARTED');





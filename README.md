This package contains examples of secure servers and clients using TLS, HTTPS and websockets.

This is basically my attempt at getting anything to work with openssl.

All the keys and certificates required can be made by make-certs.sh in the ssl directory.


Install and Test on a Raspery Pi
--------------------------------

Here are some instructions to run the TLS example client and server on the Pi, it seems quite long winded but
it's quite easy:

1) Install node. js and it's package manger on your Pi

    $ sudo apt-get install  nodejs
    $ sudo apt-get install npm

2) Test it:

    $js -v
    v0.6.19
    $

3) Raspian sets it up with the wrong name, normally we like to have the command "node" so create this with a
   symbolic link:

    $ sudo ln -s /usr/bin/nodejs /usr/bin/node

4) Hello world. Create a file "hello.js" containing the single line;

    console.log ("Hello world!");

and run it:

    $ node  hello.js

That should work as expected.

5) Check this example code:

    $ git clone https://github.com/ZiCog/node-tls-example.git

You may have to install git first.

6) Move to the directory that created and install some node modules:

    $ cd node-tls-example/
    $ npm install colors
    $ npm install express
    $ npm install socket.io
    $ npm install socket.io-client

These are installed locally to this directory. I think that is best for now.

7) Because of the way my examples handle authentication it is required that the server find a host name via DNS that
matches the one in the client connection. So to keep the server happy edit the raspies  /etc/hosts  file and add the
host name "agent1" to it like so:

    192.168.0.67    agent1

This requirement can be relaxed if required later.

8) Run the server part:

    $ node tls-server.js

9) Run the client part, from another terminal window or ssh session:

    $ node run-tls-client.js

You should see a bunch of message on the console indicating TLS and HTTPS has been authorized and some messages
being exchanged.


!!!!!!!!!!!!!!!!! HTTPS Example is broken for now !!!!!!!!!!!!!!!!!!!!!!!!!!


10) You should be able to make an HTTPS connection from a browser on a different machine using the URL:

    https://192.168.0.67:8443/
 
It takes a while to start up, most of that is loading node.js and the V8 engine from SD, once it is running it's
quite fast enough. 
There is not much error checking going on here so recovery from unreliable connections is not good. If you need
persistent connections that is easily fixed.

The version of node.js installed by apt-get on RAspian wheezy is quite old now, but works fine for us. If you want
to try very new versions there are instructions here:   http://oskarhane.com/raspberry-pi-install-node-js-and-npm/

You will eventually want your own SSL keys and certs. You can modify the make-certs.sh script in the ssl directory to do that. or there is a makefile in the keys directory that does a similar job (That is taken from SSL tests in the node.js source code).
SSL and making certs and keys is a subject for another day.


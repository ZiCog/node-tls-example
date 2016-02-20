This package contains examples of secure servers and clients using TLS, HTTPS and websockets.

This is basically my attempt at getting anything to work with openssl.

All the keys and certificates required can be made by make-certs.sh in the ssl directory.


Install and Test on a Raspery Pi
--------------------------------

Here are some instructions to run the TLS example clients and servers on the Pi, it seems quite long winded but
it's quite easy:

1) Install node. js Pi

A convenient way to do this is to use the node version manager, NVM, see instructions here:
https://github.com/creationix/nvm

2) Test it:

    $node.js -v
    v4.3.1
    $

Node v4.3.1 is the latest release this has been tested against

3) Hello world. Create a file "hello.js" containing the single line;

    console.log ("Hello world!");

and run it:

    $ node  hello.js

That should work as expected.

5) Check this example code:

    $ git clone https://github.com/ZiCog/node-tls-example.git

You may have to install git first.

6) Move to the directory that created and install:

    $ cd node-tls-example/

7) Install the required node modules.

    $ npm install


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

You will eventually want your own SSL keys and certs. You can modify the make-certs.sh script in the ssl directory to do that. or there is a makefile in the keys directory that does a similar job (That is taken from SSL tests in the node.js source code).
SSL and making certs and keys is a subject for another day.


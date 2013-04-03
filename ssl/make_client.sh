#!/bin/bash

DAYS=$((3*365))
LEVELS=4
DN="/C=US/ST=Florida/L=Miami/O=Example Corp./OU=PKI"




#generate key pair
openssl genrsa -out client-2.key 4096

#generate signing request
openssl req -new -key client-2.key -subj "$DN/CN=Client-2" -out client-2.csr

#sign new cert
openssl x509 -req -days $DAYS -in client-2.csr -CA ca$LEVELS.crt \
    -CAkey ca$LEVELS.key -set_serial 400 -out client-2.crt


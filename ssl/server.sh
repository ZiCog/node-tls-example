#!/bin/sh

PORT=4444
CERT=server.crt
KEY=server.key
CACERT=chain.crt

openssl s_server -CAfile $CACERT -cert $CERT -key $KEY -accept $PORT -www




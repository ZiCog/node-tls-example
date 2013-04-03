#!/bin/sh

PORT=4444
CERT=client.crt
KEY=client.key
CACERT=chain.crt

curl -k --cacert $CACERT --cert $CERT --key $KEY https://localhost:$PORT




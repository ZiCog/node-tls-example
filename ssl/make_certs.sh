#!/bin/sh

DAYS=$((3*365))
LEVELS=4
DN="/C=US/ST=Florida/L=Miami/O=Example Corp./OU=PKI"
CHAIN=chain.crt

############################################################
# Generate root certificate authority cert
############################################################

#generate root key pair
openssl genrsa -out root.key 4096

#generate root self-signed cert
openssl req -new -x509 -days $DAYS -key root.key -subj "$DN/CN=Root" -out root.crt
cat root.crt > $CHAIN

############################################################
# Generate subordinate certificate authority hierarchy
############################################################

for i in `seq 1 $LEVELS`; do
    echo "Level $i"
    if [ "$i" -eq 1 ]; then
        SIGNER_CERT=root.crt
        SIGNER_KEY=root.key
    else
        SIGNER_CERT=ca$((i-1)).crt
        SIGNER_KEY=ca$((i-1)).key
    fi

    #generate key pair
    openssl genrsa -out ca$i.key 4096

    #generate signing request
    openssl req -new -key ca$i.key -subj "$DN/CN=Level$i" -out ca$i.csr

    #sign new cert
    openssl x509 -req -days $DAYS -in ca$i.csr -CA $SIGNER_CERT -CAkey $SIGNER_KEY \
            -set_serial $i -out ca$i.crt
    cat ca$i.crt >> $CHAIN
done

############################################################
# Generate cert for server signed by leaf CA
############################################################

#generate key pair
openssl genrsa -out server.key 4096

#generate signing request
openssl req -new -key server.key -subj "$DN/CN=Server" -out server.csr

#sign new cert
openssl x509 -req -days $DAYS -in server.csr -CA ca$LEVELS.crt \
    -CAkey ca$LEVELS.key -set_serial 500 -out server.crt

############################################################
# Generate cert for client signed by leaf CA
############################################################

#generate key pair
openssl genrsa -out client.key 4096

#generate signing request
openssl req -new -key client.key -subj "$DN/CN=Client" -out client.csr

#sign new cert
openssl x509 -req -days $DAYS -in client.csr -CA ca$LEVELS.crt \
    -CAkey ca$LEVELS.key -set_serial 400 -out client.crt

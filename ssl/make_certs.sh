#!/bin/sh

DAYS=$((3*365))
LEVELS=4
DN="/C=US/ST=Florida/L=Miami/O=Example Corp./OU=PKI"
CHAIN=chain.crt

############################################################
# Generate root certificate authority cert
############################################################

#generate root key pair
echo "!!!!!!!!!!!!! 1"
openssl genrsa -out root.key 4096

#generate root self-signed cert
echo "!!!!!!!!!!!!! 2"
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
echo "!!!!!!!!!!!!! 3"
    openssl genrsa -out ca$i.key 4096

    #generate signing request
echo "!!!!!!!!!!!!! 4"
    openssl req -new -key ca$i.key -subj "$DN/CN=Level$i" -out ca$i.csr

    #sign new cert
echo "!!!!!!!!!!!!! 5"
    openssl x509 -req -days $DAYS -in ca$i.csr -CA $SIGNER_CERT -CAkey $SIGNER_KEY \
            -set_serial $i -out ca$i.crt
    cat ca$i.crt >> $CHAIN
done

############################################################
# Generate cert for server signed by leaf CA
############################################################

#generate key pair
echo "!!!!!!!!!!!!! 6"
openssl genrsa -out server.key 4096

#generate signing request
echo "!!!!!!!!!!!!! 7"
openssl req -new -key server.key -subj "$DN/CN=localhost" -out server.csr

#sign new cert
echo "!!!!!!!!!!!!! 8"
openssl x509 -req -days $DAYS -in server.csr -CA root.crt \
    -CAkey root.key -set_serial 500 -out server.crt 

############################################################
# Generate cert for client signed by leaf CA
############################################################

#generate key pair
echo "!!!!!!!!!!!!! 9"
openssl genrsa -out client.key 4096

#generate signing request
echo "!!!!!!!!!!!!! 10"
openssl req -new -key client.key -subj "$DN/CN=localhost" -out client.csr

#sign new cert
echo "!!!!!!!!!!!!! 11"
openssl x509 -req -days $DAYS -in client.csr -CA root.crt \
    -CAkey root.key -set_serial 400 -out client.crt 




#!/bin/sh

DAYS=$((3*365))
LEVELS=4
DN="/C=US/ST=Florida/L=Miami/O=Example Corp./OU=PKI"
CHAIN=chain.crt

############################################################
# Generate root certificate authority cert
############################################################

#generate root key pair
openssl genrsa -out root-key.pem 4096

#generate root self-signed cert
openssl req -new -x509 -days $DAYS -key root-key.pem -subj "$DN/CN=Root" -out root-cert.pem
cat root-cert.pem > $CHAIN

############################################################
# Generate subordinate certificate authority hierarchy
############################################################

for i in `seq 1 $LEVELS`; do
    echo "Level $i"
    if [ "$i" -eq 1 ]; then
        SIGNER_CERT=root-cert.pem
        SIGNER_KEY=root-key.pem
    else
        SIGNER_CERT=ca$((i-1))-cert.pem
        SIGNER_KEY=ca$((i-1))-key.pem
    fi

    #generate key pair
    openssl genrsa -out ca$i-key.pem 4096

    #generate signing request
    openssl req -new -key ca$i-key.pem -subj "$DN/CN=Level$i" -out ca$i-csr.pem

echo "-------------"
echo ">>>>>>>>>>>>>>>>>"$SIGNER_CERT
echo ">>>>>>>>>>>>>>>>>"$SIGNER_KEY

    #sign new cert
    openssl x509 -req -days $DAYS -in ca$i-csr.pem -CA $SIGNER_CERT -CAkey $SIGNER_KEY \
            -set_serial $i -out ca$i-cert.pem -extfile /etc/ssl/openssl.cnf -extensions v3_ca  
    cat ca$i-cert.pem >> $CHAIN
echo "-------------"

done

############################################################
# Generate cert for server signed by leaf CA
############################################################

#generate key pair
openssl genrsa -out server.key 4096

#generate signing request
openssl req -new -key server.key -subj "$DN/CN=Server" -out server.csr

#sign new cert
openssl x509 -req -days $DAYS -in server.csr -CA ca$LEVELS-cert.pem \
    -CAkey ca$LEVELS-key.pem -set_serial 500 -out server.cert

############################################################
# Generate cert for client signed by leaf CA
############################################################

#generate key pair
openssl genrsa -out client.key 4096

#generate signing request
openssl req -new -key client.key -subj "$DN/CN=Client" -out client.csr

#sign new cert
openssl x509 -req -days $DAYS -in client.csr -CA ca$LEVELS-cert.pem \
    -CAkey ca$LEVELS-key.pem -set_serial 400 -out client.cert

############################################################
# Generate cert for agent 2 signed by CA 4 
############################################################

#generate key pair
openssl genrsa -out agent1-key.pem 4096

#generate signing request
openssl req -new -key agent1-key.pem -subj "$DN/CN=agent1" -out agent1-csr.pem

#sign new cert
openssl x509 -req -days $DAYS -in agent1-csr.pem -CA ca4-cert.pem  \
    -CAkey ca4-key.pem -set_serial 500 -out agent1-cert.pem

############################################################
# Generate cert for agent 2 signed by CA 4
############################################################

#generate key pair
openssl genrsa -out agent2-key.pem 4096

#generate signing request
openssl req -new -key agent2-key.pem -subj "$DN/CN=agent2" -out agent2-csr.pem

#sign new cert
openssl x509 -req -days $DAYS -in agent2-csr.pem -CA ca4-cert.pem \
    -CAkey ca4-key.pem -set_serial 500 -out agent2-cert.pem









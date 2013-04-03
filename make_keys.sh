# Create the CA Key and Certificate for signing Client Certs
#openssl genrsa -des3 -out ca-key.pem 4096
openssl genrsa -out ca-key.pem 4096
openssl req -new -x509 -days 365 -key ca-key.pem -out ca-crt.pem \
    -subj '/CN=fits.rsm.ie/O=RSM Ltd./C=FI/ST=Espoo/L=Espoo'

# Create the Server Key, CSR, and Certificate
#openssl genrsa -des3 -out server-key.pem 1024
openssl genrsa -out server-key.pem 1024
openssl req -new -key server-key.pem -out server-csr.pem     \
    -subj '/CN=fits.rsm.ie/O=RSM Ltd./C=FI/ST=Espoo/L=Espoo'

# We're self signing our own server cert here.  This is a no-no in production.
openssl x509 -req -days 365 -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -set_serial 01 -out server-crt.pem

# Create the Client Key and CSR
#openssl genrsa -des3 -out client-key.pem 1024
openssl genrsa -out client-key.pem 1024
openssl req -new -key client-key.pem -out client-csr.pem  \
    -subj '/CN=fits.rsm.ie/O=RSM Ltd./C=FI/ST=Espoo/L=Espoo'

# Sign the client certificate with our CA cert.  Unlike signing our own server cert, this is what we want to do.
openssl x509 -req -days 365 -in client-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -set_serial 01 -out client-crt.pem

# Create another Client Key and CSR
#openssl genrsa -des3 -out client-key.pem 1024
openssl genrsa -out client-key-2.pem 1024
openssl req -new -key client-key-2.pem -out client-csr-2.pem  \
    -subj '/CN=fits.rsm.ie/O=RSM Ltd./C=FI/ST=Espoo/L=Espoo'

# Sign the client certificate with our CA cert.  Unlike signing our own server cert, this is what we want to do.
openssl x509 -req -days 365 -in client-csr-2.pem -CA ca-crt.pem -CAkey ca-key.pem -set_serial 02 -out client-crt-2.pem

all: agent1-cert.pem agent2-cert.pem


#
# Create Certificate Authority: ca1
# ('password' is used for the CA password.)
#
ca1-cert.pem: ca1.cnf
	openssl req -new -x509 -days 9000 -config ca1.cnf -keyout ca1-key.pem -out ca1-cert.pem



#
# agent1 is signed by ca1.
#

agent1-key.pem:
	openssl genrsa -out agent1-key.pem 1024

agent1-csr.pem: agent1.cnf agent1-key.pem
	openssl req -new -config agent1.cnf -key agent1-key.pem -out agent1-csr.pem

agent1-cert.pem: agent1-csr.pem ca1-cert.pem ca1-key.pem
	openssl x509 -req \
		-days 9000 \
		-passin "pass:password" \
		-in agent1-csr.pem \
		-CA ca1-cert.pem \
		-CAkey ca1-key.pem \
		-CAcreateserial \
		-out agent1-cert.pem

agent1-verify: agent1-cert.pem ca1-cert.pem
	openssl verify -CAfile ca1-cert.pem agent1-cert.pem



#
# agent2 is signed by ca1.
#

agent2-key.pem:
	openssl genrsa -out agent2-key.pem 1024

agent2-csr.pem: agent2.cnf agent2-key.pem
	openssl req -new -config agent2.cnf -key agent2-key.pem -out agent2-csr.pem

agent2-cert.pem: agent2-csr.pem ca1-cert.pem ca1-key.pem
	openssl x509 -req \
		-days 9000 \
		-passin "pass:password" \
		-in agent2-csr.pem \
		-CA ca1-cert.pem \
		-CAkey ca1-key.pem \
		-CAcreateserial \
		-out agent2-cert.pem

agent2-verify: agent2-cert.pem ca1-cert.pem
	openssl verify -CAfile ca1-cert.pem agent2-cert.pem



clean:
	rm -f *.pem *.srl

test: agent1-verify agent2-verify 


.PHONY: all clean test agent1-verify agent2-verify 

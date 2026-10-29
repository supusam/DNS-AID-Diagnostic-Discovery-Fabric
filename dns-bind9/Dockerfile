FROM ubuntu:24.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    bind9 \
    bind9-utils \
    bind9-doc \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /etc/bind

COPY named.conf /etc/bind/named.conf
COPY zones/db.lab.dnsaid.test /etc/bind/zones/db.lab.dnsaid.test

# Generate DNSSEC KSK and ZSK using Algorithm 13 (ECDSA P-256) and sign the zone
RUN mkdir -p /etc/bind/keys /etc/bind/zones && \
    cd /etc/bind/keys && \
    dnssec-keygen -a ECDSAP256SHA256 -b 256 -n ZONE lab.dnsaid.test && \
    dnssec-keygen -f KSK -a ECDSAP256SHA256 -b 256 -n ZONE lab.dnsaid.test && \
    cat Klab.dnsaid.test*.key >> /etc/bind/zones/db.lab.dnsaid.test && \
    dnssec-signzone -A -3 $(head -c 16 /dev/urandom | sha1sum | cut -b 1-16) \
      -N INCREMENT -o lab.dnsaid.test -t /etc/bind/zones/db.lab.dnsaid.test /etc/bind/keys/Klab.dnsaid.test*.private

EXPOSE 53/udp 53/tcp

CMD ["named", "-g", "-c", "/etc/bind/named.conf", "-u", "bind"]

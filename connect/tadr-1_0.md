# OpenID Trust Anchor Distribution & Rotation (TADR)  
**Draft 00**

**Specification Date:** 2025‑10‑17  
**Authors:**  
- Rahul Khanna, Independent  

---

## 1. Abstract
This specification defines a mechanism for distributing and rotating trust anchors in OpenID Connect deployments. Current OpenID Connect Discovery does not provide a standardized way for clients to obtain and refresh trust anchors, leading to interoperability gaps and outages during certificate rotation. The Trust Anchor Distribution & Rotation (TADR) specification introduces a new discovery parameter and a standardized trust bundle format to enable automated, interoperable, and secure trust anchor lifecycle management.

---

## 2. Introduction
OpenID Connect Discovery ([OpenID.Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html)) provides metadata about an issuer’s endpoints and keys, but does not define how clients should obtain or refresh trust anchors.  
This omission forces implementers to rely on static CA bundles or manual distribution, which is brittle in the face of certificate rotation.  

The TADR specification addresses this gap by:  
- Defining a new `trust_anchor_uri` metadata field in the discovery document.  
- Standardizing the format of trust anchor bundles.  
- Requiring overlapping validity windows to support seamless rotation.  
- Specifying client behavior for fetching, caching, and refreshing anchors.  

---

## 3. Requirements and Notation Conventions
The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in [RFC 2119] and [RFC 8174].

---

## 4. Terminology
- **Trust Anchor**: A self‑signed or root certificate used to validate a certificate chain.  
- **Trust Bundle**: A collection of one or more trust anchors published by an issuer.  
- **Rotation Window**: The period during which both the current and next trust anchors are valid.  

---

## 5. Specification

### 5.1 Discovery Metadata
Issuers supporting TADR MUST include the following field in their discovery document:

```json
{
  "trust_anchor_uri": "https://issuer.example.org/trust/certs"
}
```

### 5.2 Trust Anchor Bundle Format
The trust anchor bundle is a JSON object containing one or more certificates:

```json
{
  "certificates": [
    {
      "subject": "CN=issuer.example.org",
      "issuer": "CN=issuer.example.org",
      "valid_from": "2025-10-01T00:00:00Z",
      "valid_to": "2026-10-01T00:00:00Z",
      "fingerprint": "SHA256:AB:CD:...",
      "usage": "tls_server",
      "pem": "-----BEGIN CERTIFICATE-----..."
    }
  ]
}
```

### 5.3 JSON Schema Definition
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Trust Anchor Bundle",
  "type": "object",
  "properties": {
    "certificates": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "subject": { "type": "string" },
          "issuer": { "type": "string" },
          "valid_from": { "type": "string", "format": "date-time" },
          "valid_to": { "type": "string", "format": "date-time" },
          "fingerprint": { "type": "string" },
          "usage": { "type": "string", "enum": ["tls_server", "tls_client", "ca"] },
          "pem": { "type": "string" }
        },
        "required": ["subject", "issuer", "valid_from", "valid_to", "fingerprint", "pem"]
      }
    }
  },
  "required": ["certificates"]
}
```

### 5.4 Client Behavior
- Clients **MUST** fetch the trust anchor bundle at bootstrap.  
- Clients **SHOULD** refresh the bundle periodically (e.g., every 24 hours).  
- Clients **MUST** retry with a refreshed bundle if a TLS validation error occurs.  
- Clients **MUST** support overlapping anchors during rotation.  

---

## 6. Security Considerations
- Trust anchor bundles **MUST** be served over HTTPS.  
- Issuers **SHOULD** sign trust bundles to prevent tampering.  
- Clients **MUST** validate certificate fingerprints and validity periods.  
- Rotation windows **MUST** overlap to prevent outages.  

---

## 7. Privacy Considerations
- Fetching trust anchors does not reveal user‑specific data.  
- Issuers **SHOULD** avoid embedding identifying information in trust bundle metadata.  

---

## 8. Implementation Considerations
- Issuers may generate bundles dynamically or pre‑publish them.  
- Clients may cache bundles locally and refresh on schedule.  
- Bundles may be distributed via CDNs for scalability.  

---

## 9. IANA Considerations
This specification makes no requests of IANA.

---

## 10. References

### 10.1 Normative References
- [RFC 2119] Key words for use in RFCs to Indicate Requirement Levels.  
- [RFC 8174] Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words.  
- [RFC 5280] Internet X.509 Public Key Infrastructure Certificate and CRL Profile.  
- [OpenID.Discovery] OpenID Connect Discovery 1.0, <https://openid.net/specs/openid-connect-discovery-1_0.html>  

### 10.2 Informative References
- [RFC 5914] Trust Anchor Format.  
- [CAB Forum Ballots] TLS Certificate Lifetime Reductions.  

---

## Appendix A. Notices
Copyright (c) 2025 The OpenID Foundation.  
The OpenID Intellectual Property Rights Policy governs this specification.  

---

## Appendix B. Acknowledgements
The authors thank members of the OpenID Foundation AB Working Group and the PKI/IAM community for their input and feedback.  

---

## Appendix C. Non‑Normative Reference Implementation
A reference implementation of TADR is available in the working group repository under `connect/examples/tadr/`.  
This includes:  
- **server.js**: A Node.js service that generates and rotates trust anchors, publishes a trust bundle, and exposes OIDC discovery metadata.  
- **fetch-client.py**: A Python client that consumes the trust bundle, validates anchors, and demonstrates self‑healing behavior during rotation.  
- **README.md**: Instructions for running the demo, including setup, execution, and expected behavior.  

These materials are **non‑normative** and provided solely for illustration. They are not required for conformance with this specification.

---

## Appendix D. History
- **Draft 00 (2025‑10‑17)**: Initial draft submitted for discussion.  

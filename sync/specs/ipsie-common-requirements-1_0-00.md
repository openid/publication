---
title: "IPSIE Common Requirements Profile Draft 00"
abbrev: "IPSIE Common Requirements"

docname: draft-ipsie-common-requirements-profile-00
number:
date:
v: 3
# area: AREA
workgroup: IPSIE Working Group
keyword:
 - openid
 - ipsie
venue:
 group: IPSIE
 type: Working Group
 mail: openid-specs-ipsie@lists.openid.net
 arch: https://openid.net/wg/ipsie/
 github: "openid/ipsie-common-requirements-profile"
 latest: https://openid.github.io/ipsie-common-requirements-profile/draft-ipsie-common-requirements-profile.html

author:
 -
    fullname: Dean H. Saxe
    organization: Full Frontal Nerdity Industries
    email: dean@thesax.es

normative:
  BCP195:
  RFC2119:
  RFC8174:
  RFC6749:
  RFC6750:
  RFC6797:
  RFC7636:
  RFC8252:
  RFC8414:
  RFC8725:
  RFC9126:
  RFC9207:
  RFC9449:
  RFC9525:
  RFC9700:
  OpenID:
    title: OpenID Connect Core 1.0 incorporating errata set 2
    target: https://openid.net/specs/openid-connect-core-1_0.html
    date: December 15, 2023
    author:
      - ins: N. Sakimura
      - ins: J. Bradley
      - ins: M. Jones
      - ins: B. de Medeiros
      - ins: C. Mortimore
  OpenID.Discovery:
    title: OpenID Connect Discovery 1.0 incorporating errata set 2
    target: https://openid.net/specs/openid-connect-discovery-1_0.html
    date: December 15, 2023
    author:
      - ins: N. Sakimura
      - ins: J. Bradley
      - ins: M. Jones
      - ins: E. Jay
  NIST.FAL:
    title: NIST SP 800-63 Digital Identity Guidelines Federation Assurance Level (FAL)
    target: https://pages.nist.gov/800-63-4/sp800-63c/fal/
    date: August 28, 2024

informative:

--- abstract

The IPSIE Common Requirements Profile Draft 00 is a profile of multiple common security requirements that are applicable to all IPSIE levels (SL* and IL*) and protocols. These common requirements are intended to meet the security and interoperability requirements of enterprise using one or more IPSIE profiles.

--- middle

# Introduction

TODO Introduction to the common requirements

# Conventions and Definitions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

# Profile

## Security Controls
(to be removed later: note the following bullets are related to https://github.com/openid/ipsie/issues/72)
This section is non-normative.

* All IPSIE compliant identity providers and applications should implement a security controls program, such as NIST SP800-53, FEDRAMP, or other relevant program.
* The program should identify how personal attributes of users are stored at rest by the provider, whether an identity provider or application.
* This program and its controls should be documented and made available to relevant parties in an IPSIE compliant federation.

## Network Layer Requirements

### Requirements for all endpoints

To protect against network attacks, clients, authorization servers, and resource servers:

* MUST only offer TLS protected endpoints and MUST establish connections to other servers using TLS;
* MUST set up TLS connections using TLS version 1.2 or later;
* MUST follow the recommendations for Secure Use of Transport Layer Security in [BCP195];
* SHOULD use DNSSEC to protect against DNS spoofing attacks that can lead to the issuance of rogue domain-validated TLS certificates; and
* MUST perform a TLS server certificate check, as per [RFC9525].

### Requirements for endpoints not used by web browsers

For server-to-server communication endpoints that are not used by web browsers, the following requirements apply:

* When using TLS 1.2, servers MUST only permit the cipher suites recommended in [BCP195];
* When using TLS 1.2, clients SHOULD only permit the cipher suites recommended in [BCP195].

### Requirements for endpoints used by web browsers

For endpoints that are used by web browsers, the following additional requirements apply:

* Servers MUST use methods to ensure that connections cannot be downgraded using TLS stripping attacks. A preloaded [preload] HTTP Strict Transport Security policy [RFC6797] can be used for this purpose. Some top-level domains, like .bank and .insurance, have set such a policy and therefore protect all second-level domains below them.
* When using TLS 1.2, servers MUST only use cipher suites allowed in [BCP195].
* Servers MUST NOT support [CORS] for the authorization endpoint, as clients must perform an HTTP redirect rather than access this endpoint directly.


## Cryptography and Secrets

The following requirements apply to cryptographic operations and secrets:

* Authorization servers, clients, and resource servers when creating or processing JWTs:
  * MUST adhere to [RFC8725];
  * MUST use PS256, ES256, or EdDSA (using the Ed25519 variant) algorithms; and
  * MUST NOT use or accept the `none` algorithm.
* RSA keys MUST have a minimum length of 2048 bits.
* Elliptic curve keys MUST have a minimum length of 224 bits.
* Credentials not intended for handling by end-users (e.g., access tokens, refresh tokens, authorization codes, etc.) MUST be created with at least 128 bits of entropy such that an attacker correctly guessing the value is computationally infeasible ({{Section 10.10 of RFC6749}}).

## Federation

IPSIE federation protocols are designed to be compliant with many of the technical controls defined in [NIST.FAL] at FAL2.  The following federation requirements are derived from the FAL2 requirements and apply to all federation protocol profiles developed by the IPSIE WG.

* (to be removed later: note the following bullets are related to https://github.com/openid/ipsie/issues/77 and https://github.com/openid/ipsie/issues/81)
* Identity providers and applications SHALL minimize account attribute disclosures to those required for business operations.

* (to be removed later: note the following bullets are related to https://github.com/openid/ipsie/issues/78)
* Account linking as defined in Section 3.7.1 of [NIST.FAL] MAY be supported by RPs.
  * RPs MUST disable account linking by default.
  * RPs that allow account linking MUST follow the requirements of [NIST.FAL].

* (to be removed later: note the following bullets are related to https://github.com/openid/ipsie/issues/80)
* Alternative authentication mechanisms that bypass federated authentication MAY be supported by IPSIE compliant applications at all SL levels.  These mechanisms are commonly known as "break-glass" accounts.
  * These mechanisms MUST be disabled by default and MAY be enabled on an individual user basis.  The mechanism of enablement is not specified by IPSIE.
  * Alternative authentication mechanisms MUST meet the minimum requirements of IPSIE authentication, including the use of multifactor authentication.
   * Phishing resistant authentication is RECOMMENDED.
  * Alterntive authentication mechanisms MUST be disabled through an identity provisioning protocol when the user's account is disabled or deleted from the application to prevent access to the account.

* (to be removed later: note the following bullets are related to https://github.com/openid/ipsie/issues/81 and https://github.com/openid/ipsie/issues/75)
* Encryption of assertions passed through the back channel MUST be offered by identity providers and MAY be used by applications.
* Assertions passed through the front channel MUST be encrypted.
* Pairwise identifiers to prevent correlation of the user's activities across multiple RPs MUST be offered by identity providers and MAY be used by applications.

* (to be removed later: note the following bullets are related to https://github.com/openid/ipsie/issues/93)
* Subject identifiers may not be globally unique in the absence of additional information. To ensure subject identifier uniqueness RP's MUST use both the subject identifier and a tenant identifier to create globally unique subjects that are bound to the tenant.

* (to be removed later: note the following bullet is related to https://github.com/openid/ipsie/issues/94)
* All federation transactions MUST originate from the RP.
* The IdP MAY signal to the RP that the user should be authenticated via federation.
* Unsolicited federation requests SHALL NOT originate from the IdP (_e.g._ IdP initiated federation).

# Security Considerations

TODO Security
* Alternative authN mechanisms/break glass security risks

# IANA Considerations

This document has no IANA actions.


--- back

# Notices

Copyright (c) 2025 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer,
implementer, or other interested party a non-exclusive, royalty free,
worldwide copyright license to reproduce, prepare derivative works from,
distribute, perform and display, this Implementers Draft, Final
Specification, or Final Specification Incorporating Errata Corrections
solely for the purposes of (i) developing specifications,
and (ii) implementing Implementers Drafts, Final Specifications,
and Final Specification Incorporating Errata Corrections based
on such documents, provided that attribution be made to the OIDF as the
source of the material, but that such attribution does not indicate an
endorsement by the OIDF.

The technology described in this specification was made available
from contributions from various sources, including members of the OpenID
Foundation and others. Although the OpenID Foundation has taken steps to
help ensure that the technology is available for distribution, it takes
no position regarding the validity or scope of any intellectual property
or other rights that might be claimed to pertain to the implementation
or use of the technology described in this specification or the extent
to which any license under such rights might or might not be available;
neither does it represent that it has made any independent effort to
identify any such rights. The OpenID Foundation and the contributors to
this specification make no (and hereby expressly disclaim any)
warranties (express, implied, or otherwise), including implied
warranties of merchantability, non-infringement, fitness for a
particular purpose, or title, related to this specification, and the
entire risk as to implementing this specification is assumed by the
implementer. The OpenID Intellectual Property Rights policy
(found at openid.net) requires
contributors to offer a patent promise not to assert certain patent
claims against other contributors and against implementers.
OpenID invites any interested party to bring to its attention any
copyrights, patents, patent applications, or other proprietary rights
that may cover technology that may be required to practice this
specification.


# Document History

[[ To be removed from the final specification ]]

-00

* Initial draft
* Moved the sections Network Layer Requirements and Cryptography and Secrets from the IPSIE SL1 OIDC profile draft.

# Acknowledgements
{:numbered="false"}

TODO acknowledge Aaron Parecki for his initial documentation of the Network Layer Requirements and Cryptography and Secrets from the IPSIE SL1 OIDC profile draft.  Acknowledge feedback and contributions from the IPSIE WG.
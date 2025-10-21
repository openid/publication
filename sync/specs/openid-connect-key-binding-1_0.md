%%%
title = "OpenID Connect Key Binding 1.0 - draft 00"
abbrev = "openid-connect-key-binding"
ipr = "none"
workgroup = "OpenID Connect"
keyword = ["security", "openid", "lifecycle"]

[seriesInfo]
name = "Internet-Draft"
value = "openid-key-binding-1_0"
status = "standard"

[[author]]
initials="D."
surname="Hardt"
fullname="Dick Hardt"
organization="Hellō"
    [author.address]
    email = "dick.hardt@gmail.com"

[[author]]  
initials="E."
surname="Heilman"
fullname="Ethan Heilman"
organization="Cloudflare"
    [author.address]
    email = "ethan.r.heilman@gmail.com"

%%%
<reference anchor="OpenID.Core" target="https://openid.net/specs/openid-connect-core-1_0.html">
  <front>
    <title>OpenID Connect Core 1.0 (incorporating errata set 2)</title>
    <author fullname="Nat Sakimura" initials="N." surname="Sakimura"/>
    <author fullname="Michael B. Jones" initials="M." surname="Jones"/>
    <author fullname="John Bradley" initials="J." surname="Bradley"/>
    <date year="2023" month="December" day="15"/>
  </front>
</reference>

<reference anchor="OpenID.Discovery" target="https://openid.net/specs/openid-connect-discovery-1_0.html">
  <front>
    <title>OpenID Connect Discovery 1.0 (incorporating errata set 2)</title>
    <author fullname="Nat Sakimura" initials="N." surname="Sakimura"/>
    <author fullname="Michael B. Jones" initials="M." surname="Jones"/>
    <author fullname="John Bradley" initials="J." surname="Bradley"/>
    <author fullname="Edmund Jay" initials="E." surname="Jay"/>
    <date year="2023" month="December" day="15"/>
  </front>
</reference>

<reference anchor="IANA.JOSE.ALGS" target="https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms">
  <front>
    <title>IANA JSON Web Signature and Encryption Algorithms Registry</title>
    <author fullname="IANA"/>
    <date year="2025"/>
  </front>
</reference>

.# Abstract


OpenID Key Binding specifies how to bind a public key to an OpenID Connect ID Token using mechanisms defined in [@!RFC9449], OAuth 2.0 Demonstrating Proof of Possession (DPoP).

{mainmatter}

# Introduction

OpenID Connect is a protocol that enables a Relying Party (RP) to delegate authentication and obtain identity claims to an OpenID Connect Provider (OP).

When authenticating with OpenID Connect, an RP provides a nonce in its authentication request. The ID Token signed and returned by the OP contains the nonce and claims about the user. When verifying the ID Token, the RP confirms it contains the nonce, binding the session that made the request to the response.

It is common for an RP to be composed of multiple components such as a RP authenticating component that  obtains the ID Token from the OP and an RP consuming component which checks the ID Token presented to it by the authenticating component. When the RP authenticating component wants to prove to an RP consuming component that it has authenticated a user, it may present the ID Token as a bearer token. However, bearer tokens are vulnerable to theft and replay attacks - if an attacker obtains the ID Token, they can impersonate the authenticated user.

By binding a cryptographic key to the ID Token, the RP authenticating component can prove to RP consuming components not only that a user has been authenticated, but that the RP authenticating component itself was the original recipient of that authentication. This transforms the ID Token from a vulnerable bearer token into a proof-of-possession token that provides stronger security guarantees.

The RP may also prove possession of the bound key when presenting an ID Token back to the OP.

Use cases include: a mobile app that has received an ID Token exchanging the ID Token with a proof of possession with a first party authorization service for an access token; an instance of a peer to peer application such as video conferencing where one instance of the application sends the ID Token with a proof of possession to a second instance to prove which user is operating the first instance.

This specification profiles OpenID Connect 1.0 [@!OpenID.Core], RFC8628 - OAuth 2.0 Device Authorization Grant [@!RFC8626], and RFC9449 - OAuth 2.0 Demonstrating Proof of Possession (DPoP) [@!RFC9449] to enable cryptographically bound ID Tokens that resist theft and replay attacks while maintaining compatibility with existing OpenID Connect infrastructure.


## Requirements Notation and Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in [@!RFC2119].

In the .txt version of this specification,
values are quoted to indicate that they are to be taken literally.
When using these values in protocol messages,
the quotes MUST NOT be used as part of the value.
In the HTML version of this specification,
values to be taken literally are indicated by
the use of *this fixed-width font*.

## Terminology

This specification uses the following terms:

- **OP**: The OpenID Provider as defined in [@!OpenID.Core].

- **RP**: The Relying Party as defined in [@!OpenID.Core]. 

The parameters **dpop_jkt** and **DPoP** as defined in [@!RFC9449]

## Protocol Profile Overview

This specification profiles how to bind a public key to an ID Token by:

1. adding the `bound_key` scope and `dpop_jkt` parameter to the OpenID Connect Authentication Request
2. receiving the authorization `code` as usual in the Authentication Response
3. adding the `DPoP` header that includes the hash of the `code`, `c_hash`, as a claim in the Token Request to the OP `token_endpoint`
4. adding the `cnf` claim containing the public key to the returned ID Token

```
+------+                              +------+
|      |-- Authentication Request --->|      |
|  RP  |   (1) bound_key & dpop_jkt   |  OP  | 
|      |                              |      | 
|      |<-- Authentication Response --|      |
|      |   (2) authorization code     |      | 
|      |                              |      | 
|      |-- Token Request ------------>|      |
|      |   (3) DPoP header w/ c_hash  |      |
|      |                              |      |
|      |<-- Token Response -----------|      |
|      |   (4) cnf claim containing   |      |
|      |   the public key in ID Token |      | 
+------+                              +------+
```

## OpenID Connect Metadata

The OP's OpenID Connect Metadata Document [@!OpenID.Discovery] SHOULD include:

- the `bound_key` scope in the `supported_scopes`
- the `dpop_signing_alg_values_supported` property containing a list of supported algorithms as defined in [@?IANA.JOSE.ALGS] 


## Authentication Request - Authorization Code Flow

If the RP authenticating component is running on a device that supports a web browser, it makes an authorization request per [@!OpenID.Core] 3.1. In addition to the `scope` parameter containing `openid`, and the `response_type` having the value `code`, the `scope` parameter MUST also include `bound_key`, and the request MUST include the `dpop_jkt` parameter having the value of the JWK Thumbprint [@!RFC7638] of the proof-of-possession public key using the SHA-256 hash function, as defined in [@!RFC9449] section 10.

Following is a non-normative example of an authentication request using the authorization code flow:

```text
GET /authorize?
response_type=code
&dpop_jkt=1f2e6338febe335e2cbaa7c7154c3cbdcfd8650f95c5fe7206bb6360e37f4b5a
&scope=openid%20profile%20email%20bound_key
&client_id=s6BhdRkqt3
&state=af0ifjsldkj
&nonce=2a50f9ea812f9bb4c8f7
&redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb HTTP/1.1
Host: server.example.com
```

If the OP does not support the `bound_key` scope, it SHOULD ignore it per [@!OpenID.Core] 3.1.2.1.


## Authentication Request - Device Authorization Flow

If the RP authenticating component is running on a device that does not support a web browser, it makes an authorization request per [@!RFC8628] 3.1. In the request, the `scope` parameter MUST contain both `openid` and `bound_key`. The request MUST include the `dpop_jkt` parameter having the value of the JWK Thumbprint [@!RFC7638] of the proof-of-possession public key using the SHA-256 hash function, as defined in [@!RFC9449] section 10.

Following is a non-normative example of an authentication request using the device authorization flow:

```text
TBD

```


If the OP does not support the `bound_key` scope, it SHOULD ignore it per [@!OpenID.Core] 3.1.2.1.


## Authentication Response


If the key provided was not previously bound to the client, the OP SHOULD inform a user and obtain consent that a key binding will be done. 

On successful authentication of, and consent from the user, the OP returns an authorization `code`.

Following is a non-normative example of a response:

```text
TBD
```

## Token Request

To obtain the ID Token, the RP authenticating component:

1. generates a `c_hash` by computing a SHA256 hash of the authorization `code`
2. converts the hash to BASE64URL 
3. generates a `DPoP` header, including the `c_hash` claim in the `DPoP` header JWT. This binds the authorization code to the token request. 

Non-normative example:

```text
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
DPoP: eyJhbGciOiJFUzI1NiJ9.eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6IkV\
 TMjU2IiwiandrIjp7ImNydiI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ4IjoibWptR\
 m1MZm9wVmkwZXRfYTZmZFhUTnJqYVUwR1dlZFN0Y3NfRzU4OEkyMCIsInkiOiJ\
 sMFZwRXlSYzdTdUpfdHFhd2NaQ2VLLXVUOEVPVnF4N3NqTHJGeUJTUllZIn0sI\
 m5vbmNlIjoiU3BseGxPQmVaUVFZYllTNld4U2JJQSJ9.cp8uN3kHAMS9fhGH7T\
 vTSKwH5oNJzAeMhIrgD_HQHGhgt_N1xQHdHiMkn7AMj3UDkwoNOW4Qqak
grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```

If a DPoP header is included in the token request to the OP, and the `dpop_jkt` parameter was not included in the authentication request, the OP MUST NOT include the `cnf` claim in the ID Token.

> This prevents an existing deployment using DPoP for access token from having them included in ID Tokens accidentally.

The OP MUST:
- perform all verification steps as described in [@!RFC9449] section 5.
- calculate the `c_hash` from the authorization `code` just as the RP component did.
- confirm the `c_hash` in the DPoP JWT matches its calculated `c_hash`

## Token Response

If the token request was successful, the OP MUST return an ID Token containing the `cnf` claim as defined in [@!RFC7800] set to the jwk of the user's public key and with  `typ` set to `id_token+cnf` in the ID Token's protected header.

Non-normative example of the ID Token payload:

```json
{
    "iss": "https://server.example.com",
    "sub": "24400320",
    "aud": "s6BhdRkqt3",
    "nonce": "n-0S6_WzA2Mj",
    "exp": 1311281970,
    "iat": 1311280970,
    "cnf":
        {
            "jwk": {
                "alg":"ES256",
                "crv": "P-256",
                "kty": "EC",
                "x": "mjmFmLfopVi0et_a6fdXTNrjaU0GWedStcs_G588I20",
                "y": "l0VpEyRc7SuJ_tqawcZCeK-uT8EOVqx7sjLrFyBSRYY"
            }
        }
}
```

## ID Token Proof of Possession

The mechanism for how an RP authenticating component proves to an RP consuming component that it possesses the private keys associated with the `cnf` claim in the ID Token is out of scope of this document.

> If the WG wants to, we can also profile how to use KB to bind a proof of possession to an ID Token for presentation when a proof of possesion is not present.

# Privacy Considerations

An RP authenticating component SHOULD only share an ID Token with a consuming component when such sharing is consistent with the original purpose for which the PII was collected and the scope of consent obtained from the user.

# Security Considerations

## Require Proof of Possesion

An RP consuming component MUST NOT trust an ID Token with a `cnf` claim without a corresponding proof of possession from the RP authenticating component.

## ID Token Reverification

In addition to verifying the signature created by the RP authenticating component to prove possession of the private key associated with the `cnf` claim in the ID Token, an RP consuming component MUST independently verify the signature and validity of the ID Token and that the `aud` claim in the payload is the correct value, and that the `typ` claim in the protected header is `id_token+cnf`.


## Use as Access Token

The ID Token MUST NOT be used as an access token to access resources. The RP MAY exchange the ID Token with a proof of possesion for an access token that can then be used to access resources.

## Unique Key Pair

To prevent token confusion attacks, the RP authenticating component SHOULD bind a unique key pair to its ID Tokens, and not use it for other purposes.

## Using cnf as a User Claim

The `cnf` claim in the ID Token MUST be verified together with proof of possession and MUST NOT be treated as proof on its own. A proof of possession is REQUIRED to establish that a party controls the key identified by `cnf`. The `cnf` claim SHOULD only be used to bind a signed object with the other claims in the ID Token.

# IANA Considerations

The following entry should be added to the "Media Types" registry for the new JWT type:

Type name: application

Subtype name: dpop+id_token

{backmatter}

# Acknowledgements

The authors would like to thank early feedback provided by Filip Skokan, Frederik Krogsdal Jacobsen, George Fletcher, Jacob Ideskog, Karl McGuinness, and Kosuke Koiwai.


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

   initial draft

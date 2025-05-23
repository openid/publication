# Financial-grade API - Part 2: Read and Write API Security Profile

## Warning

This document is not an OIDF International Standard. It is distributed for review and comment. It is subject to change without notice and may not be referred to as an International Standard.

Recipients of this draft are invited to submit, with their comments, notification of any relevant patent rights of which they are aware and to provide supporting documentation.

## Copyright notice & license
The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.

##Foreword

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised by over 160 participating entities (workgroup participants). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established has the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

Final drafts adopted by the Workgroup through consensus are circulated publicly for the public review for 60 days and for the OIDF members for voting. Publication as an OIDF Standard requires approval by at least 50 % of the members casting a vote. There is a possibility that some of the elements of this document may be the subject to patent rights. OIDF shall not be held responsible for identifying any or all such patent rights.

Financial-grade API consists of the following parts:

* Part 1: Read-Only API Security Profile
* Part 2: Read and Write API Security Profile
* Part 3: Client Initiated Backchannel Authentication Profile

Future parts may follow.

These parts are intended to be used with [RFC6749], [RFC6750], [RFC7636], and [OIDC].

##Introduction

Fintech is an area of future economic growth around the world and Fintech organizations need to improve the security of their operations and protect customer data. It is common practice of aggregation services to use screen scraping as a method to capture data by storing users' passwords. This brittle, inefficient, and insecure practice creates security vulnerabilities which require financial institutions to allow what appears to be an automated attack against their applications and to maintain a whitelist of aggregators. A new draft standard, proposed by this workgroup would instead utilize an API model with structured data and a token model, such as OAuth [RFC6749, RFC6750].

The Financial-grade API aims to provide specific implementation guidelines for online financial services to adopt by developing a REST/JSON data model protected by a highly secured OAuth profile. The Financial-grade API security profile can be applied to online services in any market area that requires a higher level of security than provided by standard OAuth or OpenID Connect.
 
This document is Part 2 of FAPI that specifies the Financial-grade API and it provides a profile of OAuth that is suitable to be used in write access to financial data (also known as transaction access) and other similar higher risk access. This document specifies the controls against attacks such as: authorization request tampering, authorization response tampering including code injection, state injection, and token request phishing. Additional details are available in the security considerations section.

### Notational Conventions

The keywords "shall", "shall not",
"should", "should not", "may", and
"can" in this document are to be interpreted as described in
ISO Directive Part 2 [ISODIR2].
These keywords are not used as dictionary terms such that
any occurrence of them shall be interpreted as keywords
and are not to be interpreted with their natural language meanings.

#**Financial-grade API - Part 2: Read and Write API Security Profile **

[TOC]

## 1. Scope

This part of the document specifies the method of

* applications to obtain the OAuth tokens in an appropriately secure manner for higher risk access to data;
* applications to use OpenID Connect to identify the customer; and
* using tokens to interact with the REST endpoints that provides protected data; 

This document is applicable to higher risk use cases which includes commercial and investment banking and other similar industries.

## 2. Normative references
The following referenced documents are indispensable for the application of this document. For dated references, only the edition cited applied. For undated references, the latest edition of the referenced document (including any amendments) applies.

[ISODIR2] - ISO/IEC Directives Part 2
[ISODIR2]: http://www.iso.org/sites/directives/2016/part2/index.xhtml

[RFC7230] - Hypertext Transfer Protocol -- HTTP/1.1
[RFC7230]: https://tools.ietf.org/html/rfc7230

[RFC6749] - The OAuth 2.0 Authorization Framework
[RFC6749]: https://tools.ietf.org/html/rfc6749

[RFC6750] - The OAuth 2.0 Authorization Framework: Bearer Token Usage
[RFC6750]: https://tools.ietf.org/html/rfc6750

[RFC7636] - Proof Key for Code Exchange by OAuth Public Clients
[RFC7636]: https://tools.ietf.org/html/rfc7636

[RFC5246] - The Transport Layer Security (TLS) Protocol Version 1.2
[RFC5246]: https://tools.ietf.org/html/rfc5246

[RFC6125] - Representation and Verification of Domain-Based Application Service Identity within Internet Public Key Infrastructure Using X.509 (PKIX) Certificates in the Context of Transport Layer Security (TLS)
[RFC6125]: https://tools.ietf.org/html/rfc6125

[RFC6819] - OAuth 2.0 Threat Model and Security Considerations
[RFC6819]: https://tools.ietf.org/html/rfc6819

[RFC7519] - JSON Web Token (JWT)
[RFC7519]:https://tools.ietf.org/html/rfc7519

[BCP212] - OAuth 2.0 for Native Apps
[BCP212]: https://tools.ietf.org/html/bcp212

[BCP195] - Recommendations for Secure Use of Transport Layer Security (TLS) and Datagram Transport Layer Security (DTLS)
[BCP195]: https://tools.ietf.org/html/bcp195

[OIDC] - OpenID Connect Core 1.0 incorporating errata set 1
[OIDC]: http://openid.net/specs/openid-connect-core-1_0.html

[OIDD] -  OpenID Connect Discovery 1.0 incorporating errata set 1
[OIDD]: http://openid.net/specs/openid-connect-discovery-1_0.html

[OIDM] -  OAuth 2.0 Multiple Response Type Encoding Practices
[OIDM]: http://openid.net/specs/oauth-v2-multiple-response-types-1_0.html

[X.1254] - Entity authentication assurance framework
[X.1254]: https://www.itu.int/rec/T-REC-X.1254

[OAUTB] - OAuth 2.0 Token Binding
[OAUTB]: https://tools.ietf.org/html/draft-ietf-oauth-token-binding

[MTLS] - Mutual TLS Profile for OAuth 2.0
[MTLS]: https://tools.ietf.org/html/draft-ietf-oauth-mtls

[JARM] - Financial Services – Financial-grade API: JWT Secured Authorization Response Mode for OAuth 2.0 (JARM)
[JARM]: https://bitbucket.org/openid/fapi/src/master/Financial_API_JWT_Secured_Authorization_Response_Mode.md

## 3. Terms and definitions
For the purpose of this document, the terms defined in [RFC6749], [RFC6750], [RFC7636], [OpenID Connect Core][OIDC] apply.


## 4. Symbols and Abbreviated terms

**API** – Application Programming Interface

**CSRF** - Cross Site Request Forgery

**FAPI** - Financial API

**HTTP** – Hyper Text Transfer Protocol

**OIDF** - OpenID Foundation

**REST** – Representational State Transfer

**TLS** – Transport Layer Security

## 5. Read and write API security profile

### 5.1 Introduction

The OIDF Financial-grade API (FAPI) is a REST API that provides JSON data representing
higher risk data. These APIs are protected by the
OAuth 2.0 Authorization Framework that consists of [RFC6749], [RFC6750],
[RFC7636], and other specifications.

There are different levels of risks associated with access to these APIs.
For example, read and write access to a bank API has a higher financial risk than read-only access. As
such, the security profiles of the authorization framework protecting these
APIs are also different. 

This profile describes security provisions for the server and client that are appropriate for Financial-grade APIs by defining the measures to mitigate:

* attacks that leverage the weak binding of endpoints in [RFC6749] (e.g. malicious endpoint attacks, IdP mix-up attacks),
* attacks that modify authorization requests and responses unprotected in [RFC6749] by leveraging OpenID Connect's Hybrid Flow that returns an ID Token in the authorization response. 

While the name ID Token suggests that it is something  that provides the identity of the resource owner (subject), it is not necessarily so. While it does identify the authorization server by including the issuer identifier, 
it is perfectly fine to have an ephemeral subject identifier. In this case, the ID Token acts as a detached signature of the issuer to the authorization response and it was an explicit design decision of OpenID Connect Core
to make the ID Token act as a detached signature.

This document leverages this fact and protects the authorization response by including the hash of all of the unprotected response parameters, e.g. `code` and `state`. 

While the hash of the `code` is defined in [OIDC], the hash of the `state` is not defined. 
Thus this document defines it as follows. 

**s_hash**

>State hash value. Its value is the base64url encoding of the left-most half of the hash of the octets of the ASCII representation
of the `state` value, where the hash algorithm used is the hash algorithm used
in the `alg` header parameter of the ID Token's JOSE header. For instance,
if the `alg` is `HS512`, hash the state value with SHA-512, then take the left-most 256 bits and base64url encode them.
The `s_hash` value is a case sensitive string.


### 5.2 Read and write API security provisions

#### 5.2.1 Introduction

Read and write access carries higher risk; therefore the protection level required is higher than read-only access.

As a profile of The OAuth 2.0 Authorization Framework, this document mandates the following for the read and write API of the FAPI.

#### 5.2.2 Authorization server

The authorization server shall support the provisions specified in clause 5.2.2 of Financial-grade API - Part 1: Read-Only API Security Profile.

In addition, the authorization server, for the write operation,

1. shall require the `request` or `request_uri` parameter to be passed as a JWS signed JWT as in clause 6 of [OIDC];
1. shall require the `response_type` values `code id_token` or `code id_token token`;
1. shall return ID Token as a detached signature to the authorization response;
1. shall include state hash, `s_hash`, in the ID Token to protect the `state` value if the client supplied a value for `state`. `s_hash` may be omitted from the ID Token returned from the Token Endpoint when `s_hash` is present in the ID Token returned from the Authorization Endpoint;
1. shall only issue authorization code, access token, and refresh token that are holder of key bound;
1. shall support [OAUTB] or [MTLS] as a holder of key mechanism;
1. shall support user authentication at LoA 3 or greater as defined in [X.1254];
1. shall support signed ID Tokens;
1. should support signed and encrypted ID Token;
1. shall require that all parameters are present inside the signed request object passed in the `request` or `request_uri` parameter;
1. may support the request object endpoint as described in section 7;
1. shall require [RFC7636] with S256 as the code challenge method for public clients only, if it supports public clients;
1. shall require the request object to contain an `exp` claim; and
1. shall authenticate the confidential client at the token endpoint using one of the following methods (this overrides FAPI part 1 clause 5.2.2.4):
    1. Mutual TLS for OAuth Client Authentication as specified in section 2 of [MTLS];
    2. `private_key_jwt` as specified in section 9 of [OIDC];

#### 5.2.3 Public client

A public client shall support the provisions specified in clause 5.2.3 of Financial-grade API - Part 1: Read-Only API Security Profile.

In addition, the public client for write operations

1. shall support [OAUTB] or [MTLS] as a holder of key mechanism; Note: [MTLS] shall be used with instance-specific keys and (self-signed) certificates to bind access tokens to the particular instance of a public client. It is NOT used as client authentication mechanisms.
1. shall include the `request` or `request_uri` parameter as defined in Section 6 of [OIDC] in the authentication request;
1. shall request user authentication at LoA 3 or greater by requesting the `acr` claim as an essential claim as defined in section 5.5.1.1 of [OIDC];
1. shall require JWS signed ID Token be returned from endpoints;
1. shall verify that the `acr` claim in an ID Token indicates that user authentication was performed at LoA3 or greater;
1. shall verify that the `amr` claim in an ID Token contains values appropriate for the LoA indicated by the `acr` claim;
1. shall verify that the authorization response was not tampered using ID Token as the detached signature
1. shall send all parameters inside the authorization request's signed request object
1. shall additionally send duplicates of the parameters/values using the OAuth 2.0 request syntax where required by the OAuth specification

To verify that the authorization response was not tampered using ID Token as the detached signature, the client shall verify that `s_hash` value
is equal to the value calculated from the `state` value in the authorization response in addition to
all the requirements in 3.3.2.12 of [OIDC].

#### 5.2.4 Confidential client

In addition to the provisions for the public client in clause 5.2.3 of this document, except for [RFC7636] support, the confidential client for write operations

1. shall support [OAUTB] or [MTLS] as a holder of key mechanism (this overrides clause 5.2.3.1); Note: In case of confidential clients, [MTLS] can also be used as client authentication mechanism. 
1. should require both JWS signed and JWE encrypted ID Tokens to be returned from endpoints to protect any sensitive personally identifiable information (PII) contained in the ID Token provided as a detached signature in the authorization response

#### 5.2.5 JWT Secured Authorization Response Mode

In addition to the provisions given in section 5.2.2, an authorization server may protect authorization responses to clients using the "JWT Secured Authorization Response Mode" [JARM].

The [JARM] allows a client to request that an authorization server encode the authorization response (of any response type) in a JWT. It is an alternative  to utilizing ID Tokens as detached signatures for providing financial-grade security on authorization responses.

The authorization server should advertise support for the [JARM] response modes using the `response_modes_supported` metadata parameter.

If [JARM] is used to secure the authorization responses, the clauses 2, 3, and 4 of section 5.2.2. do not apply. For example, clients may use [JARM] in conjunction with the response type `code`.

## 6. Accessing protected resources (using tokens)

### 6.1 Introduction

The FAPI endpoints are OAuth 2.0 protected resource endpoints that return protected information for the resource owner associated with the submitted access token.

### 6.2 Read and write access provisions

#### 6.2.1 Protected resources provisions

The protected resources supporting this document

1. shall support the provisions specified in clause 6.2.1 Financial-grade API - Part 1: Read Only API Security Profile;
1. shall adhere to the requirements in [MTLS] or [OAUTB].

#### 6.2.2 Client provisions

The client supporting this document shall support the provisions specified in clause 6.2.2 of Financial-grade API - Part 1: Read-Only API Security Profile.

## 7. Request object endpoint

### 7.1 Introduction

The client may not want to send the request object by value, either because it
is too large, or because it contains sensitive data and the client does not want
to encrypt the request object. In such cases it is possible to send the request
object by reference using a `request_uri`. 

Note that `request_uri` can be either URL or URN. 

Although the request URI could be hosted by the client, within the FAPI spec it is
hosted by the authorization server.
The advantage of the authorization server hosting the request object is that
it does not have to support outbound requests to a client specified request URI 
nor rely on the entropy of the URI for the confidentiality of the request object. 

When the request object is stored at the authorization server, the `request_uri` value typically is a URN. 

This section defines the methods for the authorization server's request object endpoint to exchange a request object for a request URI.

### 7.2 Request

1. The request object endpoint shall be a RESTful API at the authorization server that accepts a signed request object as an HTTPS POST payload.
1. The request object shall be signed for client authentication and as evidence of the client submitting the request object, which is referred to as 'non-repudiation'.

The following is an example of such a request:

```
POST https://as.example.com/ros/ HTTP/1.1
Host: as.example.com
Content-Type: application/jws
Content-Length: 1288

eyJhbGciOiJSUzI1NiIsImtpZCI6ImsyYmRjIn0.ew0KICJpc3MiOiA
(... abbreviated for brevity ...)
zCYIb_NMXvtTIVc1jpspnTSD7xMbpL-2QgwUsAlMGzw
```

### 7.3 Successful response

1. The authorization server shall verify that the request object is valid, the signature algorithm is not `none`, and the signature is correct as in clause 6.3 of [OIDC].
1. If the verification is successful, the server shall generate a request URI and
return a JSON payload that contains `request_uri`, `aud`, `iss`, and `exp`
claims at the top level with `201 Created` HTTP response code.
1. The `request_uri` shall be based on a cryptographic random value so that it is difficult to predict for an attacker.
1. The request URI shall be bound to the client identifier of the client that posted the request object.
1. Since the request URI can be replayed, its lifetime should be short and preferably limited to one-time use.
1. The value of these claims in the JSON payload shall be as follows:
    * `request_uri` : The request URI corresponding to the request object posted. 
    * `aud` : A JSON string that represents the client identifier of the client that posted the request object.
    * `iss` : A JSON string that represents the issuer identifier of the authorization server as defined in [RFC7519]. When a pure OAuth 2.0 is used, the value is the redirection URI. When OpenID Connect is used, the value is the issuer value of the authorization server.
    * `exp` : A JSON number that represents the expiry time of the request URI as defined in [RFC7519].

The following is an example of such a response:

```
HTTP/1.1 201 Created
Date: Tue, 2 May 2017 15:22:31 GMT
Content-Type: application/json

{
    "iss": "https://as.example.com/",
    "aud": "s6BhdRkqt3",
    "request_uri": "urn:example:MTAyODAK",
    "exp": 1493738581
}
```


### 7.4 Error responses

#### 7.4.1 Authorization required
If the signature validation fails, the authorization server shall return `401 Unauthorized` HTTP error response.

#### 7.4.2 Invalid request
If the request object received is invalid, the authorization server shall return `400 Bad Request` HTTP error response.

#### 7.4.3 Method not allowed
If the request did not use POST, the authorization server shall return `405 Method Not Allowed` HTTP error response.

#### 7.4.4 Request entity too large
If the request size was beyond the upper bound that the authorization server allows, the authorization server shall return a `413 Request Entity Too Large` HTTP error response.

#### 7.4.5 Too many requests
If the request from the client per a time period goes beyond the number the authorization server allows, the authorization server shall return a `429 Too Many Requests` HTTP error response.

### 7.5 OpenID Provider Discovery Metadata

If the authorization server has a request object endpoint and supports [OIDD], it shall include the following OpenID Provider Metadata parameter in discovery responses:

1. `request_object_endpoint` : The url of the request object endpoint at which the client can exchange a request object for a request URI.

## 8. Security considerations

### 8.1 Introduction
As a profile of the OAuth 2.0 Authorization Framework, this specification references the security considerations defined in section 10 of [RFC6749], as well as [RFC6819] - OAuth 2.0 Threat Model and Security Considerations, which details various threats and mitigations.

### 8.2 Uncertainty of resource server handling of access tokens
There is no way that the client can find out whether the resource access was granted for the bearer token or holder of key token.
The two differ in the risk profile and the client may want to differentiate them.
The protected resources that conforms to this document shall not accept a plain bearer token.
They shall only support token bound access tokens via [MTLS] or [OAUTB]. 

### 8.3 Attacks using weak binding of authorization server endpoints

#### 8.3.1 Introduction

In [RFC6749] and [RFC6750], the endpoints that the authorization server offers are not tightly bound together. 
There is no notion of authorization server identifier (issuer identifier) and it is not indicated in 
the authorization response unless the client uses different redirection URI per authorization server. 
While it is assumed in the OAuth model, it is not explicitly spelled out and thus many clients 
use the same redirection URI for different authorization servers exposing an attack surface. 
Several attacks have been identified and the threats are explained in detail in [RFC6819].

#### 8.3.2 Client credential and authorization code phishing at token endpoint

In this attack, the client developer is social engineered into believing that the token endpoint has changed to the URL that is controlled by the attacker. 
As the result, the client sends the `code` and the client secret to the attacker, which will be replayed subsequently. 

When the FAPI client uses [MTLS] or [OAUTB], the authorization code is bound to the TLS channel, any phished client credentials and authorization codes submitted to the token endpoint cannot be used since the authorization code is bound to a particular TLS channel.

#### 8.3.3 Identity provider (IdP) mix-up attack
In this attack, the client has registered multiple IdPs and one of them is a rogue IdP that returns the same `client_id` 
that belongs to one of the honest IdPs. When a user clicks on a malicious link or visits a compromised site, 
an authorization request is sent to the rogue IdP. 
The rogue IdP then redirects the client to the honest IdP that has the same `client_id`. 
If the user is already logged on at the honest IdP, 
then the authentication may be skipped and a code is generated and returned to the client. 
Since the client was interacting with the rogue IdP, the code is sent to the rogue IdP's token endpoint. 
At the point, the attacker has a valid code that can be exchanged for an access token at the honest IdP.

This is mitigated by the use of OpenID Connect Hybrid Flow in which the honest IdP's issuer identifier is included as the value of `iss`. 
The client then sends the `code` to the token endpoint that is associated with the issuer identifier thus it will not get to the attacker. 

#### 8.3.4 Request object endpoint phishing resistance
An attacker can use social engineering to have the administrator of the client set 
the request object endpoint to a URL under the attacker's control. In this case, 
sensitive information included in the request object will be revealed to the attacker. 
To prevent this, the authorization server should communicate to the client developer 
the proper change process repeatedly to help client developers to be less susceptible to such social engineering.

#### 8.3.5 Access token phishing
When the FAPI client uses [MTLS] or [OAUTB], the access token is bound to the TLS channel, it is access token phishing resistant as the phished access tokens cannot be used.


### 8.4 Attacks that modify authorization requests and responses

#### 8.4.1 Introduction
In [RFC6749] the authorization request and responses are not integrity protected. 
Thus, an attacker can modify them. 

#### 8.4.2 Authorization request parameter injection attack

In [RFC6749], the authorization request is sent as query parameter. 
Although [RFC6749] mandates the use of TLS, the TLS is terminated in the browser and thus not protected within the browser; as a result an attacker can tamper the authorization request and insert any parameter values.

The use of a `request` object or `request_uri` in the authorization request will prevent tampering with the request parameters. 

The IdP confusion attack reported in [SoK: Single Sign-On Security – An Evaluation of OpenID Connect](https://www.nds.rub.de/media/ei/veroeffentlichungen/2017/01/30/oidc-security.pdf) is an example of this kind of attack.

#### 8.4.3 Authorization response parameter injection attack
This attack occurs when the victim and attacker use the same relying party client. The attacker is somehow able to
capture the authorization code and state from the victim's authorization response and uses them in his own
authorization response. 

This can be mitigated by using OpenID Connect Hybrid Flow where the `c_hash`, `at_hash`,
and `s_hash` can be used to verify the validity of the authorization code, access token,
and state parameters. The server can verify that the state is the same as what was stored in the browser session at the time of the authorization request.

### 8.5 TLS considerations
As confidential information is being exchanged, all interactions shall be encrypted with TLS (HTTPS).

Section 7.1 of Financial-grade API - Part 1: Read Only API Security Profile shall apply, with the following additional requirements:

1. Only the following 4 cipher suites shall be permitted:
    * `TLS_DHE_RSA_WITH_AES_128_GCM_SHA256`
    * `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
    * `TLS_DHE_RSA_WITH_AES_256_GCM_SHA384`
    * `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
1. For the `authorization_endpoint`, the authorisation server MAY allow additional cipher suites that are permitted by the latest version of [BCP195], if necessary to allow sufficient interoperability with users' web browsers.

### 8.6 JWS algorithm considerations

Both clients and authorisation servers:

1. shall use `PS256` or `ES256` algorithms;
1. should not use algorithms that use RSASSA-PKCS1-v1_5 (e.g. `RS256`);
1. shall not use `none`;

## 9. Privacy considerations

* If the client is to be used by a single user, the client certificate will provide the means for the websites
  that belong to different administrative domains to collude and correlate the user's access.
  For this reason, public clients that reside on a user's terminal should avoid [MTLS] and use [OAUTB] instead.
* When claims related to the subject are returned in the ID Token in the front channel, 
  implementations should consider encrypting the ID Token to lower the risk of personal information disclosure. 


## 10. Acknowledgement

The following people contributed to this document:

* Nat Sakimura (Nomura Research Institute) -- Chair, Editor
* Anoop Saxana (Intuit) -- Co-chair, FS-ISAC Liaison
* Anthony Nadalin (Microsoft) -- Co-chair, SC 27 Liaison
* Edmund Jay (Illumila) -- Co-editor
* Dave Tonge (Moneyhub) -- Co-chair, UK Implementation Entity Liaison
* Paul A. Grassi (NIST) -- X9 Liaison
* Joseph Heenan (Authlete)
* Sascha H. Preibisch (CA)
* John Bradley (Yubico)
* Henrik Biering (Peercraft)
* Tom Jones (Independent) 
* Axel Nennker (Deutsche Telekom)
* Torsten Lodderstedt (YES)
* Ralph Bragg (Raidiam)
* Brian Campbell (Ping Identity) 

## 11. Bibliography

* [RFC7662] OAuth 2.0 Token Introspection
* [DDA] Durable Data API, (2015), FS-ISAC
* [SoK] Mainka, C., Mladenov, V., Schwenk, J., and T. Wich: SoK: Single Sign-On Security – An Evaluation of OpenID Connect

# Financial-grade API - Part 1: Baseline Security Profile

## Warning

This document is not an OIDF International Standard. It is distributed for review and comment. It is subject to change without notice and may not be referred to as an International Standard.

Recipients of this draft are invited to submit, with their comments, notification of any relevant patent rights of which they are aware and to provide supporting documentation.

## Copyright notice & license
The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.



##Foreword

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised by over 160 participating entities (workgroup participants). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established has the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

Financial-grade API consists of the following parts:

* Part 1: Baseline Security Profile
* Part 2: Advanced Security Profile
* Financial-grade API: Client Initiated Backchannel Authentication Profile
* Financial-grade API: JWT Secured Authorization Response Mode for OAuth 2.0 (JARM)
* Financial-grade API: Implementation and Deployment Advice

Future parts may follow.

These parts are intended to be used with [RFC6749], [RFC6750], [RFC7636], and [OIDC].

## Introduction

Fintech is an area of future economic growth around the world and Fintech organizations need to improve the security of their operations and protect customer data. It is common practice of aggregation services to use screen scraping as a method to capture data by storing users' passwords. This brittle, inefficient, and insecure practice creates security vulnerabilities which require financial institutions to allow what appears to be an automated attack against their applications and to maintain a whitelist of aggregators. A new draft standard, proposed by this workgroup would instead utilize an API model with structured data and a token model, such as OAuth [RFC6749, RFC6750].

The Financial-grade API aims to provide specific implementation guidelines for online financial services to adopt by developing a REST/JSON data model protected by a highly secured OAuth profile. The Financial-grade API security profile can be applied to online services in any market area that requires a higher level of security than provided by standard OAuth or OpenID Connect.

This document is Part 1 of FAPI that specifies the Financial-grade API and it provides a profile of OAuth that is suitable to be used in the access of read-only financial data and similar use cases.
A higher level of security profile is provided in Part 2, suitable for read and write financial access APIs and other similar situations where the risk is higher.

Although it is possible to code an OpenID Provider and Relying Party from first principles using this specification, the main audience for this specification is parties who already have a certified implementation of OpenID Connect and want to achieve a higher level of security. Implementers are encouraged to understand the security considerations contained in section 7.6 before embarking on a 'from scratch' implementation.

### Notational Conventions

The key words "shall", "shall not", 
"should", "should not", "may", and
"can" in this document are to be interpreted as described in 
ISO Directive Part 2 [ISODIR2].
These key words are not used as dictionary terms such that 
any occurrence of them shall be interpreted as key words
and are not to be interpreted with their natural language meanings. 

#**Financial-grade API - Part 1: Baseline Security Profile **

[TOC]

## 1. Scope

This document specifies the method for an application to:

* obtain OAuth tokens in a secure manner for read-only access to protected data;
* use OpenID Connect (OIDC) to identify the customer (user); and 
* use tokens to read protected data from REST endpoints.

## 2. Normative references
The following referenced documents are indispensable for the application of this document. For dated references, only the edition cited applied. For undated references, the latest edition of the referenced document (including any amendments) applies.

[ISODIR2] - ISO/IEC Directives Part 2
[ISODIR2]: https://www.iso.org/sites/directives/current/part2/index.xhtml

[RFC4122] A Universally Unique IDentifier (UUID) URN Namespace
[RFC4122]: https://tools.ietf.org/html/rfc4122

[RFC6749] - The OAuth 2.0 Authorization Framework
[RFC6749]: https://tools.ietf.org/html/rfc6749

[RFC6750] - The OAuth 2.0 Authorization Framework: Bearer Token Usage
[RFC6750]: https://tools.ietf.org/html/rfc6750

[RFC7636] - Proof Key for Code Exchange by OAuth Public Clients
[RFC7636]: https://tools.ietf.org/html/rfc7636

[RFC6125] - Representation and Verification of Domain-Based Application Service Identity within Internet Public Key Infrastructure Using X.509 (PKIX) Certificates in the Context of Transport Layer Security (TLS)
[RFC6125]: https://tools.ietf.org/html/rfc6125

[BCP212] - OAuth 2.0 for Native Apps
[BCP212]: https://tools.ietf.org/html/bcp212

[RFC6819] - OAuth 2.0 Threat Model and Security Considerations
[RFC6819]: https://tools.ietf.org/html/rfc6819

[BCP195] - Recommendations for Secure Use of Transport Layer Security (TLS) and Datagram Transport Layer Security (DTLS)
[BCP195]: https://tools.ietf.org/html/bcp195

[OIDC] - OpenID Connect Core 1.0 incorporating errata set 1
[OIDC]: https://openid.net/specs/openid-connect-core-1_0.html

[X.1254] - Entity authentication assurance framework
[X.1254]: https://www.itu.int/rec/T-REC-X.1254

[MTLS] - OAuth 2.0 Mutual TLS Client Authentication and Certificate Bound Access Tokens
[MTLS]: https://tools.ietf.org/html/rfc8705

[RFC8414] - OAuth 2.0 Authorization Server Metadata
[RFC8414]: https://tools.ietf.org/html/rfc8414

[OIDD] -  OpenID Connect Discovery 1.0 incorporating errata set 1
[OIDD]: http://openid.net/specs/openid-connect-discovery-1_0.html

## 3. Terms and definitions
For the purpose of this document, the terms defined in [RFC6749], [RFC6750], [RFC7636], [OpenID Connect Core][OIDC] apply.


## 4. Symbols and abbreviated terms

**API** – Application Programming Interface

**CSRF** - Cross Site Request Forgery

**FAPI** - Financial-grade API

**HTTP** – Hyper Text Transfer Protocol

**REST** – Representational State Transfer

**TLS** – Transport Layer Security

## 5. Baseline security profile

### 5.1 Introduction

The OIDF Financial-grade API (FAPI) is a REST API that provides JSON data. These APIs are protected by the OAuth 2.0 Authorization Framework that consists of [RFC6749], [RFC6750], [RFC7636], and other specifications.

Read-only access is generally viewed to pose a lower risk than the write access and as such, the characteristics required of the tokens are different and the methods to obtain tokens are explained separately.

### 5.2 Baseline security provisions

#### 5.2.1 Introduction

Read-only access is a lower risk scenario compared to the write access; therefore the protection level can also be lower.
However, since the FAPI can provide potentially sensitive information, it requires more protection level than a basic [RFC6749] requires.

As a profile of the OAuth 2.0 Authorization Framework, this document mandates the following to the baseline profile of the FAPI.

#### 5.2.2 Authorization server

The authorization server

1. shall support confidential clients;
1. should support public clients; 
1. shall provide a client secret that adheres to the requirements in section 16.19 of [OIDC] if a symmetric key is used;
1. shall authenticate the confidential client using one of the following methods:
    1. Mutual TLS for OAuth Client Authentication as specified in section 2 of [MTLS];
    2. `client_secret_jwt` or `private_key_jwt` as specified in section 9 of [OIDC];
1. shall require and use a key of size 2048 bits or larger for RSA algorithms;
1. shall require and use a key of size 160 bits or larger for elliptic curve algorithms;
1. shall require [RFC7636] with `S256` as the code challenge method;
1. shall require redirect URIs to be pre-registered;
1. shall require the `redirect_uri` parameter in the authorization request;
1. shall require the value of `redirect_uri` to exactly match one of the pre-registered redirect URIs;
1. shall require user authentication to an appropriate Level of Assurance for the operations the client will be authorized to perform on behalf of the user;
1. shall require explicit approval by the user to authorize the requested scope if it has not been previously authorized;
1. shall reject an authorization code (section 1.3.1 of [RFC6749]) if it has been previously used;
1. shall return token responses that conform to section 4.1.4 of [RFC6749]; 
1. shall return the list of granted scopes with the issued access token if the request was passed in the front channel and was not integrity protected;
1. shall provide opaque non-guessable access tokens, authorization codes, and refresh token 
(where applicable), with sufficient entropy such that the probability of an attacker guessing 
the generated token is computationally infeasible as per [RFC6749] section 10.10;
1. should clearly identify the details of the grant to the user during authorization as in 16.18 of [OIDC]; and 
1. should provide a mechanism for the end-user to revoke access tokens and refresh tokens granted to a client as in 16.18 of [OIDC].
1. shall return an invalid_client error as defined in 5.2 of [RFC6749] when mis-matched client identifiers were provided through the client authentication methods that permits sending the client identifier in more than one way;
1. shall require redirect URIs to use the https scheme;
1. should issue access tokens with a lifetime of under 10 minutes unless the tokens are sender-constrained;
1. shall support [OIDD] and may support [RFC8414];
1. shall only distribute discovery metadata (such as the authorization endpoint) via the metadata document as specified in [OIDD] and [RFC8414].

    **NOTE**: The use of refresh tokens instead of long-lived access tokens for both 
    public and confidential clients is recommended.

    **NOTE**: The Financial-grade API server may limit the scopes for the purpose of not implementing certain APIs.

    **NOTE**: The opaqueness requirement for the access token does not preclude the server to create a structured access token. 

    **NOTE**: The requirement to return the list of granted scopes allows clients to detect when the authorization request was modified to include different scopes. Servers must still return the granted scopes if they are different from those requested.

##### 5.2.2.1 Returning authenticated user's identifier

Further, if it is desired to provide the authenticated user's identifier to the client in the token response, the authorization server:

1. shall support the authentication request as in Section 3.1.2.1 of [OIDC];
1. shall perform the authentication request verification as in Section 3.1.2.2 of [OIDC];
1. shall authenticate the user as in Section 3.1.2.2 and 3.1.2.3 of [OIDC];
1. shall provide the authentication response as in Section 3.1.2.4 and 3.1.2.5 of [OIDC] depending on the outcome of the authentication;
1. shall perform the token request verification as in Section 3.1.3.2 of [OIDC]; and
1. shall issue an ID Token in the token response when `openid` was included in the requested `scope`
   as in Section 3.1.3.3 of [OIDC] with its `sub` value corresponding to the authenticated user
   and optional `acr` value in ID Token.

##### 5.2.2.2 Client requesting openid scope

If the client requests the openid scope, the authorization server

1. shall require the `nonce` parameter defined in Section 3.1.2.1 of [OIDC] in the authentication request.

##### 5.2.2.3 Clients not requesting openid scope

If the client does not requests the openid scope, the authorization server

1. shall require the `state` parameter defined in section 4.1.1 of [RFC6749].

#### 5.2.3 Public client

A public client

1. shall support [RFC7636];
1. shall use `S256` as the code challenge method for the [RFC7636];
1. shall use separate and distinct redirect URI for each authorization server that it talks to;
1. shall store the redirect URI value in the resource owner's user-agents (such as browser) session and compare it with the redirect URI that the authorization response was received at, where, if the URIs do not match, the client shall terminate the process with error;
1. (withdrawn);
1. shall implement an effective CSRF protection.

    Further, if it is desired to obtain a persistent identifier of the authenticated user, then it

1. shall include `openid` in the `scope` value; and
1. shall include the `nonce` parameter defined in Section 3.1.2.1 of [OIDC] in the authentication request.

    If `openid` is not in the `scope` value, then it
1. shall include the `state` parameter defined in section 4.1.1 of [RFC6749];
1. shall verify that the `scope` received in the token response is either an exact match,
or contains a subset of the `scope` sent in the authorization request;
1. shall only use Authorization Server metadata obtained from the metadata document published by the Authorization Server at its well known endpoint as defined in [OIDD] or [RFC8414].  

    **NOTE**: Adherence to [RFC7636] means that the token request includes `code_verifier` parameter in the request.


#### 5.2.4 Confidential client

In addition to the provisions for a public client, a confidential client

1. shall support the following methods to authenticate against the token endpoint:
    1. Mutual TLS for OAuth Client Authentication as specified in section 2 of [MTLS];
    2. `client_secret_jwt` or `private_key_jwt` as specified in section 9 of [OIDC];
1. shall use RSA keys with a minimum 2048 bits if using RSA cryptography; 
1. shall use elliptic curve keys with a minimum of 160 bits if using Elliptic Curve cryptography; and
1. shall verify that its client secret has a minimum of 128 bits if using symmetric key cryptography.


## 6. Accessing Protected Resources

### 6.1 Introduction

The FAPI endpoints are OAuth 2.0 protected resource endpoints that return protected information for the resource owner associated with the submitted access token.

### 6.2 Baseline access provisions

#### 6.2.1 Protected resources provisions

The resource server with the FAPI endpoints

1. shall support the use of the HTTP GET method as in Section 4.3.1 of [RFC7231];
1. shall accept access tokens in the HTTP header as in Section 2.1 of OAuth 2.0 Bearer Token Usage [RFC6750];
1. shall not accept access tokens in the query parameters stated in Section 2.3 of OAuth 2.0 Bearer Token Usage [RFC6750];
1. shall verify that the access token is neither expired nor revoked;
1. shall verify that the scope associated with the access token authorizes the reading of the resource it is representing;
1. shall identify the associated entity to the access token;
1. shall only return the resource identified by the combination of the entity implicit in the access and the granted scope and otherwise return errors as in section 3.1 of [RFC6750];
1. shall encode the response in UTF-8 if applicable; 
1. shall send the `Content-type` HTTP header `Content-Type: application/json` if applicable;
1. shall send the server date in HTTP Date header as in section 7.1.1.2 of [RFC7231];
1. shall set the response header `x-fapi-interaction-id` to the value received from the corresponding fapi client request header or to a [RFC4122] UUID value if the request header was not provided to track the interaction, e.g., `x-fapi-interaction-id: c770aef3-6784-41f7-8e0e-ff5f97bddb3a`; and
1. shall log the value of `x-fapi-interaction-id` in the log entry;
1. shall not reject requests with a `x-fapi-customer-ip-address` header containing a
valid IPv4 or IPv6 address.


    **NOTE**: While this document does not specify the exact method to obtain the entity associated with the
    access token and the granted scope, the protected resource can use OAuth Token Introspection [RFC7662].

    Further, it

1. should support the use of Cross Origin Resource Sharing (CORS) [CORS] and or other methods as appropriate to enable JavaScript clients to access the endpoint if it decides to provide access to JavaScript clients.

    **NOTE**: Providing access to JavaScript clients has other security implications. Before supporting those clients [RFC6819] should be consulted.

#### 6.2.2 Client provisions

The client supporting this document

1. shall send access tokens in the HTTP header as in Section 2.1 of OAuth 2.0 Bearer Token Usage [RFC6750]; and 
1. (withdrawn);

    Further, the client

1. may send the last time the customer logged into the client in the `x-fapi-auth-date` header where the value is supplied as a HTTP-date as in section 7.1.1.1 of [RFC7231], e.g., `x-fapi-auth-date: Tue, 11 Sep 2012 19:43:31 GMT`; and
1. may send the customer’s IP address if this data is available in the `x-fapi-customer-ip-address` header, e.g., `x-fapi-customer-ip-address: 2001:DB8::1893:25c8:1946` or  `x-fapi-customer-ip-address: 198.51.100.119`; and
1. may send the `x-fapi-interaction-id` request header, in which case the value shall be a 
RFC4122 UUID to the server to help correlate log entries between client and server, 
e.g., `x-fapi-interaction-id: c770aef3-6784-41f7-8e0e-ff5f97bddb3a`.


## 7. Security considerations

### 7.1 TLS and DNSSEC considerations

As confidential information is being exchanged, all interactions shall be encrypted with TLS (HTTPS).

The recommendations for Secure Use of Transport Layer Security in [BCP195] shall be followed, with the following additional requirements:

1. TLS version 1.2 or later shall be used for all communications.
1. A TLS server certificate check shall be performed, as per [RFC6125].

Endpoints for the use by web browsers should use mechanisms to ensure that connections cannot be downgraded using TLS Stripping attacks. A preloaded [preload] HTTP Strict Transport Security policy [RFC6797] can be used for this purpose. Some top-level domains, like `.bank` and `.insurance`, have set such a policy and therefore protect all second-level domains below them.

For a comprehensive protection against network attackers, all
endpoints should additionally use DNSSEC to protect against DNS
spoofing attacks that can lead to the issuance of rogue
domain-validated TLS certificates. Note: Even if an endpoint uses only
organization validated (OV) or extended validation (EV) TLS
certificates, rogue domain-validated certificates can be used to
impersonate the endpoints and conduct man-in-the-middle attacks.

### 7.2 Message source authentication failure

Authorization request and response are not authenticated. 
For higher risk scenarios, they should be authenticated.
See Part 2, which uses request objects to achieve the message source authentication. 

### 7.3 Message integrity protection failure

The authorization request does not have message integrity protection and hence
request tampering and parameter injection are possible.
Where such protection is desired, Part 2 should be used.

The response is integrity protected when the ID Token is returned
from the authorization endpoint. 

### 7.4 Message containment failure

#### 7.4.1 Authorization request and response

In this document, the authorization request is not encrypted. 
Thus, it is possible to leak the information contained 
if the web browser is compromised. 

Authorization response can be encrypted as ID Token 
can be encrypted. 

It is possible to leak the information through the logs 
if the parameters were recorded in the logs and 
the access to the logs are compromised. 
Strict access control to the logs in such cases should be 
enforced. 

#### 7.4.2 Token request and response

It is possible to leak information through the logs 
if the parameters were recorded in the logs and 
the access to the logs are compromised. 
Strict access control to the logs in such cases should be 
enforced. 

#### 7.4.3 Resource request and response

Care should be taken so that the sensitive data will not be leaked 
through the referrer. 

If the access token is a bearer token, it is possible to 
exercise the stolen token. Since the access token can be 
used against multiple URIs, the risk of leaking is
much larger than the refresh token, which is used only 
against the token endpoint. Thus, the lifetime of 
the access token should be much shorter than that of 
the refresh token. Refer to section 16.18 of [OIDC] for 
more discussion on the lifetimes of access tokens and 
refresh tokens. 

### 7.5 Native Apps

When native apps are used as either public clients, dynamically registered confidential clients or user-agents receiving the authorization response for a server based confidential client, the recommendations for OAuth 2.0 for Native Apps in [BCP212] shall be followed, with the following additional requirements:

When registering redirect URIs, authorization servers

1. shall not support "Private-Use URI Scheme Redirection";
1. shall not support "Loopback Interface Redirection";

These requirements mean that FAPI compliant implementations can only
support native apps through the use of "Claimed https Scheme URI Redirection".

Note: nothing in this document seeks to disallow fixed urls in the
form https://localhost:port-number/callback, as these are particularly
useful in non-production systems or in clients used in development, to
facilitate faster and easier development.

### 7.6 Incomplete or incorrect implementations of the specifications

To achieve the full security benefits, it is important the implementation of this specification, and the underlying OpenID Connect and OAuth specifications, are both complete and correct.

The OpenID Foundation provides tools that can be used to confirm that an implementation is correct:

https://openid.net/certification/

The OpenID Foundation maintains a list of certified implementations:

https://openid.net/developers/certified/

Deployments that use this specification should use a certified implementation.

### 7.7 Discovery & Multiple Brands

Organisations who need to support multiple "brands" with individual authorization endpoints 
from a single Authorization Server deployment shall use a separate `issuer` per brand.
This can be achieved either at the domain level (e.g. `https://brand-a.auth.example.com` 
and  `https://brand-b.auth.example.com`) or with different paths (e.g. `https://auth.example.com/brand-a` and `https://auth.example.com/brand-b`)

As stated in 5.2.10 Clients shall only use metadata values obtained via metadata documents
as defined in [OIDD]. Communicating metadata through other means (e.g. via email), opens 
up a social engineering attack vector.

Note that the requirement to use [OIDD] is not a requirement to support Dynamic Client 
Registration. 

## 8. Privacy considerations

    ** NOTE ** The following only has a boilerplate text 
    specifying the general principles. More specific text 
    will be added towards the Final specification. 

### 8.1 Privacy by design

1. Privacy impact analysis (PIA) should be performed in the initial phase of the system planning.
1. Use of ISO/IEC 29134:2017 Guidelines for privacy impact analysis is recommended.
1. The provider should establish a management system to help respect privacy of customers.

### 8.2 Adhering to privacy principles

Stakeholders should follow the privacy principles of ISO/IEC 29100. In particular:

1. Consent and choice
2. Purpose legitimacy and specification
3. Collection limitation
4. Data (access) limitation
5. Use, retention, and data disclosure limitation:
    1. Use limitation:
    1. Retention limitation: Where the data is no longer being used, clients should delete such data from their system within 180 days except for the cases where it needs to be retained due to legal restrictions;
    1. Data disclosure limitation:
6. Accuracy and quality
7. Openness, transparency and notice
8. Individual participation and access
9. Accountability
10. Information security
11. Privacy compliance


## 9. Acknowledgement

The following people contributed to this document:

* Nat Sakimura (Nomura Research Institute) -- Chair, Editor
* Anoop Saxana (Intuit) -- Co-chair, FS-ISAC Liaison
* Anthony Nadalin (Microsoft) -- Co-chair
* Edmund Jay (Illumila) -- Co-editor
* Dave Tonge (Moneyhub) -- Co-chair, UK Implementation Entity Liaison
* Sascha H. Preibisch (CA) 
* Henrik Biering (Peercraft)
* Anton Taborszky (Deutsche Telecom) 
* John Bradley (Yubico) 
* Axel Nennker (Deutsche Telekom)
* Joseph Heenan (Authlete)
* Daniel Fett (yes.com)


## 10. Bibliography

* [ISODIR2] ISO/IEC Directives Part 2
* [RFC4122] A Universally Unique IDentifier (UUID) URN Namespace
* [RFC6749] The OAuth 2.0 Authorization Framework
* [RFC6750] The OAuth 2.0 Authorization Framework: Bearer Token Usage
* [RFC6797] HTTP Strict Transport Security (HSTS)
* [RFC7636] Proof Key for Code Exchange by OAuth Public Clients
* [RFC7662] OAuth 2.0 Token Introspection
* [RFC6125] Representation and Verification of Domain-Based Application Service Identity within Internet Public Key Infrastructure Using X.509 (PKIX) Certificates in the Context of Transport Layer Security (TLS)
* [BCP212] OAuth 2.0 for Native Apps
* [RFC6819] OAuth 2.0 Threat Model and Security Considerations
* [RFC8414] OAuth 2.0 Authorization Server Metadata
* [OIDD] OpenID Connect Discovery 1.0 incorporating errata set 1
* [BCP195] Recommendations for Secure Use of Transport Layer Security (TLS) and Datagram Transport Layer Security (DTLS)
* [OIDC] OpenID Connect Core 1.0 incorporating errata set 1
* [X.1254] Entity authentication assurance framework
* [MTLS] OAuth 2.0 Mutual TLS Client Authentication and Certificate Bound Access Tokens
* [ISO29100] ISO/IEC 29100 Information technology -- Security techniques -- Privacy framework <http://standards.iso.org/ittf/PubliclyAvailableStandards/c045123_ISO_IEC_29100_2011.zip>
* [ISO29134] ISO/IEC 29134 Information technology -- Security techniques -- Privacy impact assessment -- Guidelines
* [preload] HSTS Preload List Submission <https://hstspreload.org/>

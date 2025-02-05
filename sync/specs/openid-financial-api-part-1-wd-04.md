#Financial Services – Financial API - Part 1: Read-Only API Security Profile

## Warning

This document is not an OIDF International Standard. It is distributed for review and comment. It is subject to change without notice and may not be referred to as an International Standard.

Recipients of this draft are invited to submit, with their comments, notification of any relevant patent rights of which they are aware and to provide supporting documentation.

## Copyright Notice & License
The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.

##Foreword

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised by over 160 participating entities (workgroup participants). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established has the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

Financial API consists of the following parts:

* Part 1: Read-Only API Security Profile
* Part 2: Read and Write API Security Profile
* Part 3: Open Data API
* Part 4: Protected Data API and Schema - Read-Only
* Part 5: Protected Data API and Schema - Read and Write

These parts are intended to be used with [RFC6749], [RFC6750], [RFC7636], and [OIDC].

##Introduction

Fintech is an area of future economic growth around the world and Fintech organizations need to improve the security of their operations and protect customer data. For example, it is a decades-old common practice of aggregation services to use screen scraping as a method to capture data and translate it to another service, such as usernames and passwords. This practice creates security gaps which require financial institutions to allow what ppears to be an automated attack against their applications and to maintain a whitelist of aggregators. A new draft standard, proposed by this workgroup would instead utilize an API model with structured data and a token model, such as OAuth [RFC6749, RFC6750].

The Financial API aims to provide specific implementation guidelines for financial services to adopt for use cases of online banking by developing a REST/JSON data model protected by specified OAuth profile that is secure. 

This document is Part 1 of 5 that specifies the Financial API and it provides a profile of OAuth that is suitable to be used in the access of Read-Only financial data. 
A higher level of security profile suitable for Read and Write Access APIs are provided in Part 2 and Part 3/4/5 provides the data schema for specific use cases. 

### Notational Conventions

The key words "shall", "shall not", 
"should", "should not", "may", and
"can" in this document are to be interpreted as described in 
ISO Directive Part 2. 
These key words are not used as dictionary terms such that 
any occurence of them shall be interpreted as key words 
and are not to be interpreted with their natural language meanings. 

#**Financial Services – Financial API - Part 1: Read-Only API Security Profile **

[TOC]

## 1. Scope

This document specifies the method for an application to:

* Obtain OAuth tokens in a secure manner for read-only access to financial data;
* Use OpenID Connect (OIDC) to identify the customer (user); and 
* Use tokens to read financial data from REST endpoints. 

## 2. Normative References
The following referenced documents are strongly recommended to be used in conjunction with this document. For dated references, only the edition cited applies. For undated references, the latest edition of the referenced document (including any amendments) applies.

[RFC7230] -  Hypertext Transfer Protocol -- HTTP/1.1
[RFC7230]: https://tools.ietf.org/html/rfc7230

[RFC4122] A Universally Unique IDentifier (UUID) URN Namespace
[RFC4122]: https://tools.ietf.org/html/rfc4122

[RFC6749] - The OAuth 2.0 Authorization Framework
[RFC6749]: https://tools.ietf.org/html/rfc6749

[RFC6750] - The OAuth 2.0 Authorization Framework: Bearer Token Usage
[RFC6750]: https://tools.ietf.org/html/rfc6750

[RFC7636] - Proof Key for Code Exchange by OAuth Public Clients
[RFC7636]: https://tools.ietf.org/html/rfc7636

[RFC5246] - The Transport Layer Security (TLS) Protocol Version 1.2
[RFC5246]: https://tools.ietf.org/html/rfc5246

[RFC7525] - Recommendations for Secure Use of Transport Layer Security (TLS) and Datagram Transport Layer Security (DTLS)
[RFC7525]: https://tools.ietf.org/html/rfc7525

[RFC6125] - Representation and Verification of Domain-Based Application Service Identity within Internet Public Key Infrastructure Using X.509 (PKIX) Certificates in the Context of Transport Layer Security (TLS)
[RFC6125]: https://tools.ietf.org/html/rfc6125

[O2fNA] - OAuth 2.0 for Native Apps
[O2fNA]: https://tools.ietf.org/html/draft-ietf-oauth-native-apps-05

[RFC6819] - OAuth 2.0 Threat Model and Security Considerations
[RFC6819]: https://tools.ietf.org/html/rfc6819

[OIDC] - OpenID Connect Core 1.0 incorporating errata set 1
[OIDC]: https://openid.net/specs/openid-connect-core-1_0.html

[OIDD] -  OpenID Connect Discovery 1.0 incorporating errata set 1
[OIDD]: https://openid.net/specs/openid-connect-discovery-1_0.html

[OIDM] -  OAuth 2.0 Multiple Response Type Encoding Practices
[OIDM]: https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html

[X.1254] - Entity Authentication Assurance Framework
[X.1254]: https://www.itu.int/rec/T-REC-X.1254

[MTLS] - Mutual TLS Profile for OAuth 2.0
[MTLS]: https://tools.ietf.org/html/draft-ietf-oauth-mtls

## 3. Terms and Definitions
For the purpose of this document, the terms defined in [RFC6749], [RFC6750], [RFC7636], [OpenID Connect Core][OIDC] apply.


## 4. Symbols and Abbreviated Terms

**API** – Application Programming Interface

**CSRF** - Cross Site Request Forgery

**FAPI** - Financial API

**FI** – Financial Institution

**HTTP** – Hyper Text Transfer Protocol

**REST** – Representational State Transfer

**TLS** – Transport Layer Security

## 5. Read-Only API Security Profile

### 5.1 Introduction

The OIDF Financial API (FAPI) is a REST API that provides JSON data representing account and transaction related data. These APIs are protected by the OAuth 2.0 Authorization Framework that consists of [RFC6749], [RFC6750], [RFC7636], and other specifications.

Read-only access is generally viewed to pose a lower risk than the Write access and as such, the characteristics required of the tokens and method to obtain tokens are explained separately.

### 5.2 Read-Only API Security Provisions

#### 5.2.1 Introduction

Read-Only access is a lower risk scenario compared to the Write access; therefore the protection level can also be lower.
However, since the FAPI can provide potentially sensitive information, it requires more protection level than a basic [RFC6749] requires.

As a profile of the OAuth 2.0 Authorization Framework, this document mandates the following to the Read-Only API of the FAPI.

#### 5.2.2 Authorization Server

The Authorization Server

1. shall support confidential clients;
1. should support public clients; 
1. shall provide a client secret that adheres to the requirements in section 16.19 of [OIDC] if a symmetric key is used;
1. shall authenticate the confidential client at the Token Endpoint using one of the following methods:
    1. TLS mutual authentication [MTLS]; 
    2. JWS Client Assertion using the `client_secret` or a private key as specified in section 9 of [OIDC]; 
1. shall require a key of size 2048 bits or larger if RSA algorithms are used for the client authentication;
1. shall require a key of size 160 bits or larger if elliptic curve algorithms are used for the client authentication;
1. shall support [RFC7636] with `S256` as the code challenge method if it supports public clients;
1. shall require Redirect URIs to be pre-registered;
1. shall require the `redirect_uri` parameter in the authorization request;
1. shall require the value of `redirect_uri` to exactly match one of the pre-registered Redirect URIs;
1. shall require user authentication at LoA 2 as defined in [X.1254] or more;
1. shall require explicit consent by the user to authorize the requested scope if it has not been previously authorized;
1. shall verify that the Authorization Code (section 1.3.1 of [RFC6749]) has not been previously used if possible;
1. shall return token responses that conform to section 4.1.4 of [RFC6749]; 
1. shall return the list of allowed scopes with the issued access token;  
1. shall provide opaque non-guessable access tokens with a minimum of 128 bits as defined in section 5.1.4.2.2 of [RFC6819]. 
1. should clearly identify long-term grants to the user during authorization as in 16.18 of [OIDC]; and 
1. should provide a mechanism for the end-user to revoke access tokens and refresh tokens granted to a client as in 16.18 of [OIDC].

    **NOTE**: The Financial API server may limit the scopes for the purpose of not implementing certain APIs.

    **NOTE**: Section 4.1.3 of [RFC6749] does not provide guidance regarding `code reuse`, but this document provides limitation on `code reuse` in Section 3.1.3.2 of [OIDC].

    **NOTE**: If replay identification of the Authorization Code is not possible, it is desirable to set the validity period of the Authorization Code to one minute or a suitable short period of time. The validity period may act as a cache control indicator of when to clear the Authorization Code cache if one is used.

    **NOTE**: The opaqueness requirement for the access token does not preclude the server to create a structured access token. 
	
    Further, if it is desired to provide the authenticated user's identifier to the client in the token response, the authorization server:

1. shall support the authentication request as in Section 3.1.2.1 of [OIDC];
1. shall perform the authentication request verification as in Section 3.1.2.2 of [OIDC];
1. shall authenticate the user as in Section 3.1.2.2 and 3.1.2.3 of [OIDC];
1. shall provide the authentication response as in Section 3.1.2.4 and 3.1.2.5 of [OIDC] depending on the outcome of the authentication;
1. shall perform the token request verification as in Section 3.1.3.2 of [OIDC]; and
1. shall issue an ID Token in the token response when `openid` was included in the requested `scope`
   as in Section 3.1.3.3 of [OIDC] with its `sub` value corresponding to the authenticated user
   and optional `acr` value in ID Token.

#### 5.2.3 Public Client

A Public Client

1. shall support [RFC7636] or the mechanisms defined in [Financial API - Part 2](Financial_API_WD_002.md);
1. shall use `S256` as the code challenge method for the [RFC7636];
1. shall use separate and distinct Redirect URI for each Authorization Server that it talks to;
1. shall store the Redirect URI value in the resource owner's user-agents (such as browser) session and compare it with the Redirect URI that the Authorization Response was received at, where, if the URIs do not match, the Client shall terminate the process with error;
1. shall adhere to the best practice stated by [O2fNA]; and
1. shall implement an effective CSRF protection.

    Further, if it is desired to obtain a persistent identifier of the authenticated user, then it

1. shall include `openid` in the `scope` value; and
1. shall include `nonce` parameter defined in Section 3.1.2.1 of [OIDC] in the authentication request.

    **NOTE**: Adherence to [RFC7636] means that the token request includes `code_verifier` parameter in the request.


#### 5.2.4 Confidential Client

In addition to the provisions for a Public Client, except for [RFC7636] support, a Confidential Client

1. shall support the following methods to authenticate against the Token Endpoint:
    1. TLS mutual authentication [MTLS]; or 
    2. JWS Client Assertion using the `client_secret` or a private key as specified in section 9 of [OIDC]; 
1. shall use RSA keys with a minimum 2048 bits if using RSA cryptography; 
1. shall use Elliptic Curve keys with a minimum of 160 bits if using Elliptic Curve cryptography; and 
1. shall verify that its client secret has a minimum of 128 bits if using symmetric key cryptography.


## 6. Accessing Protected Resources

### 6.1 Introduction

The FAPI endpoints are OAuth 2.0 protected resource endpoints that return financial information for the resource owner associated with the submitted access token.

### 6.2 Read-Only Access Provisions

#### 6.2.1 Protected Resources Provisions

The resource server with the FAPI endpoints

1. shall mandate TLS 1.2 or later as defined in [RFC5246] with the usage following the best practice in [RFC7525];
1. shall support the use of the HTTP GET method as in Section 4.3.1 of [RFC7231];
1. shall accept access tokens in the HTTP header as in Section 2.1 of OAuth 2.0 Bearer Token Usage [RFC6750];
1. shall not accept access tokens in the query parameters stated in Section 2.3 of OAuth 2.0 Bearer Token Usage [RFC6750];
1. shall verify that the access token is neither expired nor revoked;
1. shall verify that the scope associated with the access token authorizes the reading of the resource it is representing;
1. shall identify the associated entity to the access token;
1. shall only return the resource identified by the combination of the entity implicit in the access and the granted scope and otherwise return errors as in section 3.1 of [RFC6750];
1. shall encode the response in UTF-8; 
1. shall send the `Content-type` HTTP header `Content-Type: application/json; charset=UTF-8` if applicable;
1. shall send the server date in HTTP Date header as in section 7.1.1.2 of [RFC7231];
1. shall set the response header `x-fapi-interaction-id` to the value received from the corresponding fapi client request header or to a [RFC4122] UUID value if the request header was not provided to track the interaction, e.g., `x-fapi-interaction-id: c770aef3-6784-41f7-8e0e-ff5f97bddb3a`; and
1. shall log the value of `x-fapi-interaction-id` in the log entry.


    **NOTE**: While this document does not specify the exact method to obtain the entity associated with the
    access token and the granted scope, the protected resource can use OAuth Token Introspection [RFC7662].

    Further, it

1. should support the use of Cross Origin Resource Sharing (CORS) [CORS] and or other methods as appropriate to enable JavasScript clients to access the endpoint if it decides to provide access to JavaScript clients.

    **NOTE**: Providing access to JavaScript clients has other security implications. Before supporting those clients [RFC6819] should be consulted.

#### 6.2.2 Client Provisions

The client supporting this document

1. shall use TLS 1.2 or later as defined in [RFC5246] with the usage following the best practice in [RFC7525];
1. shall send access tokens in the HTTP header as in Section 2.1 of OAuth 2.0 Bearer Token Usage [RFC6750]; and 
1. shall send `x-fapi-financial-id` whose value is the unique identifier of the desired financial institution to interact with (assigned by the resource server owner) where the same endpoints are used for multiple institutions.

    **NOTE**: Conceptually, the value of the `x-fapi-financial-id` corresponds to `iss` in the ID Token
    but is not required to be an https URI. It often is the routing number of the FI.

    Further, the client

1. may supply the last time the customer logged into the client in the `x-fapi-auth-date` header where the value is supplied as a HTTP-date as in section 7.1.1.1 of [RFC7231], e.g., `x-fapi-auth-date: Tue, 11 Sep 2012 19:43:31 GMT`; and
1. may supply the customer’s IP address if this data is available in the `x-fapi-customer-ip-address` header, e.g., `x-fapi-customer-ip-address: 198.51.100.119`; and
1. may send the `x-fapi-interaction-id` request header whose value is a [RFC4122] UUID to the server to help correlate log entries 
   between client and server, e.g., `x-fapi-interaction-id: c770aef3-6784-41f7-8e0e-ff5f97bddb3a`.





## 7. Security Considerations

### 7.1 TLS Considerations

Since potentially sensitive and confidential information is being exchanged, all interactions shall be encrypted with TLS (HTTPS) in accordance with the recommendations in [RFC7525]. TLS version 1.2 or later shall be used for all communications.

### 7.2 Message Source Authentication Failure

Authorization request and response are not authenticated. 
For higher risk scenarios, they should be authenticated.
See Part 2, which uses request object to achieve the message source authentication. 

### 7.3 Message Integrity Protection Failure

The authorization request does not have message integrity protection and hence
request tampering and parameter injection are possible.
Where such protection is desired, Part 2 should be used.

The response is integrity protected when the ID Token is returned
from the authorization endpoint. 

### 7.4 Message Containment Failure

#### 7.4.1 Authorization Request and Response

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

#### 7.4.2 Token Request and Response

It is possible to leak information through the logs 
if the parameters were recorded in the logs and 
the access to the logs are compromised. 
Strict access control to the logs in such cases should be 
enforced. 

#### 7.4.3 Resource Request and Response

Care should be taken so that the sensitive data will not be leaked 
through the referrer. 

If the access token is a bearer token, it is possible to 
exercise the stolen token. Since the access token can be 
used against multiple URIs, the risk of leaking is
much larger than the refresh token, which is used only 
against the token endpoint. Thus, the lifetime of 
the access token should be much shorter than that of 
the refresh token. Refer to section 16.18 of [OIDC] for 
more discussion on the lifetimes of access and refresh tokens. 

## 8. Privacy Considerations

    ** NOTE ** The following only has a boiler plate text 
    specifying the general principles. More specific text 
    will be added towards the Final specification. 

### 8.1 Privacy By Design

1. Privacy Impact Analysis (PIA) should be performed in the initial phase of the system planning.
1. Use of ISO/IEC 29134 Privacy Impact Analysis - Guidelines is recommended.
1. The provider should establish a management system to help respect privacy of customers.

### 8.2 Adhering to Privacy Principles

Stakeholders should follow the privacy principles of ISO/IEC 29100. In particular:

1. Consent and Choice
2. Purpose Legitimacy and Specification
3. Collection Limitation
4. Data (access) Limitation
5. Use, Retention, and Data Disclosure Limitation:
    1. Use Limitation:
    1. Retention Limitation: Where the data is no longer being used, clients should delete such data from their system within 180 days except for the cases where it needs to be retained due to legal restrictions;
    1. Data Disclosure Limitation:
6. Accuracy and Quality
7. Openness, Transparency and Notice
8. Individual Participation and Access
9. Accountability
10. Information Security
11. Privacy Compliance


## 9. Acknowledgement

Following people contributed to this document: 

* Nat Sakimura (Nomura Research Institute) -- Chair, Editor
* Anoop Saxana (Intuit) -- Co-chair, FS-ISAC Liaison
* Anthony Nadalin (Microsoft) -- Co-chair
* Edmund Jay (Illumila) -- Co-editor
* Dave Tonge (Momentum Financial Technology) -- UK Implementation Entity Liaison
* Sascha H. Preibisch (CA) 
* Henrik Bearing (Peercraft) 
* Anton Taborszky (Deutche Telecom) 
* John Bradley (Yubico) 
* Axel Nennker (Deutsche Telekom)
* Joseph Heenan (Authlete)


## 10. Bibliography

* [OFX2.2] Open Financial Exchange 2.2
* [HTML4.01] “HTML 4.01 Specification,” World Wide Web Consortium Recommendation REC-html401-19991224, December 1999
* [RFC7230] Hypertext Transfer Protocol -- HTTP/1.1
* [RFC4122] A Universally Unique IDentifier (UUID) URN Namespace
* [RFC5246] The Transport Layer Security (TLS) Protocol Version 1.2
* [RFC6749] The OAuth 2.0 Authorization Framework
* [RFC6750] The OAuth 2.0 Authorization Framework: Bearer Token Usage
* [RFC7525] Recommendations for Secure Use of Transport Layer Security (TLS) and Datagram Transport Layer Security (DTLS)
* [RFC7636] Proof Key for Code Exchange by OAuth Public Clients
* [RFC7662] OAuth 2.0 Token Introspection
* [RFC6125] Representation and Verification of Domain-Based Application Service Identity within Internet Public Key Infrastructure Using X.509 (PKIX) Certificates in the Context of Transport Layer Security (TLS)
* [O2fNA] OAuth 2.0 for Native Apps
* [RFC6819] OAuth 2.0 Threat Model and Security Considerations
* [OIDC] OpenID Connect Core 1.0 incorporating errata set 1
* [OIDD] OpenID Connect Discovery 1.0 incorporating errata set 1
* [OIDM] OAuth 2.0 Multiple Response Type Encoding Practices
* [X.1254] - Entity authentication assurance framework
* [TLSM] - Mutual X.509 Transport Layer Security (TLS) Authentication for OAuth Clients
* [DDA] Durable Data API, (2015), FS-ISAC
* [ISO29100] ISO/IEC 29100 Information technology -- Security Techniques -- Privacy Framework <http://standards.iso.org/ittf/PubliclyAvailableStandards/c045123_ISO_IEC_29100_2011.zip>
* [ISO29134] ISO/IEC 29134 Information technology -- Security Techniques -- Privacy Impact Assessment -- Guidelines







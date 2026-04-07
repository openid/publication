# OpenID Connect Claims Aggregation

## Warning

This document is not an OIDF International Standard. It is distributed for review and comment. It is subject to change without notice and may not be referred to as an International Standard.

Recipients of this draft are invited to submit, with their comments, notification of any relevant patent rights of which they are aware and to provide supporting documentation.

## Copyright notice & license
The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.



## Foreword

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised by over 160 participating entities (workgroup participants). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established has the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.


## Introduction



### Notational Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in BCP
14 [RFC2119] [RFC8174] when, and only when, they appear in all
capitals, as shown here.

# **OpenID Connect Claims Aggregation **

[TOC]

## 1. Scope

This document specifies the methods for an application to:
* perform discovery for a Claims Provider;
* register a client to a Claims Provider;
* obtain claims from the Claims Provider; and 
* returned aggregated claims from Claims Providers to requesting clients.

## 2. Normative references
The following referenced documents are indispensable for the application of this document. For dated references, only the edition cited applied. For undated references, the latest edition of the referenced document (including any amendments) applies.

[BCP14] - Key words for use in RFCs to Indicate Requirement Levels
[BCP14]: https://tools.ietf.org/html/bcp14

[RFC6749] - The OAuth 2.0 Authorization Framework
[RFC6749]: https://tools.ietf.org/html/rfc6749

[RFC6750] - The OAuth 2.0 Authorization Framework: Bearer Token Usage
[RFC6750]: https://tools.ietf.org/html/rfc6750

[RFC7636] - # Proof Key for Code Exchange by OAuth Public Clients
[RFC7636]: https://tools.ietf.org/html/rfc76360

[BCP212] - OAuth 2.0 for Native Apps
[BCP212]: https://tools.ietf.org/html/bcp212

[RFC6819] - OAuth 2.0 Threat Model and Security Considerations
[RFC6819]: https://tools.ietf.org/html/rfc6819

[BCP195] - Recommendations for Secure Use of Transport Layer Security (TLS) and Datagram Transport Layer Security (DTLS)
[BCP195]: https://tools.ietf.org/html/bcp195

[OIDC] - OpenID Connect Core 1.0 incorporating errata set 1
[OIDC]: https://openid.net/specs/openid-connect-core-1_0.html

[OpenID.Discovery] - OpenID Connect Discovery 1.0
[OpenID.Discovery]: https://openid.net/specs/openid-connect-discovery-1_0.html

[OpenID.Registration] - OpenID Connect Registration 1.0
[OpenID.Registration]: http://openid.net/specs/openid-connect-registration-1_0.html

[OpenID.IDA] - OpenID Connect for Identity Assurance 1.0
[OpenID.IDA]:https://openid.net/specs/openid-connect-4-identity-assurance-1_0-ID1.html

[MTLS] - OAuth 2.0 Mutual TLS Client Authentication and Certificate Bound Access Tokens
[MTLS]: https://tools.ietf.org/html/draft-ietf-oauth-mtls

[JWT] - JSON Web Token
[JWT]: http://tools.ietf.org/html/draft-ietf-oauth-json-web-token

[JWS] - JSON Web Signature
[JWS]: http://tools.ietf.org/html/draft-ietf-jose-json-web-signature

[JWE] - JSON Web Encryption
[JWE]: http://tools.ietf.org/html/draft-ietf-jose-json-web-encryption

[JWA] - JSON Web Algorithms
[JWA]: http://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms


## 3. Terms and definitions
For the purpose of this document, the terms defined in [RFC6749], [RFC6750], [RFC7636], [OpenID Connect Core][OIDC] apply.

## 4. Symbols and abbreviated terms

**HTTP** - Hyper Text Transfer Protocol

**TLS** - Transport Layer Security

## 5. OpenID Connect Claims Aggregation

### 5.1 Introduction

Personal information can be stored in various places : locally or at various online claims providers. Commonly, different claims providers will store different types of personal information (e.g., a medical Claims Provider will store medical information and a school will store students' education history at the school). The decentralization of these various pieces of information makes it onerous for a person to share their information with other service providers. 

OpenID Connect Claims Aggregation provides a way for an OpenID Connect Provider to provide aggregated claims from Claims Providers to OpenID Connect clients. This enables a more user-centric way for users to share their information from an OpenID Provider which gathers all their information in a centralized location. The OpenID Provider acts as a Relying Party to Claims Providers by registering as a client and then making OpenID authentication requests for the necessary user information. The authentication requests goes through the normal OpenID request flow of obtaining user authentication and authorization for the requested claims. The OpenID Provider then makes a request for an access token that can be used at the Aggregate Claims Endpoint to fetch the requested claims that are then returned as aggregate claims to the requesting Relying Party client.



### 5.2 Discovery

This specification assumes that the Relying Party has already obtained configuration information about the OpenID Claims Provider, including its Authorization Endpoint and Token Endpoint locations. This information is obtained via Discovery, as described in OpenID Connect Discovery 1.0 [OpenID.Discovery], or may be obtained via other mechanisms.

OpenID Connect Claims Aggregation adds the following OpenID Provider Metadata to  the OpenID Connect Discovery 1.0 [OpenID.Discovery] response when aggregatable  claims are supported by a Claims Provider :

* *claims_endpoint*
	* **Required**. Claims Endpoint. URL at the Claims Provider that provides signed claims.
* *claims_signing_alg_values_supported*
	* **Optional**. JSON array containing a list of the  JWS [JWS] signing algorithms (alg values) JWA [JWA] supported by the Claims Endpoint to encode the Claims in a  JWT [JWT]. The value *none* MUST NOT be included.
* *claims_encryption_alg_values_supported*
	* **Optional**. JSON array containing a list of the  JWE [JWE] encryption algorithms (alg values) JWA [JWA] supported by the Claims Endpoint to encode the Claims in a JWT [JWT]. 
* *claims_encryption_enc_values_supported*
	* **Optional**. JSON array containing a list of the  JWE [JWE] encryption algorithms (enc values) JWA [JWA] supported by the Claims Endpoint to encode the Claims in a JWT [JWT]. 

Additionally, the following OP Metadata MUST contain the following parameters:
- *claim_types_supported*. The JSON array MUST contain the values *normal*, and *distributed* (client only).
-  *claims_supported*. A JSON array containing a list of the Claim Names of the Claims that the OpenID Provider MAY be able to supply values for.
- *claims_parameter_supported*. The value MUST be *true* to support the *claims* request parameter.
- *request_parameter_supported*. The value MUST be *true* to support the *request* request parameter.
- *request_uri_parameter_supported*. The value MUST be *true* to support the *request_uri* request parameter.

If the OpenID Provider supports  OpenID Connect for Identity Assurance 1.0 [OpenID.IDA], the supported OpenID Connect for Identity Assurance 1.0 [OpenID.IDA] supported features MUST be published as specified in section 7 of OpenID Connect for Identity Assurance 1.0 [OpenID.IDA].


### 5.2 Registration

This specification assumes that the Relying Party has already obtained sufficient credentials and provided information needed to use the OpenID Claims Provider. This is normally done via Dynamic Registration, as described in [OpenID Connect Dynamic Client Registration 1.0](https://openid.net/specs/openid-connect-core-1_0.html#OpenID.Registration) [OpenID.Registration], or may be obtained via other mechanisms.

OpenID Connect Claims Aggregation adds the following Client Metadata to the OpenID Connect  Dynamic Client Registration :

* *claims_signed_response_alg*
	* **Required**. JWS *alg* algorithm JWA [JWA] REQUIRED for signing Claims Responses. The value *none* MUST NOT be used. If this is specified, the response will be JWT [JWT] serialized, and signed using JWS. The default, if omitted, is *RS256*.
* *claims_encrypted_response_alg*
	* **Optional**. JWE *alg* algorithm JWA [JWA] REQUIRED for encrypting Claims responses to the client. If both signing and encryption are requested, the response will be signed then encrypted, with the result being a Nested JWT, as defined in JWT [JWT]. The default, if omitted, is that no encryption is performed.
* *claims_encrypted_response_enc*
	* **Optional**. JWE *enc* algorithm JWA [JWA] REQUIRED for encrypting Claims responses. If *claims_encrypted_response_enc* is specified, the default for this value is *A128CBC-HS256*. When *claims_encrypted_response_enc* is included, *claims_encrypted_response_alg* MUST also be provided.

Authentication requests to the Claims Provider's Authorization Endpoint should be signed or signed and encrypted. In order to support a more diverse set of claims, requests for claims should be made using  Request Objects which are signed or signed and encrypted by registering the appropriate values for the following Client Metadata registration parameters:

- *request_object_signing_alg*
- *request_object_encryption_alg*
- *request_object_encryption_enc* 


### 5.3 Authentication Request
Authentication requests to Claims Providers are made using the OpenID Connect Code Authorization Flow as described in 3.1 of  OpenID Connect 1.0 [OIDC] along with PKCE [RFC7636].

Requests for specific claims MUST be made using *scope* values, *claims* values, or and/or Request Objects in the Authentication Request.

Since claims from Claims Providers are returned as aggregated claims, only signed or signed and encrypted responses from the Claims Endpoint can be returned as aggregated claims by the OpenID Provider. 

The OpenID Provider should request a refresh token in the Authentication request to the Claims Provider to facilitate ease of retrieving individual claims from the Claim Provider's Claims Endpoint.

#### 5.3.1 Requesting Claims Using Scope Values
OpenID Connect Claims Aggregation supports the use of *scope* values in the Authentication Request to retrieve claims from the Claims Endpoint as specified in 5.4 of OpenID Connect 1.0 [OIDC].

#### 5.3.2 Requesting Claims Using the 'claims" Parameter
OpenID Connect Claims Aggregation supports the use of *claims* parameter to retrieve claims from the Claims Endpoint as specified in 5.5 of OpenID Connect 1.0 [OIDC].

To support  additional claims and provide claims assurance, OpenID Claims Aggregation supports OpenID Connect for Identity Assurance 1.0 [OpenID.IDA] for the Claims request JSON object and defines the following new Claims in addition to the Claims defined in the OpenID Connect specification OpenID Connect 1.0 [OIDC]:

* **uid** *string* The value is the base64url encoded representation of the thumbprint of the Client's public key for signing. This thumbprint value is computed as the SHA-256 hash of the octets of the UTF-8 representation of a JWK constructed containing only the REQUIRED members to represent the key, with the member names sorted into lexicographic order, and with no white space or line breaks. For instance, when the  kty  value is  RSA, the member names  e,  kty, and  n  are the ones present in the constructed JWK used in the thumbprint computation and appear in that order; when the  kty  value is  EC, the member names  crv,  kty,  x, and  y  are present in that order. Note that this thumbprint calculation is the same as that defined in the JWK Thumbprint  [[JWK.Thumbprint]](https://openid.net/specs/openid-connect-core-1_0.html#JWK.Thumbprint)  specification.
* **cp_sub** *string* The Claim Providers *sub* identifier for the authenticated user.


In addition, OpenID Connect Claims Aggregation defines the following top-level member to the Claims request JSON object:

- *c_token*
	- **Optional**. Requests that the listed individual Claims be returned from the Claims Endpoint. If present, the listed Claims are being requested to be added to any Claims that are being requested using  scope  values. If not present, the Claims being requested from the Claims Endpoint are only those requested using  scope  values. This top-level member is a JSON object with the names of the individual Claims being requested as the member names and the values are defined as in 5.5.1 of OpenID Connect 1.0 [OIDC].

OpenID Claims Aggregation supports the requesting of additional claims and verified claims defined in OpenID Connect for Identity Assurance 1.0 [OpenID.IDA] for the *c_token* member of the Claims request JSON object. 

When the  *c_token*  member is used, the request MUST also use a  *response_type*  value that results in an Access Token being issued to the Client for use at the claims endpoint. 

#### 5.3.3 Requesting Claims Using Request Object
OpenID Connect Claims Aggregation is a superset of OpenID Connect 1.0 [OIDC]; it fully supports requesting claims via Request Objects as specified in 6 of OpenID Connect 1.0 [OIDC] in conjunction with the additional *c_token* member as defined in 5.3.2 of this specification. 


### 5.4 Token Endpoint
The OpenID Provider acting as Relying Party to the Claims Provider makes a request to the Claims Provider's Token Endpoint  to retrieve an access token as described in 3.1.3 of OpenID Connect 1.0 [OIDC].

The Token Endpoint request should limit the scope if less information is desired than the initial Authentication request.

### 5.4 Claims Endpoint
The Claims Endpoint is an OAuth 2.0 Protected Resource that returns Claims about the authenticated End-User. To obtain the requested Claims about the End-User, the Client makes a request to the Claims Endpoint using an Access Token obtained through OpenID Connect Authentication. These Claims are normally represented by a JSON object that contains a collection of name and value pairs for the Claims.

Communication with the Claims Endpoint MUST utilize TLS. See  [Section 16.17](https://openid.net/specs/openid-connect-core-1_0.html#TLSRequirements)  for more information on using TLS.

The Claims Endpoint MUST support the use of the HTTP  GET  and HTTP  POST  methods defined in  [RFC 2616](https://openid.net/specs/openid-connect-core-1_0.html#RFC2616)  [RFC2616].

The Claims Endpoint MUST accept Access Tokens as  [OAuth 2.0 Bearer Token Usage](https://openid.net/specs/openid-connect-core-1_0.html#RFC6750)  [RFC6750].

The Claims Endpoint SHOULD support the use of  [Cross Origin Resource Sharing (CORS)](https://openid.net/specs/openid-connect-core-1_0.html#CORS)  [CORS] and or other methods as appropriate to enable Java Script Clients to access the endpoint.


#### 5.4.1 Claims Endpoint Request

Using the access token retrieved from the Claims Provider's Token Endpoint, the OpenID Provider acting as Relying Party to the Claims Provider, makes a request to the Claims Provider's Claims Endpoint for the requested claims as described in 5.3.1 of OpenID Connect 1.0 [OIDC].

The Client sends the Claims Request using either HTTP  GET  or HTTP  POST. If using the HTTP  GET  method, the request parameters are serialized using URI Query String Serialization, per  [Section 13.1](https://openid.net/specs/openid-connect-core-1_0.html#QuerySerialization). If using the HTTP  POST  method, the request parameters are serialized using Form Serialization, per  [Section 13.2](https://openid.net/specs/openid-connect-core-1_0.html#FormSerialization). The Access Token obtained from an OpenID Connect Authentication Request MUST be sent as a Bearer Token, per Section 2 of  [OAuth 2.0 Bearer Token Usage](https://openid.net/specs/openid-connect-core-1_0.html#RFC6750)  [RFC6750].

It is RECOMMENDED that the request use the HTTP  GET  method and the Access Token be sent using the Authorization  header field.

This specification defines the following request parameters for the Claims Endpoint request:

- *uid* **Optional** String value which identifies the end-user at the Client. The value is described in 5.3.2 of this specification. If this parameter is not supplied, the *uid* claims value MUST be supplied in the *claims* parameter.
- *claims* **Optional**. This parameter is used to request that specific Claims be returned. This is a JSON object with only the *c_token* top-level member defined in 5.3.2 of this specification. The *c_token* member requests that the listed individual Claims be returned from the Claims Endpoint. The requested claims MUST only be a subset of the claims bounded to the Access Token as requested in the Authentication Request's *scope*, *claims*, or *request* or *request_uri* parameters. The *c_token* member MUST contain the *uid* claim value if the *uid* request parameter is not supplied.
- *aud* **Required???** JSON object containing a string array of client identifiers that will be added as additional *aud*  (audience) claims for the resulting JWT response from this endpoint.


The following is a non-normative example of a Aggregation Request:

      GET /c_token?claims={"aggregation":{"uid":"id8837395937","email":{"essential":true},"email_verified":{"essential":true}}}&aud={["client1234"}      
      HTTP/1.1
      Host: server.example.com
      Authorization: Bearer SlAV32hkKG

#### 5.4.2 Claims Endpoint Response

The Claims Endpoint Claims MUST return signed or signed and encrypted response as was requested during Client Registration. The Claims defined in  [Section 5.1](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)  can be returned, as can additional Claims not specified there.

For privacy reasons, OpenID Providers MAY elect to not return values for some requested Claims.

If a Claim is not returned, that Claim Name SHOULD be omitted from the JSON object representing the Claims; it SHOULD NOT be present with a null or empty string value.

The *uid* claim MUST always be returned in the Aggregation Response.

Upon receipt of the Aggregation Request, the Claims Endpoint MUST return the JSON Serialization of the Aggregation Response as in  [Section 13.3](https://openid.net/specs/openid-connect-core-1_0.html#JSONSerialization)  in the HTTP response body unless a different format was specified during Registration  OpenID Connect Registration 1.0 [OpenID.Registration]. The Claims Endpoint MUST return a content-type header to indicate which format is being returned. The content-type of the HTTP response MUST be  application/json  if the response body is a text JSON object; the response body SHOULD be encoded using UTF-8.

If the Aggregation Response is signed and/or encrypted, then the Claims are returned in a JWT and the content-type MUST be  application/jwt. The response MAY be encrypted without also being signed. If both signing and encryption are requested, the response MUST be signed then encrypted, with the result being a Nested JWT, as defined in  JWT [JWT]. The JWT returned from the Claims Endpoint SHOULD NOT have an expiration or if it does, it SHOULD have a suitable long term expiration period.

If signed, the Aggregation Response SHOULD contain the Claims  iss  (issuer) and  aud  (audience) as members. The  iss  value SHOULD be the Claim Provider's Issuer Identifier URL. The  aud  value MUST be the RP's Client ID value in addition to any *aud* identifiers that were supplied in the request.

***Note:** [https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32#section-4.1.3](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32#section-4.1.3) The "aud" (audience) claim identifies the recipients that the JWT is intended for.  Each principal intended to process the JWT MUST identify itself with a value in the audience claim.  If the principal processing the claim does not identify itself with a value in the "aud" claim when this claim is present, then the JWT MUST be rejected. This statement seems contradictory. a) Audience must identify itself b) Reject if present and does not identify

The following is a non-normative example of a Aggregation Response:
The Claims Provider returns the requested claims as described in 5.3.2 of OpenID Connect 1.0 [OIDC].


#### 5.4.3 Claims Endpoint Error Response
 When an error condition occurs, the Claims Endpoint returns an Error Response as defined in Section 3 of  [OAuth 2.0 Bearer Token Usage](https://openid.net/specs/openid-connect-core-1_0.html#RFC6750)  [RFC6750]. (HTTP errors unrelated to RFC 6750 are returned to the User Agent using the appropriate HTTP status code.)

The following is a non-normative example of a Aggregation Error Response:

    HTTP/1.1 401 Unauthorized
      WWW-Authenticate: error="invalid_token",
        error_description="The Access Token expired"

 
### 5.5 Aggregate Claims Response
The OpenID Provider returning aggregate claims shall fetch the claims from the Claims Provider's Claims Endpoint. Claims Provider's Claims Endpoint responses must be signed or signed and encrypted. 

The Claims Provider's Claims Endpoint response is then returned as aggregate claims in the OpenID Provider's ID Token response or   Claims Endpoint response as described in 5.6.2 of OpenID Connect 1.0 [OIDC].

### 5.6 Aggregate Claims Response Validation

1.  If the Aggregate Claim is encrypted, decrypt it using the keys and algorithms that the Client specified during Registration that the OP was to use to encrypt the Claims Endpoint response. If encryption was negotiated with the OP at Registration time and the Aggregate Claims is not encrypted, the RP SHOULD reject it.
2.  The value of the  iss  (issuer) Claim containing the Claims Provider's Issuer Identifier must be a value that the Client trusts.
3. The value of the  uid  MUST be the base64url encoded representation of the thumbprint of the Client's public signing key. 
4.  The Client MUST validate that the  aud  (audience) Claim contains its  client_id  value registered at the Issuer identified by the  iss  (issuer) Claim as an audience. The  aud  (audience) Claim MAY contain an array with more than one element. The Aggregate Claim MUST be rejected if the Aggregate Claim does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
5.  The Client MUST validate the signature of the Aggregate Claim according to  [JWS  [JWS] using the algorithm specified in the JWT  *alg*  Header Parameter. The Client MUST use the keys provided by the Issuer of the Aggregate Claim.

# 6. Security Considerations

TBD

# 7. Privacy Considerations

TBD

# Authors

* Edmund Jay, Illumila
* Nat Sakimura, NAT Consulting
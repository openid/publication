%%%
title = "JWT Secured Authorization Response Mode for OAuth 2.0 (JARM)"
abbrev = "OAuth JARM"
ipr = "none"
workgroup = "FAPI"
keyword = ["security", "oauth2"]

[seriesInfo]
name = "Internet-Draft"
value = "oauth-v2-jarm-04"
status = "standard"

[[author]]
initials="T."
surname="Lodderstedt"
fullname="Torsten Lodderstedt"
organization="yes.com"
    [author.address]
    email = "torsten@lodderstedt.net"

[[author]]
initials="B."
surname="Campbell"
fullname="Brian Campbell"
organization="Ping Identity"
    [author.address]
    email = "bcampbell@pingidentity.com"

%%%


{mainmatter}

# Introduction

This document defines a new JWT-based mode to encode OAuth authorization responses. Clients are enabled to request
the transmission of the authorization response parameters along with additional data in JWT format.
This mechanism enhances the security of the standard authorization response with support for signing and optional encryption of the response.
A signed response provides message integrity, sender authentication, audience restriction, and protection from mix-up attacks. Encrypting the response provides confidentiality of the response parameter values.
The JWT authorization response mode can be used in conjunction with any response type.

## Notational Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL
NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED",
"MAY", and "OPTIONAL" in this document are to be interpreted as
described in BCP 14 [@!RFC2119] [@!RFC8174] when, and only when, they
appear in all capitals, as shown here.

## Terms and definitions
For the purpose of this document, the terms defined in [@!RFC6749] and [@OIDC] apply.

## Symbols and Abbreviated terms

**API** – Application Programming Interface

**CSRF** - Cross Site Request Forgery

**HTTP** – Hyper Text Transfer Protocol

**OIDF** - OpenID Foundation

**TLS** – Transport Layer Security

# JWT-based Response Mode

This document defines a new JWT-based [@!RFC7519] mode to encode OAuth [@!RFC6749] authorization response parameters. All response parameters defined for a given response type are conveyed in a JWT along with additional claims used to further protect the transmission. Since there are different techniques to encode the JWT itself in the response to the client, namely query URI parameter, fragment component and form post, this document defines a set of response mode values in accordance with [@!OIDM] corresponding to these techniques.

## The JWT Response Document {#jwt-response}

The JWT always contains the following data utilized to secure the transmission:

* `iss` - the issuer URL of the authorization server that created the response
* `aud` - the client_id of the client the response is intended for
* `exp` - expiration of the JWT. A maximum JWT lifetime of 10 minutes is RECOMMENDED.
 
The JWT MUST furthermore contain the authorization endpoint response parameters as defined for the particular response types, even in case of an error response. Authorization endpoint response parameter names and string values are included as JSON strings and numerical values (e.g., `expires_in` value) are included as JSON numbers. This pattern is applicable to all response types including those defined in [@!OIDM]. The following subsection illustrates the pattern for the response type "code".

Note: Additional authorization endpoint response parameters defined by extensions, e.g. `session_state` as defined in [@OISM], will also be added to the JWT. 

The JWT response document MAY contain further element, e.g. the claims defined in [@!RFC7519]. Implementation SHOULD adhere to the respective processing rules and ignore unrecognized elements.

### Example Response Type "code" 

For the grant type authorization "code" the JWT contains the response parameters as defined in [@!RFC6749], sections 4.1.2:

* `code` - the authorization code
* `state` - the state value as sent by the client in the authorization request, if the client included a `state` parameter

The following example shows the JWT claims for a successful "code" authorization response:

```
{  
   "iss":"https://accounts.example.com",
   "aud":"s6BhdRkqt3",
   "exp":1311281970,
   "code":"PyyFaux2o7Q0YfXBU32jhw.5FXSQpvr8akv9CeRDSd0QA",  
   "state":"S8NJ7uqk5fY4EjNvP_G_FtyJu6pUsvH9jsYni9dMAJw"
}
```

In case of an error response, the JWT contains the error response parameters as defined in [@!RFC6749], sections 4.1.2.1:

* `error` - the error code
* `error_description` (OPTIONAL) - a human readable description of the error
* `error_uri` (OPTIONAL) - a URI identifying a human-readable web page with information about the error
* `state` - the state value as sent by the client in the authorization request (if applicable)

The following example shows the JWT payload for such an error response:

```
{
   "iss":"https://accounts.example.com",
   "aud":"s6BhdRkqt3",
   "exp":1311281970,
   "error":"access_denied",
   "state":"S8NJ7uqk5fY4EjNvP_G_FtyJu6pUsvH9jsYni9dMAJw"
}
```

## Signing and Encryption {#signing-and-encryption}

The JWT is either signed, or signed and encrypted. If the JWT is both signed and encrypted, the JSON document will be signed then encrypted, with the result being a Nested JWT, as defined in [@!RFC7519].

The authorization server determines what algorithm to employ to secure the JWT for a particular authorization response. This decision can be based on registered metadata parameters for the client as defined by this document (see (#client-metadata)).

For guidance on key management in general and especially on use of symmetric algorithms for signing and encrypting based on client secrets see section 10 of [@OIDC].

## Response Encoding

This document defines the following response mode values:

* `query.jwt`
* `fragment.jwt`
* `form_post.jwt`
* `jwt`

### Response Mode "query.jwt"

The response mode "query.jwt" causes the authorization server to send the authorization response as HTTP redirect to the redirect URI of the client. The authorization server adds the parameter `response` containing the JWT as defined in (#jwt-response). to the query component of the redirect URI using the "application/x-www-form-urlencoded" format.

This is an example response (line breaks for display purposes only): 

```
HTTP/1.1 302 Found
Location: https://client.example.com/cb?
response=eyJraWQiOiJsYWViIiwiYWxnIjoiRVMyNTYifQ.eyAgImlzcyI6ICJodHRwczovL2FjY291
bnRzLmV4YW1wbGUuY29tIiwgICJhdWQiOiAiczZCaGRSa3F0MyIsICAiZXhwIjogMTMxMTI4MTk3MCwg
ICJjb2RlIjogIlB5eUZhdXgybzdRMFlmWEJVMzJqaHcuNUZYU1FwdnI4YWt2OUNlUkRTZDBRQSIsICAi
c3RhdGUiOiAiUzhOSjd1cWs1Zlk0RWpOdlBfR19GdHlKdTZwVXN2SDlqc1luaTlkTUFKdyJ9.4VdtknV
Z9zFYDVLagJpVBD436bjPMcSgOaPDPFgTEkNyCs2uIHYJ2XML6d2w1AUsm5GBG77DBisZNhLWfug6dA
```

Note: "query.jwt" MUST NOT be used in conjunction with response types that contain "token" or "id_token" unless the response JWT is encrypted to prevent token leakage in the URL. 

### Response Mode "fragment.jwt"

The response mode "fragment.jwt" causes the authorization server to send the authorization response as HTTP redirect to the redirect URI of the client. The authorization server adds the parameter `response` containing the JWT as defined in (#jwt-response). to the fragment component of the redirect URI using the "application/x-www-form-urlencoded" format.

This is an example response (line breaks for display purposes only): 

```
HTTP/1.1 302 Found
Location: https://client.example.com/cb#
response=eyJraWQiOiJsYWViIiwiYWxnIjoiRVMyNTYifQ.eyAgImlzcyI6ICJodHRwczovL2FjY291
bnRzLmV4YW1wbGUuY29tIiwgICJhdWQiOiAiczZCaGRSa3F0MyIsICAiZXhwIjogMTMxMTI4MTk3MCwg
ICJhY2Nlc3NfdG9rZW4iOiAiMllvdG5GWkZFanIxekNzaWNNV3BBQSIsICAic3RhdGUiOiAiUzhOSjd1
cWs1Zlk0RWpOdlBfR19GdHlKdTZwVXN2SDlqc1luaTlkTUFKdyIsICAidG9rZW5fdHlwZSI6ICJiZWFy
ZXIiLCAgImV4cGlyZXNfaW4iOiAzNjAwLCAgInNjb3BlIjogImV4YW1wbGUifQ.g_96IM2t_6Dazm1Jp
b2gbO2EXe5IKTw2bYS7l9Y1RI8HbNPYN5EdNjxcWeL5LTQaUAZ2PtJoHbTdjMvNa3xbVg
```

### Response Mode "form_post.jwt"

The response mode "form_post.jwt" uses the technique described in [@!OIFP] to convey the JWT to the client. The `response` parameter containing the JWT is encoded as HTML form value that is auto-submitted in the User Agent, and thus is transmitted via the HTTP POST method to the Client, with the result parameters being encoded in the body using the "application/x-www-form-urlencoded" format.

This is an example response from the authorization server to the user agent (line breaks for display purposes only), 

```
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8
Cache-Control: no-cache, no-store
Pragma: no-cache

<html>
 <head><title>Submit This Form</title></head>
 <body onload="javascript:document.forms[0].submit()">
  <form method="post" action="https://client.example.com/cb">
    <input type="hidden" name="response"
     value="eyJraWQiOiJsYWViIiwiYWxnIjoiRVMyNTYifQ.eyAgImlzcyI6ICJodHRw
     czovL2FjY291bnRzLmV4YW1wbGUuY29tIiwgICJhdWQiOiAiczZCaGRSa3F0MyIsIC
     AiZXhwIjogMTMxMTI4MTk3MCwgICJhY2Nlc3NfdG9rZW4iOiAiMllvdG5GWkZFanIx
     ekNzaWNNV3BBQSIsICAic3RhdGUiOiAiUzhOSjd1cWs1Zlk0RWpOdlBfR19GdHlKdT
     ZwVXN2SDlqc1luaTlkTUFKdyIsICAidG9rZW5fdHlwZSI6ICJiZWFyZXIiLCAgImV4
     cGlyZXNfaW4iOiAzNjAwLCAgInNjb3BlIjogImV4YW1wbGUifQ.g_96IM2t_6Dazm1
     Jpb2gbO2EXe5IKTw2bYS7l9Y1RI8HbNPYN5EdNjxcWeL5LTQaUAZ2PtJoHbTdjMvNa
     3xbVg"/>
    </form>
   </body>
  </html>  
```
which results in the following POST request to the client's redirect URI.

```
POST /cb HTTP/1.1
Host: client.example.org
Content-Type: application/x-www-form-urlencoded

response=eyJraWQiOiJsYWViIiwiYWxnIjoiRVMyNTYifQ.eyAgImlzcyI6ICJodHRw
czovL2FjY291bnRzLmV4YW1wbGUuY29tIiwgICJhdWQiOiAiczZCaGRSa3F0MyIsICAi
ZXhwIjogMTMxMTI4MTk3MCwgICJhY2Nlc3NfdG9rZW4iOiAiMllvdG5GWkZFanIxekNz
aWNNV3BBQSIsICAic3RhdGUiOiAiUzhOSjd1cWs1Zlk0RWpOdlBfR19GdHlKdTZwVXN2
SDlqc1luaTlkTUFKdyIsICAidG9rZW5fdHlwZSI6ICJiZWFyZXIiLCAgImV4cGlyZXNf
aW4iOiAzNjAwLCAgInNjb3BlIjogImV4YW1wbGUifQ.g_96IM2t_6Dazm1Jpb2gbO2EX
e5IKTw2bYS7l9Y1RI8HbNPYN5EdNjxcWeL5LTQaUAZ2PtJoHbTdjMvNa3xbVg
```  
    
### Response Mode "jwt"

The response mode "jwt" is a shortcut and indicates the default redirect encoding (query, fragment) for the requested response type. The default for response type "code" is "query.jwt" whereas the default for "token" and the response types defined in [@!OIDM], except "none", is "fragment.jwt".

## Processing rules

Assumption: the client remembers the authorization server to which it sent the authorization request and binds this information to the user agent.

The client MUST process the JWT secured response as follows:

1. (OPTIONAL) The client decrypts the JWT using the default key for the respective issuer or, if applicable, determined by the `kid` JWT header parameter. The key might be a private key, where the corresponding public key is registered with the expected issuer of the response ("use":"enc" via the client's metadata `jwks` or `jwks_uri`) or a key derived from its client secret (see (#signing-and-encryption)). 
1. The client obtains the `iss` element from the JWT and checks whether its value is well known and identifies the expected issuer of the authorization process in examination. If the check fails, the client MUST abort processing and refuse the response.
1. The client obtains the `aud` element from the JWT and checks whether it matches the client id the client used to identify itself in the corresponding authorization request. If the check fails, the client MUST abort processing and refuse the response.
1. The client checks the JWT's `exp` element to determine if the JWT is still valid. If the check fails, the client MUST abort processing and refuse the response. 
1. The client MUST check the signature of the JWT according to [@!RFC7515] and the algorithm `none` (`"alg":"none"`) MUST NOT be accepted. If the check fails, the client MUST abort processing and refuse the response.

The client will perform further checks, e.g. for CSRF detection, which are out of scope of this specification. Please see [@I-D.ietf-oauth-security-topics] for more security recommendations.

Note: The way the client obtains the keys for verifying the JWT's signature (step 5) is out of scope of this document. Established mechanism such as [@OIDD] or [@RFC8414] SHOULD be utilized.

The client MUST NOT process the grant type specific authorization response parameters before all checks succeed. 

# Client Metadata {#client-metadata}

The Dynamic Client Registration Protocol [@RFC7591] defines an API
for dynamically registering OAuth 2.0 client metadata with authorization servers.
The metadata defined by [@RFC7591], and registered extensions to it,
also imply a general data model for clients that is useful for authorization server implementations
even when the Dynamic Client Registration Protocol isn't in play.
Such implementations will typically have some sort of user interface available for managing client configuration.

The following client metadata parameters are introduced by this specification:

`authorization_signed_response_alg`
:   The JWS [@!RFC7515] `alg` algorithm REQUIRED for signing authorization responses. If this is specified, the response will be signed using JWS and the configured algorithm. If unspecified, the default algorithm to use for signing authorization responses is `RS256`. The algorithm `none` is not allowed.

`authorization_encrypted_response_alg`
:   The JWE [@!RFC7516] `alg` algorithm REQUIRED for encrypting authorization responses.  If both signing and encryption are requested, the response will be signed then encrypted, with the result being a Nested JWT, as defined in JWT [@!RFC7519].  The default, if omitted, is that no encryption is performed.

`authorization_encrypted_response_enc`
:   The JWE [@!RFC7516] `enc` algorithm REQUIRED for encrypting authorization responses.  If `authorization_encrypted_response_alg` is specified, the default for this value is `A128CBC-HS256`.  When `authorization_encrypted_response_enc` is included, `authorization_encrypted_response_alg` MUST also be provided.

The `jwks_uri` or `jwks` metadata parameters can be used by clients to register their public encryption keys.

# Authorization Server Metadata {#as-metadata}

Authorization servers SHOULD publish the supported algorithms for signing and encrypting the JWT of an authorization response by utilizing OAuth 2.0 Authorization Server Metadata [@RFC8414] parameters.

The following parameters are introduced by this specification:

`authorization_signing_alg_values_supported`
:   OPTIONAL.  A JSON array containing a list of the JWS [@!RFC7515] signing algorithms (`alg` values) supported by the authorization endpoint to sign the response.

`authorization_encryption_alg_values_supported`
:   OPTIONAL.  A JSON array containing a list of the JWE [@!RFC7516] encryption algorithms (`alg` values) supported by the authorization endpoint to encrypt the response.

`authorization_encryption_enc_values_supported`
:   OPTIONAL.  A JSON array containing a list of the JWE [@!RFC7516] encryption algorithms (`enc` values)  supported by the authorization endpoint to encrypt the response.

Authorization servers SHOULD publish the supported response mode values utilizing the parameter `response_modes_supported` as defined in [@RFC8414]. This document introduces the following possible values:

*  `query.jwt`
*  `fragment.jwt`
*  `form_post.jwt`
*  `jwt`

# Security Considerations

As JARM is used as a component in OAuth, many of the security considerations listed in OAuth 2.0 Security Best Current Practice [@I-D.ietf-oauth-security-topics] apply. In addition, for the mechanisms described in this document, the following security considerations apply.

## DoS using specially crafted JWTs
JWTs could be crafted to have an issuer that resolves to a JWK set URL with
huge content, or is delivered very slowly, consuming server networking
bandwidth and compute capacity. The resolved JWK set URL could also be used to
DDoS targets on the web.

The client therefore MUST first check that the issuer of the JWT is well-known 
and expected for the particular authorization response before it uses this data 
to obtain the key needed to check the JWT's signature.  

## Protocol Run Integrity
An OAuth protocol run is made of many distinct message exchanges between the client and server
to complete the issuance of access and refresh tokens. Even if every message itself is integrity
protected, it is still conceivable that one or more of the messages are exchanged with another
message created for a different protocol run. The leakage and reuse of encrypted messages in
(#code-leakage) is an example of such problems. To mitigate this problem, it is considered good
practice to implement additional protection provided by PKCE [@RFC7636]
as described in [@I-D.ietf-oauth-security-topics].

## Mix-Up
Mix-up is an attack on scenarios where an OAuth client interacts with
multiple authorization servers. The goal of the attack is to obtain an
authorization code or an access token by tricking the client into
sending those credentials to the attacker instead of using them at
the respective endpoint at the authorization/resource server.
   
The JWT secured response mode enables clients to detect this attack by providing an identification of the sender (`iss`) and the intended audience of the authorization response (`aud`). 

## Code Leakage {#code-leakage}
Authorization servers MAY encrypt the authorization response therewith providing a means to prevent leakage of authorization codes in the user agent (e.g. during transmission, in browser history or via referrer headers). 
Note, however, that the entire response is then potentially subject to leakage. An encrypted response doesn't remove the need for additional protections provided by mechanisms such as PKCE [@RFC7636].

# Privacy Considerations

JARM only defines an alternative way of encoding the authorization response message and therefore does not materially impact the privacy considerations
of OAuth 2.0, which is a complex and flexible framework with broad-ranging privacy implications. 

The content of a conventional authorization response message (e.g., `code` and `state`) does not typically convey personally identifiable information (PII). However, using encrypted JARM may improve privacy by reducing the potential for inadvertent information disclosure in cases where the authorization response might contain PII (such as other response types or extensions).

# IANA Considerations
## OAuth Dynamic Client Registration Metadata Registration
This specification requests registration of the following client metadata definitions in the IANA "OAuth Dynamic Client Registration Metadata" registry established by [@RFC7591]:

### Registry Contents

* Client Metadata Name: `authorization_signed_response_alg`
* Client Metadata Description: String value indicating the client's desired introspection response signing algorithm.
* Change Controller: IESG
* Specification Document(s): (#client-metadata) of [[ this specification ]]
* Client Metadata Name: `authorization_encrypted_response_alg`
* Client Metadata Description: String value specifying the desired introspection response encryption algorithm (alg value).
* Change Controller: IESG
* Specification Document(s): (#client-metadata) of [[ this specification ]]
* Client Metadata Name: `authorization_encrypted_response_enc`
* Client Metadata Description: String value specifying the desired introspection response encryption algorithm (enc value).
* Change Controller: IESG
* Specification Document(s): (#client-metadata) of [[ this specification ]]

## OAuth Authorization Server Metadata Registration
This specification requests registration of the following value in the IANA "OAuth Authorization Server Metadata" registry established by [@RFC8414].

### Registry Contents

* Metadata Name: `authorization_signing_alg_values_supported`
* Metadata Description: JSON array containing a list of algorithms supported by the authorization server for introspection response signing.
* Change Controller: IESG
* Specification Document(s): (#as-metadata) of [[ this specification ]]
* Metadata Name: `authorization_encryption_alg_values_supported`
* Metadata Description: JSON array containing a list of algorithms supported by the authorization server for introspection response encryption (alg value).
* Change Controller: IESG
* Specification Document(s): (#as-metadata) of [[ this specification ]]
* Metadata Name: `authorization_encryption_enc_values_supported`
* Metadata Description: JSON array containing a list of algorithms supported by the authorization server for introspection response encryption (enc value).
* Change Controller: IESG
* Specification Document(s): (#as-metadata) of [[ this specification ]]

{backmatter}

<reference anchor="OIDC" target="http://openid.net/specs/openid-connect-core-1_0.html">
  <front>
    <title>OpenID Connect Core 1.0 incorporating errata set 1</title>
    <author initials="N." surname="Sakimura" fullname="Nat Sakimura">
      <organization>NRI</organization>
    </author>
    <author initials="J." surname="Bradley" fullname="John Bradley">
      <organization>Ping Identity</organization>
    </author>
    <author initials="M." surname="Jones" fullname="Mike Jones">
      <organization>Microsoft</organization>
    </author>
    <author initials="B." surname="de Medeiros" fullname="Breno de Medeiros">
      <organization>Google</organization>
    </author>
    <author initials="C." surname="Mortimore" fullname="Chuck Mortimore">
      <organization>Salesforce</organization>
    </author>
   <date day="8" month="Nov" year="2014"/>
  </front>
</reference>

<reference anchor="OIDD" target="https://openid.net/specs/openid-connect-discovery-1_0.html">
  <front>
    <title>OpenID Connect Discovery 1.0 incorporating errata set 1</title>
    <author initials="N." surname="Sakimura" fullname="Nat Sakimura">
      <organization>NRI</organization>
    </author>
    <author initials="J." surname="Bradley" fullname="John Bradley">
      <organization>Ping Identity</organization>
    </author>
    <author initials="M." surname="Jones" fullname="Mike Jones">
      <organization>Microsoft</organization>
    </author>
    <author initials="E." surname="Jay" fullname="Edmund Jay">
      <organization>Illumila</organization>
    </author>
    <date day="8" month="Nov" year="2014"/>
  </front>
</reference>

<reference anchor="OIFP" target="https://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html">
  <front>
    <title>OAuth 2.0 Form Post Response Mode</title>
    <author initials="M." surname="Jones" fullname="Mike Jones">
      <organization>Microsoft</organization>
    </author>
    <author initials="B." surname="Campbell" fullname="Brian Campbell">
      <organization>Illumila</organization>
    </author>
    <date day="27" month="April" year="2015"/>
  </front>
</reference>

<reference anchor="OIDM" target="http://openid.net/specs/oauth-v2-multiple-response-types-1_0.html">
<front>
<title>OAuth 2.0 Multiple Response Type Encoding Practices</title>
<author fullname="Breno de Medeiros" initials="B." role="editor" surname="de Medeiros">
<organization abbrev="Google">Google</organization>
</author>
<author fullname="Marius Scurtescu" initials="M." surname="Scurtescu">
<organization abbrev="Google">Google</organization>
</author>
<author fullname="Paul Tarjan" initials="P." surname="Tarjan">
<organization abbrev="Facebook"> Facebook</organization>
</author>
<author fullname="Michael B. Jones" initials="M.B." surname="Jones">
<organization abbrev="Microsoft">Microsoft</organization>
</author>
<date day="25" month="February" year="2014" />
</front>
</reference>

<reference anchor="OISM" target="http://openid.net/specs/openid-connect-session-1_0.html">
<front>
  <title>OpenID Connect Session Management 1.0</title>
  <author fullname="Breno de Medeiros" initials="B." surname="de Medeiros">
    <organization>Google</organization>
  </author>
  <author fullname="Naveen Agarwal" initials="N." surname="Agarwal">
    <organization>Microsoft</organization>
  </author>
  <author fullname="Nat Sakimura" initials="N." surname="Sakimura">
    <organization abbrev="NAT.Consulting">NAT.Consulting</organization>
  </author>
  <author fullname="John Bradley" initials="J." surname="Bradley">
    <organization abbrev="Yubico">Yubico</organization>
  </author>
  <author fullname="Michael B. Jones" initials="M.B." surname="Jones">
    <organization abbrev="Microsoft">Microsoft</organization>
  </author>
  <date day="14" month="March" year="2022" />
</front>
</reference>

# Acknowledgements

The following people contributed to this document:

* Torsten Lodderstedt (YES), Editor
* Brian Campbell (Ping Identity), Co-editor
* Nat Sakimura (NAT Consulting LLC) -- Chair
* Dave Tonge (Momentum Financial Technology) -- Chair
* Joseph Heenan (Authlete)
* Ralph Bragg (Raidiam)
* Vladimir Dzhuvinov (Connect2ID)
* Michael Schwartz (Gluu)
* Filip Skokan (Auth0|Okta)

# Notices

Copyright (c) 2022 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.
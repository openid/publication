%%%
title = "OpenID Connect Claims Aggregation 1.0 - Draft 04"
abbrev = "oidc-ca"
ipr = "none"
workgroup = "connect"
keyword = ["security", "openid", "privacy"]

[seriesInfo]
name = "OpenID-Draft"
value = "openid-connect-claims-aggregation-1_0"
status = "standard"

[pi]
subcompact = "yes"
private = "Draft-04"
tocdepth = "5"
iprnotified = "no"

[[author]]
initials="N."
surname="Sakimura"
fullname="Nat Sakimura"
organization="NAT.Consulting"
    [author.address]
    email = "nat@nat.consulting"

[[author]]
initials="E."
surname="Jay"
fullname="Edmund Jay"
organization="Illumila"
    [author.address]
    email = "ejay@illumi.la"

%%%

.# Abstract

An OpenID Provider (OP) can disclose claims about an End-User, such as a name
or date of birth, to a Relying Party (RP) with the End-User's consent. This
document profiles the Aggregated Claims model defined in Section 5.6.2 of
OpenID Connect Core 1.0 [OpenID.Core]. In this model, the OP returns claims asserted
by one or more Claims Providers (CPs).

This document specifies the following interactions.

* The OP discovers CP metadata.
* The OP establishes itself as a client of the CP.
* The OP obtains claims from the CP.
* The RP requests claims from the OP.
* The OP returns claims from the CP to the RP as Aggregated Claims.
* The RP verifies the returned claims.

.# Warning

This document is not an OIDF International Standard. It is distributed for review and comment. It is subject to change without notice and may not be referred to as an International Standard.

Recipients of this draft are invited to submit, with their comments, notification of any relevant patent rights of which they are aware and to provide supporting documentation.

.# Foreword

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it comprises over 160 participating entities (workgroup participants). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established have the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

.# Introduction

OpenID Connect is a selective claims disclosure mechanism. When a set of claims included in its response is about 
an entity authentication event, it works as an entity authentication federation mechanism, but it can deliver 
other claims selected by the subject as well. 

An OpenID Connect response can include claims from several sources. These sources can be authoritative
or corroborative. The roles in the Aggregated Claims model are described in (#actors).

An OP can return claims from CPs to an RP by value or by reference. With
Aggregated Claims, the OP obtains the claims from the CPs and returns them
by value. With Distributed Claims, the OP returns references and access
information so that the RP can obtain the claim values.

OpenID Connect Core defines the representation of Aggregated Claims returned by an OpenID
Provider to a Relying Party, but does not prescribe the OP-to-CP protocol for obtaining the JWT
used in that representation. In particular, it does not require the JWT to be a UserInfo
response. This specification provides implementation guidance for that interaction and defines
an OAuth-protected Claims Endpoint, together with discovery, authorization, account binding,
storage, disclosure, and verification requirements. Its scope is Aggregated Claims; the endpoint
used by an RP to retrieve Distributed Claims in Section 5.6.2 of [OpenID.Core] is distinct from the
OP-to-CP collection interface defined here.

The Claims Endpoint separates OP-facing account-binding information from the CP-signed Claim
Set disclosed to the RP. This permits a Claim Set without a `sub` claim: the OP verifies the CP
account association when collecting it and preserves that association when storing and
disclosing it. As described in (#trust-model), the RP relies on the OP for Subject
binding. Omitting `sub` does not prevent correlation through reuse of the same JWT or
through identifying attributes. The Subject can authorize reuse of
stored Claim Sets or request new issuance. Privacy Considerations describes the
tradeoffs for privacy and availability.

During Setup, the Subject authorizes the OP to collect claims from a specific CP.
The Subject can authorize collection before choosing an RP.

The Subject separately authorizes the OP to disclose claims to each RP.
(#subject-granting) describes how the OP obtains and reuses RP-specific authorization.
When prior CP authorizations still cover collection, the OP can avoid new CP consent
screens during an RP request.

The OP obtains an access token and, if needed and granted, a refresh token. The CP's Claims
Endpoint returns signed Claim Sets separately from OP-facing account-binding information.
Profiles and trust frameworks may require the use of refresh tokens.


The specification has four phases.

1. Discovery Phase. The OP discovers CP metadata.
1. Client Configuration Phase. The OP establishes itself as a client of the CP.
1. Setup Phase. The Subject authorizes the OP to obtain claims from the CP. The OP
   obtains an access token and may obtain a refresh token.
1. Delivery Phase (RP Phase). The RP sends an authentication and claims request to
   the OP. The OP obtains any needed Claim Sets from the CPs and returns Aggregated
   Claims. The RP verifies the response.

This document is intended for developers and systems architects who build
systems that use attributes and claims.



.# Notational Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in BCP
14 ([RFC2119] and [RFC8174]) when, and only when, they appear in all
capitals, as shown here.

List item numbers are local to each section. Cite an item by its section number and
item number, separated by a hyphen. For example, 9.6-4 refers to item 4 in Section 9.6.

{mainmatter}

# Scope

This document specifies the following interactions.

* The OP discovers CP metadata.
* The OP establishes itself as a client of the CP.
* The OP obtains claims from the CP.
* The RP requests claims from the OP.
* The OP returns claims from the CP to the RP as Aggregated Claims.
* The RP verifies the returned claims.

# Normative references
The following referenced documents are indispensable for the application of this document. For dated references, only the edition cited applied. For undated references, the latest edition of the referenced document (including any amendments) applies.

[RFC2119] - Key words for use in RFCs to Indicate Requirement Levels
[RFC2119]: https://www.rfc-editor.org/rfc/rfc2119.html

[RFC6749] - The OAuth 2.0 Authorization Framework
[RFC6749]: https://www.rfc-editor.org/rfc/rfc6749.html

[RFC6750] - The OAuth 2.0 Authorization Framework: Bearer Token Usage
[RFC6750]: https://www.rfc-editor.org/rfc/rfc6750.html

[RFC6838] - Media Type Specifications and Registration Procedures
[RFC6838]: https://www.rfc-editor.org/rfc/rfc6838.html

[RFC7009] - OAuth 2.0 Token Revocation
[RFC7009]: https://www.rfc-editor.org/rfc/rfc7009.html

[RFC7515] - JSON Web Signature (JWS)
[RFC7515]: https://www.rfc-editor.org/rfc/rfc7515.html

[RFC7518] - JSON Web Algorithms (JWA)
[RFC7518]: https://www.rfc-editor.org/rfc/rfc7518.html

[RFC7519] - JSON Web Token (JWT)
[RFC7519]: https://www.rfc-editor.org/rfc/rfc7519.html

[RFC7636] - Proof Key for Code Exchange by OAuth Public Clients
[RFC7636]: https://www.rfc-editor.org/rfc/rfc7636.html

[RFC8174] - Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words
[RFC8174]: https://www.rfc-editor.org/rfc/rfc8174.html

[RFC8414] - OAuth 2.0 Authorization Server Metadata
[RFC8414]: https://www.rfc-editor.org/rfc/rfc8414.html

[RFC8705] - OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens
[RFC8705]: https://www.rfc-editor.org/rfc/rfc8705.html

[RFC8725] - JSON Web Token Best Current Practices
[RFC8725]: https://www.rfc-editor.org/rfc/rfc8725.html

[RFC9207] - OAuth 2.0 Authorization Server Issuer Identification
[RFC9207]: https://www.rfc-editor.org/rfc/rfc9207.html

[RFC9449] - OAuth 2.0 Demonstrating Proof of Possession (DPoP)
[RFC9449]: https://www.rfc-editor.org/rfc/rfc9449.html

[RFC9700] - Best Current Practice for OAuth 2.0 Security
[RFC9700]: https://www.rfc-editor.org/rfc/rfc9700.html

[RFC10070] - Updates to OAuth 2.0 JSON Web Token (JWT) Client Authentication and Assertion-Based Authorization Grants
[RFC10070]: https://www.rfc-editor.org/rfc/rfc10070.html

[OpenID.Core] - OpenID Connect Core 1.0 incorporating errata set 2
[OpenID.Core]: https://openid.net/specs/openid-connect-core-1_0.html

[OpenID.Discovery] - OpenID Connect Discovery 1.0
[OpenID.Discovery]: https://openid.net/specs/openid-connect-discovery-1_0.html

[OpenID.Registration] - OpenID Connect Dynamic Client Registration 1.0 incorporating errata set 2
[OpenID.Registration]: https://openid.net/specs/openid-connect-registration-1_0.html

[OpenID.Federation] - OpenID Federation 1.0
[OpenID.Federation]: https://openid.net/specs/openid-federation-1_0.html

[OpenID4IDA] - OpenID Connect for Identity Assurance 1.0 incorporating errata set 1
[OpenID4IDA]: https://openid.net/specs/openid-connect-4-identity-assurance-1_0-errata1.html

# Terms and definitions
For the purpose of this document, the terms defined in [RFC6749], [RFC6750], [RFC7636], [OpenID.Core], and the following apply.

**Aggregated Claims** – claims asserted by a CP and returned by an OP using the
representation defined in Section 5.6.2 of [OpenID.Core]

**Claim Set** – a CP-signed JWT containing claims issued through the CP's Claims Endpoint

# Symbols and abbreviated terms

**RP** – Relying Party

**OP** – OpenID Provider

**CP** – Claims Provider

**HTTP** - Hypertext Transfer Protocol

**TLS** - Transport Layer Security

**JWT** – JSON Web Token

**JWS** – JSON Web Signature

**JWA** – JSON Web Algorithms

# Actors

## Example Interaction

The following example shows one CP and one RP. The OP discovers the CP
and establishes client registration before this exchange. See
(#discovery-phase) and (#client-configuration-phase).

~~~ mermaid
---
config:
  theme: neutral
  sequence:
    mirrorActors: false
---
sequenceDiagram
    autonumber
    actor S as Subject
    participant CP as Claims Provider (CP)
    participant OP as OpenID Provider (OP)
    participant RP as Relying Party (RP)

    rect rgb(243, 245, 248)
        Note over S,OP: Setup: authorize collection from the CP
        OP->>CP: Authorization request via user agent<br/>(state, PKCE S256)
        CP->>S: Show collection consent dialogue
        S-->>CP: Authorize collection
        CP-->>OP: Authorization response via user agent<br/>(code, state, iss)
        OP->>CP: Token request<br/>(code, code_verifier, client authentication)
        CP-->>OP: ID Token and access token<br/>(optional refresh token)
        OP->>OP: Validate the ID Token and bind the CP account
    end

    rect rgb(243, 245, 248)
        Note over CP,RP: Delivery: authorize and return claims to the RP
        RP->>OP: OpenID Connect Authentication<br/>Request (claims)
        opt OP needs new disclosure authorization
            OP->>S: Present the RP, claims and sources
            S-->>OP: Authorize disclosure to the RP
        end
        alt Suitable stored Claim Set
            OP->>OP: Check the stored Claim Set and current authorization
        else New collection needed (successful result shown)
            OP->>CP: POST to Claims Endpoint<br/>(access token, nonce, claims, signing_alg)
            CP-->>OP: Collection response<br/>(nonce, account_ref, claim_set)
            OP->>OP: Validate the response and preserve the binding
        end
        OP-->>RP: ID Token or UserInfo response<br/>(signed Claim Set in _claim_sources)
        RP->>RP: Validate the OP response and Claim Set
    end
~~~
Figure: Example of Setup, Claim Set collection, and delivery

Messages 1–7 illustrate (#setup-phase).

Messages 8–10 illustrate (#claims-request-by-rp-to-op) and (#subject-granting).

Message 11 illustrates reuse of a stored Claim Set under (#claims-collection).
Messages 12–14 illustrate (#claims-endpoint-request) and (#claims-endpoint-response).

Message 15 illustrates (#claims-delivery). Message 16 illustrates (#claims-verification).


## Subject (User)

The Subject authorizes a CP to give the OP access to claims.
The Subject directs the OP to collect those claims and can authorize storage for later use.

The OP can combine claims from several sources for disclosure under the Subject's direction.
The Subject can authorize collection before choosing which RPs will receive the claims.
The Subject can let an RP request claims from the OP to obtain a service.
(#subject-granting) describes how the Subject authorizes disclosure to an RP.

## RP

An RP typically provides a service to the Subject.
It requests claims about the Subject from the OP to provide that service.
The RP can rely on contract performance, consent, or another lawful basis to process the claims.

## CP

The Claims Provider (CP) is an OpenID Provider that accepts the aggregating OP as a client.
The CP obtains the Subject's authorization for collection during Setup.
It issues signed Claim Sets through its Claims Endpoint.
The CP also supplies the account reference that the OP uses to associate each set with the Subject.

## OP

The aggregating OpenID Provider (OP) acts as an OpenID Connect client of the CP.
It serves RPs as their OpenID Provider.
At the Subject's direction, it collects Claim Sets and can store them for later use.
It associates each Claim Set with the Subject's OP account.
It returns the CP's signed Claim Sets as Aggregated Claims to RPs that the Subject authorizes.



# Trust Model

The RP relies on the OP to link each CP-signed Claim Set to the authenticated Subject.
The RP validates the enclosing ID Token or UserInfo response under [OpenID.Core].
The RP verifies the CP-signed Claim Set separately under (#claims-verification).
The OP asserts that each included Claim Set concerns the Subject in the enclosing response's `sub` claim.

1. The OP MUST obtain the CP's `iss` and `sub` from the validated Setup ID Token.
2. The OP MUST bind those identifiers to the authenticated OP account that initiated Setup.
3. The OP MUST bind the corresponding CP grant to the same OP account.
4. The OP MUST bind the grant's access and refresh tokens to the same OP account.
5. The OP MUST preserve that binding when refreshing tokens.
6. The OP MUST preserve that binding when downscoping tokens.
7. The OP MUST use CP tokens only for their bound OP account.
8. The OP MUST use Claim Sets it obtains with those tokens only for that account.

The OP checks the binding at collection as specified in (#claims-endpoint-response).
The binding also applies to stored Claim Sets.

The OP and CP establish trust for client registration through [OpenID.Federation].
The CP grant authorizes collection. The Subject authorizes disclosure to each RP under (#subject-granting).

9. The RP MUST apply its trust policy to decide whether to trust the OP's Subject binding.
10. The RP MUST apply its trust policy to decide whether to trust each CP for the claims it uses.
11. The RP MAY use [OpenID.Federation] to establish trust in either party.

A deployment can use Federation Trust Marks to indicate conformance with its trust framework.
The CP-signed JWT contains no CP Subject Identifier.
The RP relies on the enclosing response and the OP's protected binding to establish which Subject the claims concern.

12. The OP MUST NOT establish an account binding solely from a JWT it imports from another source.
13. The OP MUST restore the protected binding record when it restores a stored Claim Set.
14. The OP MUST validate the protected binding record when it restores a stored Claim Set.

An exported Claim Set retains its OP audience.
Profiles can define additional Subject binding or presentation-time authentication requirements.

# Discovery Phase

## CP Discovery and Metadata

The OP obtains the CP's endpoints before it sends the Setup authorization request.
[OpenID.Discovery] and [OpenID.Federation] govern issuer validation for their metadata mechanisms.

1. The OP MUST use validated metadata for the selected CP Issuer Identifier in each Setup transaction.
2. The OP MUST require an equivalent validated issuer binding from any other metadata source.
3. The OP MUST obtain the Authorization, Token, and Claims Endpoints only from metadata bound to the validated issuer.
4. The OP MUST keep each resolved endpoint bound to the selected CP issuer throughout Setup.
5. The OP MAY reuse cached metadata for that issuer while the applicable validity conditions hold.
6. The OP MUST obtain fresh, validated metadata before continuing Setup once those conditions no longer hold.
7. The OP MUST successfully reevaluate CP trust before continuing Setup if the applicable trust rules require it.

The metadata mechanism governs cache validity. [OpenID.Federation] also governs Trust Chain validity.

The following parameters apply to the CP's `openid_provider` metadata.

8. The CP MUST publish the HTTPS Claims Endpoint URL in `claims_endpoint`.
9. The CP MUST omit URL fragments from `claims_endpoint`.
10. The CP MUST list its Claim Set signing algorithms in a non-empty JSON array named `claims_signing_alg_values_supported`.
11. The CP MUST advertise only asymmetric JWS signing algorithms in that array.
12. The CP MUST include `RS256` in that array.
13. The CP MUST support each advertised algorithm when the OP selects it in a Claims Endpoint request.
14. The CP MUST set `authorization_response_iss_parameter_supported` to `true`.
15. The CP MUST include `code` in `response_types_supported`.
16. The CP MUST include `S256` in `code_challenge_methods_supported`.
17. The CP MUST include the same values for these parameters in any [OpenID.Discovery] configuration document it publishes.

[RFC9207] defines the authorization response issuer capability.
(#setup-phase) specifies Authorization Code Flow and PKCE for Setup.
The CP advertises Claim Set signing algorithms separately from UserInfo algorithms.

18. The OP MUST keep the Claims Endpoint bound to the validated CP issuer.
19. The OP MUST keep the advertised Claim Set signing algorithms bound to that issuer.
20. The OP MUST abort collection if its local policy permits none of the CP's advertised Claim Set signing algorithms.

### Claims Endpoint

1. The CP MUST expose a Claims Endpoint.

The Claims Endpoint is an OAuth 2.0 protected resource where the OP obtains CP-signed Claim Sets.
The Claims Endpoint differs from the UserInfo and Distributed Claims endpoints in [OpenID.Core].
See (#claims-endpoint-request) and (#claims-endpoint-response) for the wire protocol.

## Claim Set Profile

This profile applies to Claim Sets from the Claims Endpoint.
It uses the JWT `typ` in (#signed-claim-set-format).
The profile defines no new metadata or Authentication Request parameter for negotiating the type.
(#claims-verification) specifies the validation rules.
[RFC7518] defines the signing algorithm `RS256`.

1. Deployments MAY establish OP and RP profile support through configuration, registration arrangements, or a trust framework.
2. The CP MUST support the format in (#signed-claim-set-format).
3. The CP MUST implement `RS256` signing for Claim Sets.
4. The OP MUST implement `RS256` signature verification for Claim Sets.
5. The RP MUST implement `RS256` signature verification for Claim Sets.
6. The OP MUST support selecting `RS256` in Claims Endpoint requests.
7. Implementations MAY support other asymmetric algorithms subject to (#signature-validation).

The following rules apply if Claim Set validation fails.

8. The OP MUST NOT silently fall back to an ID Token, UserInfo JWT, or another profile.
9. The RP MUST NOT silently fall back to an ID Token, UserInfo JWT, or another profile.

Stored JWTs with `sub` require a separate profile and deployment arrangement.

## Aggregating OP Metadata

The following parameters apply to the aggregating OP's `openid_provider` metadata.

1. The OP MUST include `aggregated` in `claim_types_supported`.
2. The OP MUST set `claims_parameter_supported` to `true`.
3. The OP MUST include `S256` in `code_challenge_methods_supported`.
4. The OP MUST advertise these capabilities in any [OpenID.Discovery] configuration document it publishes.
5. The OP MUST support Aggregated Claims as an OpenID Provider under [OpenID.Core].

(#rp-authentication-and-the-request-verification) governs PKCE for RPs.
A CP that only issues Claim Sets to OPs has no obligation to advertise `aggregated`.


# Client Configuration Phase

## Automatic Registration

The OP acts as an OpenID Connect client of the CP.
Automatic Registration includes Trust Chain validation and metadata resolution.

1. The OP MUST use Automatic Registration with the CP as specified in [OpenID.Federation].
2. The CP MUST use Automatic Registration for the OP as specified in [OpenID.Federation].
3. The OP MUST publish `openid_provider` metadata in its Entity Configuration.
4. The OP MUST publish `openid_relying_party` metadata in the same Entity Configuration.
5. The OP MUST use its Entity Identifier as both its Issuer Identifier and its `client_id` at the CP.

For example, an OP with the Issuer Identifier `https://op.example` uses `https://op.example` as its
`client_id` at the CP and publishes its Entity Configuration at
`https://op.example/.well-known/openid-federation`.

## Client Metadata

1. The OP MUST include `policy_uri` in its `openid_relying_party` metadata.

[OpenID.Registration] defines `policy_uri`. The CP uses it in (#cp-consent-dialogue).
(#claims-endpoint-request) governs Claim Set signing algorithm selection.
UserInfo signing and encryption metadata apply to UserInfo responses.

## OP Client Authentication

1. The OP MUST act as a confidential client of the CP.
1. The OP MUST support `private_key_jwt` client authentication.
1. The CP MUST support `private_key_jwt` client authentication.

The OP declares one `token_endpoint_auth_method` in its `openid_relying_party` metadata.
The declaration applies to every CP that uses that Entity Configuration.
[OpenID.Core] defines `private_key_jwt`.
[OpenID.Federation] governs client authentication during Automatic Registration, including PAR.

4. The OP MUST declare `private_key_jwt` in the base profile.
1. The OP MUST authenticate with its declared method at the CP's Token Endpoint.
1. A profile or trust framework MAY require `self_signed_tls_client_auth` for all participating OPs and CPs.
1. The OP MUST declare `self_signed_tls_client_auth` when its profile or trust framework requires it.
1. The OP MUST NOT use `none` or shared-secret client authentication.

mTLS support is optional in the base profile.

The CP advertises these methods in `token_endpoint_auth_methods_supported` in its `openid_provider` metadata.
The following requirements also apply to any [OpenID.Discovery] configuration document the CP publishes.

9. The CP MUST advertise `private_key_jwt`.
1. The CP MUST advertise `self_signed_tls_client_auth` if it supports that method.
1. At other authenticated CP endpoints, the OP MUST use a mutually supported method consistent with resolved metadata.
1. The OP MUST send each authenticated request to the endpoint in the selected CP's validated metadata.

The following requirements apply to `private_key_jwt` at each CP endpoint that uses it.
Examples include the Token, PAR, and revocation endpoints.
Sections 4 and 5 of [RFC10070] specify the audience restriction for JWT client
authentication at the Token and PAR endpoints.

13. The OP MUST set `aud` to the validated CP Issuer Identifier as a string or single-element array.
1. The OP MUST obtain that identifier as specified in (#discovery-phase).
1. The CP MUST reject an assertion if its `aud` fails these requirements.
1. The CP MUST validate the assertion signature with the OP's resolved `openid_relying_party` keys.
1. The OP SHOULD use short-lived assertions.
1. The OP MUST follow any assertion lifetime limits from its profile or trust framework.
1. The CP MUST reject assertion reuse.
1. The CP MUST retain each accepted (`client_id`, `jti`) pair through `exp`, including any permitted clock skew.

An assertion lifetime of a few minutes is one option.

[RFC8705] governs certificate and client binding when the OP uses `self_signed_tls_client_auth`.

21. The CP MUST match the presented certificate against the OP's resolved RP JWK Set at each such endpoint.


# Setup Phase

## OP Collection Authorization

1. The OP MUST collect claims as the CP's OpenID Connect client at the Subject's direction.
2. The OP MUST request the collection grant with `response_type=code` under [OpenID.Core].
3. The OP SHOULD use scopes the CP supports to request claims and collection permissions.
4. The OP SHOULD request only the claims and operations necessary for the Subject's authorized collection purposes.
5. The OP MUST obtain a grant that authorizes Claims Endpoint access for the claims it will request.

The CP or its applicable profile or trust framework maps claim permissions to scopes.
`claims.userinfo` and `claims.id_token` retain their [OpenID.Core] meanings.
A UserInfo-only token does not authorize Claims Endpoint access.
(#trust-model) governs the binding of the grant and tokens to the OP account.

6. When requesting a refresh token for offline collection, the OP MUST include `offline_access` in `scope`.
7. The OP MUST follow the [OpenID.Core] consent rules when requesting offline collection.
8. The CP MUST follow the [OpenID.Core] consent rules when authorizing offline collection.

## CP Consent Dialogue

1. The CP MUST show the Subject a consent dialogue.
2. The CP MUST explain that the OP collects signed Claim Sets for RPs at the Subject's direction.
3. The CP MUST link to the OP's `policy_uri` from its client metadata.
4. The CP MUST require active interaction from the Subject before granting access.
5. The CP MUST explain that the OP can use or disclose collected Claim Sets until expiration, despite grant revocation.
6. The CP MUST explain how the Subject controls further disclosure, including how to stop it at the OP.

(#authorization-withdrawal-and-grant-revocation) describes those controls.

### CP Grant Management

1. The CP SHOULD let the authenticated Subject review standing grants to OPs through a user interface.
1. The CP SHOULD let the authenticated Subject revoke standing grants through that interface.
1. The CP SHOULD show the claims and operations each grant permits in that interface.

## CP Token Issuance and Use

1. The CP SHOULD issue short-lived access tokens.
1. The CP SHOULD set access token lifetimes according to claim sensitivity and exposure.
1. The CP SHOULD restrict each access token to its Claims Endpoint.
1. The CP SHOULD restrict each access token to the claims and operations that the Subject authorizes.

These restrictions apply regardless of the token format. The CP checks resource and access
permissions as specified in (#claims-endpoint-request).

5. The CP SHOULD issue sender-constrained access tokens.
1. The OP SHOULD use sender-constrained access tokens.

The OP and CP can use certificate binding [RFC8705] or DPoP [RFC9449].
The Claims Endpoint applies the relevant proof requirements in (#claims-endpoint-request).
mTLS client authentication alone does not imply certificate-bound access tokens.

7. The CP MUST follow [RFC9700] when it decides whether to issue refresh tokens.
1. The CP MUST apply the refresh token scope and resource binding requirements in [RFC9700].
1. The OP MUST preserve the account binding when it replaces a refresh token.
1. The CP SHOULD support token revocation as specified in [RFC7009].

[RFC6749] governs refresh token authentication and replacement.
The CP can rotate refresh tokens to detect replay.
Token expiration, rotation, and revocation govern further collection.
(#authorization-withdrawal-and-grant-revocation) describes their effect on stored Claim Sets.

## Authorization Request and Transaction Binding

1. The OP MUST authenticate the Subject before starting Setup.
1. The OP MUST create an authorization transaction for Setup.
1. The OP MUST bind the transaction to the authenticated OP account.
1. The OP MUST bind the transaction to the initiating user-agent session.
1. The OP MUST record the selected CP's resolved metadata in the transaction.
1. The OP MUST record its client registration at that CP in the transaction.
1. The OP MUST record the request's `redirect_uri` in the transaction.
1. The OP MUST bind any selected CP connection configuration to the transaction.
1. The OP MUST bind any selected tenant to the transaction.

(#authorization-response-issuer-validation) specifies how the OP binds the selected CP issuer.
The CP identifies Claims Aggregation clients by their `client_id` under (#client-configuration-phase).

10. The OP MUST use [RFC7636] PKCE with an explicit `S256` method for every Setup request.
1. The OP MUST check the validated CP metadata for `S256` support before sending the request.
1. The OP MUST abort Setup if that metadata does not advertise `S256` support.
1. The OP MUST bind the PKCE verifier to the transaction.
1. The CP MUST reject authorization requests from Claims Aggregation clients without an `S256` challenge.
1. The CP MUST apply the authorization server requirements for PKCE in [RFC9700].
1. The OP MUST send an unpredictable, transaction-specific `state` value.
1. The OP MUST securely bind `state` to the transaction and initiating user-agent session.
1. The OP MUST limit the lifetime of each transaction.
1. The OP MUST accept each transaction at most once.
1. The OP MUST reject expired transactions.
1. The OP MUST bind any `nonce` it sends to the transaction.

[OpenID.Core] governs validation of the ID Token's `nonce`.

## Authorization Response Session Validation

The OP applies the response checks after either recovery procedure and before it sends the code.

1. The OP MUST match the returned `state` to the pending transaction before sending the authorization code.
1. The OP MUST verify the completion session's binding to the initiating OP account before sending the code.
1. The OP MUST abort Setup if `state` is missing or either check fails.
1. The OP MUST abort Setup for expired or previously used transactions.
1. The OP MUST NOT establish the OP account from a URL-carried `state` or session identifier alone.
1. The OP MUST NOT establish the user-agent session from a URL-carried `state` or session identifier alone.
1. The OP MUST use one procedure below if the initiating session is unavailable at the redirection endpoint.

**One-time handle.** The following requirements apply when the OP uses a handle.

8. The OP MUST store the authorization response with its pending transaction.
1. The OP MUST generate an unpredictable, short-lived handle for the stored response and transaction.
1. The OP MUST return the user agent to the initiating origin or application with that handle.
1. The OP MUST require the original session cookie or an equivalent session credential from the initiating application.
1. The OP MUST verify that credential's binding to the initiating OP account and transaction.
1. The OP MUST consume the handle at most once.
1. The OP MUST NOT complete Setup based on the handle alone.
1. The OP MUST set the handle to expire no later than the pending transaction.
1. The OP MUST limit the handle's lifetime to the CP code's remaining lifetime if known.
1. If the CP rejects the code as expired, the OP MUST invalidate the handle.
1. If the CP rejects the code as expired, the OP MUST require a new Setup transaction.

**Reauthentication.** The following requirements apply when the OP uses reauthentication.

19. The OP MUST reauthenticate the Subject before sending the authorization code.
1. The OP MUST match the reauthenticated account to the initiating account before sending the authorization code.

The following requirement applies to both procedures.

21. The OP MUST limit further redirection to destinations it controls and attackers cannot override.

## Authorization Response Issuer Validation

1. The CP MUST include the [RFC9207] `iss` parameter in every Setup authorization response.
1. The OP MUST bind the expected issuer from validated CP metadata to the Setup transaction and user-agent session.
1. The OP MUST validate the response `iss` against the bound issuer per [RFC9207] before code exchange.
1. The OP MUST reject any Setup authorization response that omits `iss`.

## Token Request and Account Binding

The following provisions apply to the code exchange.

1. The OP MUST use the client registration bound to the validated transaction.
2. The OP MUST use the `redirect_uri` bound to the validated transaction.
3. The OP MUST use the PKCE verifier bound to the validated transaction.
4. The OP MUST NOT use the response to switch the CP, connection configuration, tenant, or Token Endpoint.

The OP validates the CP's ID Token under [OpenID.Core] before establishing the binding in (#trust-model).

5. The OP MUST establish the account binding before storing the resulting tokens or Claim Sets.
6. The OP MUST establish the account binding before using the resulting tokens or Claim Sets.

The following provisions apply to an existing OP account binding for the same CP issuer.

7. The OP MUST compare the new CP `sub` with the stored value.
8. The OP MUST treat a changed CP `sub` as account relinking.
9. For relinking, the OP MUST obtain explicit confirmation from the authenticated Subject before replacing the binding.

The CP identity here is the validated (`iss`, `sub`) pair.
The OP checks the applicable account namespace. For tenant-scoped accounts, that namespace is the tenant.

10. Before creating a binding, the OP SHOULD check whether another OP account already links to the validated CP identity.

If the OP finds such a binding, the following provisions apply.

11. The OP MUST reject the new binding or require additional verification under its account-linking policy.
12. The OP MUST NOT automatically transfer the existing binding.
13. The OP MUST NOT automatically remove the existing binding.

When the OP chooses verification, the following restriction applies.

14. The OP MUST complete that verification before making CP tokens or Claim Sets available to the new OP account.

Deployments can permit a CP account to link to multiple OP accounts.

15. Such deployments MUST define the conditions for multiple bindings in their account-linking policy.

# Delivery Phase (RP Phase)

## Delivery Overview

The Delivery Phase typically includes the following steps.

1. (Claims Request) The RP sends an OpenID Connect Authentication Request to the OP.
1. (Request Verification) The OP validates the request.
1. (Subject Granting) The OP establishes the Subject's authorization for disclosure
   to the RP as described in (#subject-granting).
1. (Claims Collection) The OP obtains suitable Claim Sets as described in
   (#claims-collection).
1. (Claims Delivery) The OP returns the authorized Aggregated Claims to the RP as
   described in (#claims-delivery).
1. (Claims Verification) The RP verifies the response.

## Claims Request by RP to OP

1. The RP MUST request claims in an Authentication Request under [OpenID.Core].
2. To request individual claims, the RP MUST use `userinfo`, `id_token`, or both in `claims`.
3. The OP MUST support the `claims` parameter.
4. The RP MUST include `policy_uri` in its client metadata.
5. The OP MUST return claims from the selected CPs as Aggregated Claims.

The OP selects CPs associated with the Subject's account.
[OpenID.Core] defines `claims` and `scope`. Selecting a specific CP requires an extension.
[OpenID.Registration] defines `policy_uri`. The OP uses it in (#subject-granting).
(#claims-verification) specifies how the RP evaluates the CP and the age of its Claim Set.


## RP authentication and the request verification

1. The OP MUST apply the redirect URI matching rules in [RFC9700].
1. The OP MUST apply the authorization server requirements for PKCE in [RFC9700].
1. The RP MUST apply the protections against CSRF and authorization code injection in [RFC9700].

This profile adds the following PKCE requirements.

4. The RP MUST use `S256` whenever it uses PKCE.
1. The RP MUST securely bind its transaction-specific PKCE verifier to the initiating client and user agent.
1. The OP MUST reject a public RP's request for an authorization code without an `S256` challenge.
1. The OP MUST reject requests with `code_challenge` unless `code_challenge_method` is explicitly `S256`.

## Subject Granting

[OpenID.Core] governs authentication and `prompt`. The OP validates the request before seeking consent.

1. The OP MUST obtain the Subject's RP-specific authorization before requesting CP authorization on that RP's behalf.
2. The OP MUST obtain the Subject's RP-specific authorization before disclosing any claims to that RP.
3. The OP MUST show a dialogue when it seeks new consent.

The dialogue uses the client metadata that the OP registered or resolved for the RP's `client_id`.

4. The OP MUST identify the requesting RP by its `client_id` in the dialogue.
5. The OP MUST show the RP's `client_name` if that metadata includes it.
6. The OP MUST identify each claim's CP source using the validated CP Issuer Identifier.
7. The OP MUST show all claims it will disclose, including any additional claims in an embedded JWT.
8. The OP MUST tell the Subject that it will disclose the CP Issuer Identifier to the RP.
9. The OP MUST tell the Subject that it will disclose identifying attributes from the JWT to the RP.
10. The OP MUST link to the RP's `policy_uri` from that metadata.
11. The OP MUST obtain the Subject's consent through explicit action.
12. The OP SHOULD prefer RP identity information that the applicable trust framework verifies.
13. The OP MUST NOT present unverified RP identity information as verified.
14. The OP SHOULD select language-tagged display values according to the Subject's language preferences.

A verified `organization_name` or a Trust Mark that attests to the RP's identity can supply display information.
Signed metadata or a valid Trust Mark alone does not verify every displayed name.
[OpenID.Registration] governs language tags and the use of untagged values.
The OP omits `account_ref` from Aggregated Claims as specified in (#claims-endpoint-response).

15. The OP MAY remember a consent decision for the authenticated Subject and requesting RP.
16. The OP MAY use remembered consent instead of a dialogue only for the same authenticated Subject and RP `client_id`.
17. The OP MUST limit remembered consent to the claims that the Subject authorizes.
18. The OP MUST limit remembered consent to authorized CP sources, identified by their validated Issuer Identifiers.
19. The OP MUST NOT use remembered consent after the Subject withdraws it.
20. The OP MUST NOT use the CP grant as consent for RP disclosure.
21. The OP MUST obtain fresh consent for `prompt=consent`.
22. For `prompt=none`, the OP MUST return `consent_required` if it lacks valid consent for the disclosure.

(#authorization-withdrawal-and-grant-revocation) governs withdrawal.
[OpenID.Core] governs other authentication or interaction errors.

## Claims Collection

### Collection and Reuse

1. The OP MAY precollect Claim Sets when both the CP grant and the Subject's authorization permit it.
2. The OP MAY reuse a stored Claim Set only if it meets all validation, authorization, binding, and policy requirements.
3. The OP SHOULD let the authenticated Subject request updated claims from a selected CP.
4. The OP MAY start a new collection using existing Subject authorization and valid CP tokens.
5. The OP MAY apply privacy policies and rate limits to these updates.
6. The OP MUST preserve the original CP-signed JWT when storing or disclosing a Claim Set.
7. The OP SHOULD use the narrowest available access token scope for the claims it needs to collect.

The relevant policies include the OP's collection and storage policies.
Access token renewal alone leaves the stored Claim Set unchanged.

The downscoping recommendation applies when the OP has a refresh token and a suitable narrower scope.
[OpenID.Core] and [RFC6749] govern refresh and downscoping.

8. The OP SHOULD request a downscoped access token when its current token grants more access than collection needs.
9. The OP MUST reestablish trust in the CP before sending requests after the Trust Chain expires.

[OpenID.Federation] governs Trust Chain reevaluation.
The following requirement applies when the OP needs a new Claim Set but cannot obtain it through a valid access or refresh token.

10. The OP MUST obtain the necessary authorization from the Subject at the CP or omit the affected claims.

See (#setup-phase) for obtaining that authorization.

### Token and Claim Set Storage

Protected material includes stored CP access tokens, refresh tokens, and signed Claim Sets.
It also includes private keys for client authentication and proof of possession.

1. The OP MUST prevent unauthorized disclosure of protected material.
2. The OP MUST prevent unauthorized modification of protected material.
3. The OP MUST prevent unauthorized use of protected material.
4. The OP MUST enforce the account and CP bindings in (#trust-model) when accessing stored material.
5. The OP MUST apply these protections to persistent stores, backups, and operational access.
6. The OP MUST prevent unauthorized access to protected material through logs or diagnostics.
7. The OP SHOULD encrypt sensitive stored material at rest.
8. The OP SHOULD protect encryption keys separately from their encrypted data.
9. The OP SHOULD use key isolation to limit the impact of a compromised component.
10. The OP SHOULD use access controls to limit the impact of a compromised component.
11. The OP MAY store signed Claim Sets under these controls.

Deployments choose the storage architecture, including whether the Subject controls the encryption keys.

### Subject Control of Stored Claim Sets

1. The OP MUST provide a Claim Set management user interface to the authenticated Subject.
2. The OP MUST let the Subject inspect stored Claim Sets through that interface.
3. The OP MUST show each stored Claim Set's CP source in that interface.
4. The OP MUST let the Subject delete selected Claim Sets through that interface.
5. The OP MUST let the Subject review collection and RP-specific disclosure authorizations through that interface.
6. The OP MUST let the Subject withdraw collection and RP-specific disclosure authorizations through that interface.
7. The OP MUST distinguish deletion, stopping collection, stopping disclosure, and CP grant revocation in the interface.
8. The OP SHOULD direct the Subject to an available CP grant-management interface.

For a deletion request, the following requirements apply.

9. The OP MUST remove the selected Claim Sets from active stores.
10. The OP MUST NOT disclose retained copies of those deleted Claim Sets.
11. The OP MUST explain the scope of deletion, including any backup retention.
12. The OP MUST explain when deletion takes effect.
13. The OP MUST tell the Subject that deletion at the OP cannot erase copies it already disclosed to RPs.
14. The OP MUST explain that deleting Claim Sets alone leaves collection authorization in effect.

A later authorized collection can obtain those claims again.
(#authorization-withdrawal-and-grant-revocation) explains how the Subject can stop further collection and disclosure.

15. The OP SHOULD NOT automatically recollect deleted claims from the same CP without a new explicit instruction from the Subject.
16. The OP SHOULD offer one action to delete selected Claim Sets and withdraw their corresponding collection authorization.

An RP request or remembered consent does not constitute that instruction.
Backups remain subject to (#token-and-claim-set-storage).

17. Before restoring backup data to active use, the OP MUST apply the Subject's recorded deletion decisions.
18. Before restoring backup data to active use, the OP MUST apply the Subject's recorded withdrawal decisions.

A disclosure history identifies the RP recipients, the disclosed Claim Sets, their CP sources, and the disclosure times.

19. The OP SHOULD let the authenticated Subject review their disclosure history.
20. The OP MUST protect all retained history, including legally retained records, under (#token-and-claim-set-storage).
21. The OP SHOULD minimize the information it retains for disclosure history.

For example, the OP can identify disclosed Claim Sets without retaining their complete signed JWTs.
Applicable legal retention obligations qualify the history deletion and restoration requirements.

22. The OP MUST apply the Subject's deletion controls to disclosure history.
23. The OP MUST apply the Subject's backup-restoration controls to disclosure history.
24. The OP MUST exclude records it retains solely for legal obligations from ordinary viewing and disclosure.
25. The OP MUST restrict access to those records to authorized purposes for meeting those obligations.

26. The OP MAY let the authenticated Subject export stored CP-signed Claim Sets unchanged.
27. The OP SHOULD explain the correlation and onward-transfer risks of exporting Claim Sets.

Exported Claim Sets remain transferable signed personal data. See (#correlation-and-transferable-signed-data).
Their audience, account-binding, and verification requirements continue to apply.
This profile sets no retention deadline for stored Claim Sets.
The Subject can retain expired Claim Sets as records without treating them as valid.
(#claims-verification) governs acceptance and disclosure of Claim Sets.

### Authorization Withdrawal and Grant Revocation

[RFC6749] and [RFC6750] govern grant and token validity for further collection.
[RFC7009] governs token revocation when the CP supports it.
Expiration or revocation of a CP token or grant does not itself invalidate an issued Claim Set.
(#trust-model) governs the account and CP binding of stored Claim Sets.

1. If further collection is necessary, the OP MUST handle token errors through the applicable recovery or reauthorization procedure.
2. The OP MAY disclose an otherwise valid stored Claim Set while the Subject's disclosure authorization remains in effect.
3. The OP MUST stop collection within the scope of the Subject's withdrawal until the Subject authorizes it again.
4. The OP MUST stop disclosure within the scope of the Subject's withdrawal until the Subject authorizes it again.

A withdrawal limited to one RP applies to affected disclosures to that RP.
The Subject can retain private copies after withdrawing disclosure authorization.
The RP applies its own acceptance and freshness policies.
Disclosing an otherwise acceptable stored Claim Set requires no new CP authorization or CP request.

The errors `invalid_token` and `invalid_grant` can have several causes.
Neither error alone establishes the scope of revocation or the validity of a stored Claim Set.
A failed collection or refresh attempt alone does not require suspending disclosure of an otherwise acceptable stored Claim Set.


### Claims Endpoint Request

The Claims Endpoint follows the protected resource rules in [RFC6749].
[RFC6750] governs bearer token presentation and errors.
[RFC9449] governs DPoP presentation and errors.
[RFC8705] governs certificate binding.

1. The OP MUST send an HTTPS POST to the CP's validated `claims_endpoint`.
2. The OP MUST use `application/json` as the request media type.
3. The OP MUST use an access token authorized for the Claims Endpoint.
4. The OP MUST send a JSON object as the request body.
5. The CP MUST reject unrecognized members at the top level of the request.
6. The CP MUST reject duplicate names at the request's top level or within its `claims` object.

The CP compares decoded member names using exact, case-sensitive equality.
An extension can define new request members and how the OP learns that the CP supports them.
The requested claim names inside `claims` follow the attribute omission rules below.

The base request carries `nonce`, `claims`, and `signing_alg`.

7. The OP MUST include a non-empty `nonce` string.
8. The CP MUST reject a request without a non-empty `nonce` string.
9. The OP MUST generate a fresh nonce for each collection operation using a cryptographically secure random number generator.
10. The OP SHOULD use at least 128 bits of random input for the nonce.
11. The OP MUST NOT reuse the RP's authentication nonce.
12. The OP MUST NOT use the nonce as evidence of Subject identity.
13. The OP MUST limit each collection operation's lifetime.

The OP establishes the following bindings before sending the request.

14. The OP MUST bind the nonce to the pending collection operation.
15. The OP MUST bind the nonce to the OP account.
16. The OP MUST bind the nonce to the CP issuer and Subject Identifier from Setup.
17. The OP MUST bind the selected `signing_alg` to the pending operation.

The following requirements apply to the request's claim and algorithm selection.

18. The OP MUST include a non-empty JSON object named `claims`.
19. The OP MUST use member names in `claims` to identify requested top-level claims.
20. The OP MUST set each requested claim's value to `null` in the base profile.
21. The OP MUST NOT request `iss`, `sub`, `aud`, `iat`, `exp`, `nbf`, or `jti` as attributes.
22. The OP MUST include a single asymmetric JWS algorithm in `signing_alg`.
23. The OP MUST select `signing_alg` from the CP's validated `claims_signing_alg_values_supported`.
24. The OP MUST select a `signing_alg` that its policy permits.
25. The CP MUST reject an unsupported `signing_alg`.

Claim-specific query syntax requires an extension. The `claims` member does not expand
the grant's permissions.

For example (the access token and nonce are illustrative):

```http
POST /claims HTTP/1.1
Host: cp.example
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json

{
  "nonce": "request-specific-random-value",
  "claims": {"birthdate": null},
  "signing_alg": "RS256"
}
```

The base request selects top-level claims, not nested fields within a compound claim.
For example, `"claims": {"verified_claims": null}` requests that top-level claim; it does
not convey a selection of particular attributes, evidence, or timestamps within it. A CP
or trust framework can define narrow scopes or output sets for specific uses, but this
specification does not define a general nested query syntax for the Claims Endpoint.
The OP cannot remove nested fields from an already signed Claim Set while preserving the
CP signature. All disclosed contents remain subject to (#subject-granting) and
(#claims-delivery); the OP obtains a suitable Claim Set or omits it when those requirements
cannot be met.

26. The CP MUST limit returned attributes to those that the OP requests and the grant and Subject authorize.
27. The CP MAY omit requested attributes, including for privacy reasons.
28. The CP MUST NOT treat omission of an attribute as an error.
29. The CP MUST NOT imply a reason for omitting an attribute.
30. The CP MUST NOT reject an otherwise valid request solely for an unknown requested attribute name.

For example, omission can reflect attribute absence, missing verification, or a Subject's choice to withhold the attribute.
(#claims-endpoint-response) defines the empty result.

Token and scope errors follow the applicable rules in [RFC6750] and [RFC9449].

31. The CP MUST give token and scope errors precedence over JSON request errors.

The following requirements apply to malformed or unsupported requests, including invalid
request structure and unsupported `signing_alg` values.
An unrecognized top-level member or a duplicate name in either object makes the request malformed.

32. The CP MUST return HTTP 400.
33. The CP MUST use `application/json` as the error response media type.
34. The CP MUST send a JSON object as the error response body.
35. The CP MUST set `error` to `invalid_request` in that object.
36. The CP MAY include a human-readable `error_description` string in that object.

The following privacy requirement applies to all error responses.

37. The CP MUST NOT disclose the account reference, claim values, or sensitive reasons for withholding attributes in errors.

The OP repeats collection for each CP as necessary.

### Claims Endpoint Response

The following requirements apply to a successful response.

1. The CP MUST return HTTP 200.
2. The CP MUST use `application/json` as the response media type.
3. The CP MUST send `Cache-Control: no-store`.
4. The CP MUST use a JSON object as the response body.
5. The CP MUST echo the associated request's `nonce` unchanged.

The base response also carries `account_ref` and `claim_set` when it supplies attributes.

6. The CP MUST include `claim_set` when it supplies requested attributes.
7. The CP MUST encode `claim_set` as a non-empty string containing the JWT defined in (#signed-claim-set-format).
8. The CP MUST include a non-empty `account_ref` string when it includes `claim_set`.
9. The CP MUST derive `account_ref` from the account that the access token authorizes.
10. The CP MUST set `account_ref` to the Setup ID Token's `sub` for that account and OP.
11. The CP MUST NOT echo a caller-supplied account reference.
12. The CP MUST ensure that all Claim Set attributes concern the account that `account_ref` identifies.
13. The CP MUST omit `claim_set` when it supplies no requested attributes.
14. The CP MUST omit `account_ref` when it omits `claim_set`.
15. The CP MUST NOT represent an empty result with `null`, an empty string, or a protocol-only JWT.

The following successful response carries the Claim Set decoded below.
The account reference and nonce are illustrative, and the compact JWS is abbreviated.

```json
{
  "account_ref": "cp-sub-7f39",
  "nonce": "request-specific-random-value",
  "claim_set": "<CP-signed-JWT>"
}
```

If no requested attributes are supplied, the CP returns HTTP 200 with the same content
type and cache directive. In the base response, the only member is the operation nonce:

```json
{
  "nonce": "request-specific-random-value"
}
```

This empty result reports only that this collection supplied no attributes.

The decoded protected header and payload of that `claim_set` are:

```json
{"typ":"claims-aggregation+jwt","alg":"RS256"}
```

```json
{
  "iss": "https://cp.example",
  "aud": "https://op.example",
  "iat": 1893455940,
  "exp": 1893456240,
  "birthdate": "1990-01-01"
}
```

The example uses the common mandatory-to-implement algorithm `RS256`.
The `valid` test vector in [ClaimsAggregation.TestVectors] provides the complete signed
CP JWT and the signed OP presentation shown in (#claims-delivery), along with the
test keys and instructions for verifying both at 2030-01-01T00:00:00Z.
The response's cache directive prevents HTTP caching; it does not prohibit
Subject-authorized storage under (#claims-collection).

The OP applies the following checks to a purported successful response.

16. The OP MUST reject a response with a status other than HTTP 200.
17. The OP MUST reject a response without the required media type.
18. The OP MUST reject a response whose body fails the specified JSON requirements.
19. The OP MUST NOT treat a response containing `error` as a successful or empty result.
20. The OP MUST reject duplicate top-level member names using the comparison in (#claims-endpoint-request).
21. The OP MUST ignore unrecognized top-level response members other than `error`.
22. The OP MUST NOT forward ignored members to the RP.
23. The OP MUST match the decoded response nonce to the pending operation's nonce using exact, case-sensitive equality.
24. The OP MUST reject responses for expired or completed operations.
25. The OP MUST accept at most one response per operation.
26. The OP MUST NOT rebind a completed operation to a new account or operation.

Ignoring a member leaves the other validation requirements in effect.
An extension establishes OP support before the CP relies on the OP to process an extension member.
The CP does not need a global database of used nonces.

The following requirements apply when the response lacks `claim_set`.

27. The OP MUST reject the response if it contains `account_ref`.
28. The OP MUST treat a valid response without `account_ref` or `claim_set` as an empty result.
29. The OP MUST NOT establish an account binding from an empty result.
30. The OP MUST NOT change an account binding based on an empty result.
31. The OP MUST NOT store an empty result as a Claim Set.
32. The OP MUST NOT disclose an empty result as a Claim Set.
33. The OP MUST NOT infer attribute absence from an empty result.
34. The OP MUST NOT infer grant revocation from an empty result.
35. The OP MUST NOT infer Subject withdrawal from an empty result.
36. The OP MUST NOT invalidate an otherwise acceptable stored Claim Set solely because collection returns an empty result.
37. The OP MUST NOT suspend disclosure of an otherwise acceptable stored Claim Set solely because collection returns an empty result.

Claim Set validation and storage checks apply only when the response contains a Claim Set.

The OP applies the following checks when the response contains `claim_set`.

38. The OP MUST match `account_ref` exactly to the validated Setup `sub` for the operation's OP account and CP issuer.
39. The OP MUST NOT derive the expected `sub` from the response or access token.
40. The OP MUST NOT replace the expected `sub` with a value from the response or access token.

The OP validates `claim_set` as required by (#verification-responsibilities).

41. The OP MUST match the JWT's `iss` to the operation's CP issuer.
42. The OP MUST verify that the JWT contains at least one requested attribute.
43. The OP MUST verify that it requested every returned attribute.
44. The OP MUST verify that its authorization covers every returned attribute.
45. The OP MUST process the authenticated response, account reference, and exact JWT as one validation unit.
46. The OP MUST NOT recombine those inputs through an unprotected queue or cache.

(#signature-validation) specifies the check against the selected `signing_alg`.
(#token-request-and-account-binding) specifies account relinking.

47. If any response check fails, the OP MUST reject the entire response.
48. The OP MUST NOT store a Claim Set from a rejected response.
49. The OP MUST NOT disclose a Claim Set from a rejected response.

Omitting a claim from `_claim_names` cannot hide it from an RP receiving the JWT.
For these checks, attributes exclude `iss`, `aud`, `iat`, `exp`, `nbf`, and `jti`.
(#claims-verification) governs those protocol claims.

The OP preserves the validated association in a protected acquisition record.

50. The OP MUST retain a protected acquisition record for each successfully collected Claim Set.
51. The OP MUST record the OP account in the acquisition record.
52. The OP MUST record the CP issuer and Subject Identifier in the acquisition record.
53. The OP MUST record the acquisition validation result in the acquisition record.
54. The OP MUST record the acquisition validation time in the acquisition record.
55. The OP MUST protect the integrity of the acquisition record.
56. The OP MUST protect the record's association with the exact JWT.

A hash stored alongside unprotected data does not by itself provide that protection. A
deployment crossing an untrusted processing or storage boundary needs integrity protection
across that boundary. For example, an authenticated storage service can enforce this
association, or a MAC or signature can protect a record covering both the JWT and binding
fields when the storage itself is not trusted. An additional CP-signed receipt can be
defined by a profile where independent evidence of acquisition is needed. The deployment
cases and limits of that additional evidence are discussed in
(#acquisition-response-integrity).

The OP applies the following checks before redisclosing a stored Claim Set.

57. The OP MUST validate the protected acquisition record.
58. The OP MUST verify that the current authorization permits disclosure.
59. The OP MUST verify that the Subject has not deleted the Claim Set.
60. The OP MUST verify that the Subject has not withdrawn authorization for this disclosure.

(#verification-responsibilities) requires validation of the stored Claim Set before disclosure.
A successful acquisition does not waive later key, trust, expiration, or freshness checks.
Reusing a stored Claim Set does not require a new CP operation nonce or CP contact.

61. The OP MUST omit the acquisition envelope from the Aggregated Claims response.
62. The OP MUST omit `account_ref` from the Aggregated Claims response.
63. The OP MUST omit the operation nonce from the Aggregated Claims response.

#### Signed Claim Set Format

1. The CP MUST issue each Claim Set as a compact, asymmetrically signed JWS containing a JSON object.
1. The CP MUST set the protected header's `typ` to `claims-aggregation+jwt`.

[RFC7515] permits omission of the media type's `application/` prefix in `typ`.
This type identifies the inner Claim Set within the acquisition envelope or the OP's response.

3. The CP MUST include `iss`, `aud`, `iat`, and `exp` in the payload.
1. The CP MUST set `iss` to its validated Issuer Identifier.
1. The CP MUST set `aud` to the OP's Entity Identifier as a string or single-element array.
1. The CP MUST encode `iat` and `exp` as NumericDate values defined in [RFC7519].
1. The CP MUST set `exp` to a time later than `iat`.

The OP uses its Entity Identifier as described in (#client-configuration-phase).
These timestamps describe JWT issuance and expiration. Attribute verification can occur at a different time.

8. The CP MUST omit `sub` from the Claim Set.
1. The CP MUST omit `account_ref` from the Claim Set.
1. The CP MUST omit equivalent CP account identifiers that it uses for account binding.

The Subject can authorize disclosure of identifying attributes.
(#correlation-and-transferable-signed-data) describes their correlation risks.

11. The CP MUST place claims for the RP in top-level JWT members.
1. The CP MUST sign the JWT with the `signing_alg` it accepts in the Claims Endpoint request.

The OP can reference those claims in `_claim_names` as specified in [OpenID.Core].
The format uses no holder proof or per-presentation identifier.
It does not require a `jti` claim.

The name Claims Endpoint and the metadata names `claims_endpoint` and
`claims_signing_alg_values_supported` restore terminology from an earlier draft.
This profile separates the OP-facing account reference from the signed JWT that the RP receives.

See (#iana-considerations) for the CP metadata and Claim Set media type registration requests.

[[ Editor's note: The registration templates are defined below; formal registration has
not yet been completed. Before submission, references must identify a stable, publicly
available specification version. Previous use of a name in a draft is not a registration. ]]

### JSON Member Handling Examples

Some JSON parsers silently keep a single value for a repeated member name. Implementers
can use a parser with duplicate-name detection or check decoded names as the parser emits
them, before converting the object to a map. Checking the resulting map cannot detect
duplicates that the parser already discarded. For the response, these envelope checks
apply to the top-level JSON object. The `claim_set` string is validated separately under
(#claims-verification).

The following fragments illustrate member handling. Each fragment is added to an
otherwise valid message unless indicated.

| Message | JSON fragment or body | Expected handling |
| --- | --- | --- |
| Request with an unrecognized top-level member | `"example_option": true` | Reject with `invalid_request`. |
| Request with an unavailable attribute name | `"claims": {"example_attribute": null}` (replacing the original selection) | Process normally and omit the unavailable attribute. |
| Request with an unsupported query value | `"claims": {"birthdate": {"essential": true}}` (replacing the original selection) | Reject with `invalid_request`. |
| HTTP 200 response with an extra member | `"example_hint": "informational"` | Ignore the extra member and apply all applicable response checks. |
| HTTP 200 response with a duplicate member | `{"nonce":"first","nonce":"second"}` (entire body) | Reject the response. |
| HTTP 200 response with an error member | `{"nonce":"request-specific-random-value","error":"invalid_request"}` (entire body) | Reject the response as a successful result, including as an empty result. |

## Claims Delivery

[OpenID.Core] governs claim destinations, omission rules, and the Aggregated Claims representation.

1. The OP MUST apply the applicable request constraints to each response.
2. The OP MUST omit `_claim_names` entries for claims it cannot supply in an authorized, valid Claim Set.
3. The OP MUST limit each embedded JWT to claims the Subject authorizes for disclosure to that RP.
4. The OP MUST replace or omit any Claim Set with claims outside the RP's disclosure authorization.
5. The OP MUST preserve mappings for other claims it returns, including Distributed Claims.
6. The OP MUST preserve the sources that those mappings reference.
7. The OP MUST omit each `_claim_sources` entry that no remaining `_claim_names` entry references.
8. If `_claim_names` would be empty, the OP MUST omit both `_claim_names` and `_claim_sources`.
9. The OP MUST NOT forward CP error details to explain an omission.
10. The RP MUST enforce its application's required-claim policy before completing the requested operation.

The RP receives all claims in the embedded JWT, including claims without a mapping in `_claim_names`.
(#authorization-withdrawal-and-grant-revocation) specifies when the OP can use previously collected Claim Sets.
The `essential` flag alone does not make an omission an authentication error under [OpenID.Core].

For example, the RP requests `birthdate` and `address` in the ID Token:

```json
{
  "id_token": {
    "birthdate": null,
    "address": {"essential": true}
  }
}
```

The CP supplies only `birthdate`. The OP returns the following presentation.
Only `birthdate` has a `_claim_names` mapping, and the response contains only
the source referenced by that mapping. If the RP requires `address` for its
operation, it does not complete that operation.

The decoded OP presentation below embeds the same CP-signed JWT received in
`claim_set` in (#claims-endpoint-response), without changing its compact JWS
serialization. The inner JWS is abbreviated here. When the OP returns the
Aggregated Claims in an ID Token, the normal ID Token requirements still apply.

```json
{
  "iss": "https://op.example",
  "sub": "op-vector-subject",
  "aud": "rp-client",
  "iat": 1893455999,
  "exp": 1893456060,
  "_claim_names": {"birthdate": "cp1"},
  "_claim_sources": {"cp1": {"JWT": "<CP-signed-JWT>"}}
}
```

The enclosing `sub` identifies the Subject at the OP. The CP's `account_ref` and acquisition
nonce are not included in the embedded JWT or passed on as acquisition evidence to the RP.

11. The OP SHOULD return Aggregated Claims in a Token Endpoint ID Token or a UserInfo response.

This limits the front-channel exposure described in (#rp-request-integrity-and-broker-side-consent).

## Claims Verification

### Verification Responsibilities

1. The OP MUST obtain Claim Sets from the CP's Claims Endpoint.
2. The OP MUST NOT substitute a Setup ID Token, a refreshed ID Token, or a UserInfo JWT.
3. The OP MUST validate each CP-signed Claim Set when collecting it.
4. The OP MUST validate each stored Claim Set before disclosing it.
5. The RP MUST validate each embedded CP-signed JWT before accepting any claim from it.

### CP Metadata and Verification Keys

The following sources supply CP metadata and its verification keys.

- [OpenID.Discovery] supplies validated provider metadata and application keys via `jwks_uri`.
- [OpenID.Federation] supplies application signing keys in resolved `openid_provider` metadata.
- Trusted deployment configuration or a trust framework can provision metadata and keys for a CP issuer.

1. The verifier MUST obtain the CP's metadata and verification keys from one of these sources.
2. The verifier MUST select a source according to its trust policy for the CP.
3. The verifier MUST NOT substitute Federation Entity Keys for the CP's application signing keys.
4. The verifier MUST match the JWT's `iss` exactly to the CP issuer in validated metadata or trusted configuration.
5. The verifier MAY use unverified `iss` for key resolution only as its issuer acceptance and network policies permit.
6. The verifier MUST associate the CP's metadata and keys with that issuer, including in caches.
7. The verifier MUST apply the applicable validity requirements to metadata and keys.
8. The verifier MUST apply the applicable trust reevaluation requirements to metadata and keys.
9. The verifier MUST NOT rely on key discovery or signature verification alone to trust a CP for claims.
10. The verifier MUST NOT rely on prior validation if the signing key becomes unavailable or untrusted.
11. In that case, the OP MUST obtain a replacement Claim Set from the CP or omit the affected set.

12. The CP MUST apply the key-to-algorithm binding rules in [RFC8725] when signing Claim Sets.
13. The CP MUST publish each Claim Set signing key's algorithm in every advertised JWK's `alg`.
14. The CP SHOULD keep retired public keys available through its advertised key sources until their signed Claim Sets expire.
15. The CP SHOULD include its clock-skew allowance in that key retention period.
16. The CP MAY withdraw compromised keys earlier under its deployment's key revocation policy.

### Signature Validation

[RFC7515] governs signature verification.

1. The verifier MUST require an asymmetrically signed JWS.
2. The verifier MUST determine its allowed algorithms before verifying the signature.
3. The verifier MUST require `alg` in both local policy and the CP's validated `claims_signing_alg_values_supported`.
4. At acquisition, the OP MUST match `alg` to the `signing_alg` bound to the collection operation.
5. The verifier MUST use a public key bound to the validated CP issuer for signature verification.
6. The verifier MUST honor key type, signing use, and algorithm restrictions when selecting a key.
7. The verifier MUST resolve any `kid` only within the CP's trusted key set.
8. The verifier MUST NOT trust a key source solely because the JWT header identifies it.
9. The verifier MUST bind each key to one algorithm using JWK `alg` or trusted issuer-specific configuration.
10. If the JWK includes `alg`, the verifier MUST match it to the JWT's `alg`.
11. The verifier MUST reject the Claim Set if it cannot establish the key's algorithm binding.

### Claim Validation

The verifier checks claims after validating the signature.
[RFC7519] governs time claim types, expiration, and not-before processing.

1. The verifier MUST require `claims-aggregation+jwt` in the protected header's `typ`.
2. The verifier MUST reject a Claim Set whose payload contains `sub`.
3. The verifier MUST require `iss`, `aud`, `iat`, and `exp`.
4. The verifier MUST require a non-empty string for `iss`.
5. The OP MUST validate the acquisition or stored binding under (#claims-endpoint-response).
6. The verifier MUST require exactly one `aud` value as a string or single-element array.
7. The OP MUST match `aud` exactly to its `client_id` at the CP.
8. The RP MUST match `aud` exactly to the OP issuer it validated through OpenID Connect.
9. The verifier MUST compare issuer and audience identifiers without normalization.
10. The verifier MUST require `exp` to be later than `iat`.
11. The verifier MUST reject a JWT with an `iat` in the future.
12. The verifier MAY allow a small clock skew when comparing times to its clock.
13. The verifier MUST apply any clock-skew allowance consistently to `iat`, `exp`, and `nbf`.

The following requirements apply when the RP receives Aggregated Claims through UserInfo.

14. The RP MUST use the validated OP issuer from the transaction that issued the access token.
15. The RP MUST NOT infer a new issuer from the CP JWT or an unsigned UserInfo response.
16. The RP MUST preserve the OP issuer's association with that access token.

The RP relies on the OP for Subject binding as described in (#trust-model).
The RP follows the same clause when deciding whether to trust the CP.

17. The RP MUST validate the Aggregated Claims structure according to [OpenID.Core].
18. The RP MUST check that each mapped claim appears in its referenced JWT.
19. The RP MUST apply the validation rules for each claim it uses.
20. The OP MUST reject a Claim Set that fails any required check.
21. The OP MUST NOT store an invalid Claim Set.
22. The OP MUST NOT disclose an invalid Claim Set.
23. The RP MUST NOT use claims from an invalid Claim Set.
24. The RP MUST treat claims mapped to an invalid Claim Set as unavailable.
25. The RP MAY reject the entire enclosing response.
26. Profiles MAY require rejection of the entire enclosing response.

The verification rules in (#verification-responsibilities) apply to every Claim Set the RP uses.
(#claims-delivery) specifies when the RP can complete the requested operation.

### Local Freshness Policy and User-Directed Updates

The RP's acceptance checks include Claim Set validation and its freshness policy.

1. The RP MUST apply its application's freshness requirements before using claims.
2. The RP MUST apply its acceptance checks to Claim Sets it uses after OP selection or a user-directed update.
3. The RP MAY enforce a maximum JWT age based on the CP-signed `iat`.
4. If a Claim Set is too old, the RP MUST treat its claims as unavailable for that use.
5. The RP SHOULD explain to the Subject when updated information is necessary.
6. The RP MAY direct the Subject to the OP's claim-management interface to request an update.

The Subject can retry the OpenID Connect interaction after an update.
Retrying authentication alone does not require the OP to recollect claims.

[IDA.Schema] defines the `verified_claims` structure.
Using it does not by itself implement the [OpenID4IDA] query protocol or external assertion format.

Implementations that support [OpenID4IDA] can use its existing request and validation mechanisms.
For example, `max_age` constrains `verification.time` or another requested date or timestamp.

7. The RP MUST evaluate assurance timestamps separately from the JWT's `iat` when it uses [OpenID4IDA] freshness constraints.
8. The OP MAY use supported constraints to select stored Claim Sets.

A new JWT does not show when the CP last verified the claims.
Meeting a verification-age requirement can require renewed verification at the CP.
Mapping constraints into a Claims Endpoint request requires a separate extension or profile.
The base `claims` object accepts only `null` values.
The OP can support [OpenID4IDA] without forwarding constraints or using them to select stored Claim Sets under this specification.
[OpenID4IDA] still governs its implementers' query, filtering, and omission behavior.

The [OpenID4IDA] external assertion format uses `typ=provided-claims+jwt` and requires `sub`.
That format prohibits `aud` and `exp`.

9. The OP MUST NOT rewrite an existing signed assertion to convert it to this profile.

Interoperability with that external assertion format requires a separate profile.


# Security Considerations

## General Security Considerations

The security considerations of [OpenID.Core], [OpenID.Federation], and [RFC8725] apply.

Before verifying the signature, the verifier constrains algorithms and keys under
(#signature-validation) and (#cp-metadata-and-verification-keys). This prevents a JWT
header from selecting an unauthorized algorithm or causing use of a CP public key as a MAC secret.

1. The CP SHOULD consider claim sensitivity, change rate, storage duration, and verification key retention when choosing Claim Set lifetimes.

Short lifetimes require more frequent collection, while long lifetimes extend the period
during which previously issued attributes can be presented. Expiration limits the lifetime
of the signed artifact. It does not guarantee that the underlying attributes remain current
or that the CP's grant remains authorized. Key withdrawal can make a stored Claim Set
unusable before its `exp`, as described in (#cp-metadata-and-verification-keys).

The type and claim rules in (#signed-claim-set-format) distinguish Claim Sets from
ID Tokens and UserInfo JWTs. [RFC8725] describes cross-JWT confusion. A separate URL
or the presence or absence of `nonce` or `auth_time` does not by itself distinguish these JWTs.

## Setup Transaction and Session Integrity

The issuer-based countermeasure in [OAuth.Security.Update] protects connections to
multiple CPs. (#cp-discovery-and-metadata) binds metadata to the selected issuer.
(#authorization-response-issuer-validation) checks that issuer before code exchange.
That check also addresses the mix-up risk in [RFC9700].
(#token-request-and-account-binding) preserves the selected client and any connection or tenant context.

PKCE binds the code to the OP's token request under (#authorization-request-and-transaction-binding).
An attacker can still initiate Setup for the attacker's OP account and induce a victim to
authorize access to the victim's CP account. PKCE alone does not detect this cross-user session fixation attack, described in
Section 2.3 of [OAuth.Security.Update], with countermeasures in Section 2.3.2. Before
exchanging the code, the OP verifies the completion session's binding under
(#authorization-response-session-validation). A valid `state` received through a URL is insufficient
without this session validation. Comparing a previously stored CP subject identifier detects account
changes. Checking for the same CP (`iss`, `sub`) on another OP account can also detect an
attempted new binding when that CP identity is already known to the OP. Neither check
establishes a relationship for a CP identity that has never been linked at the OP. The trust
assumptions in (#trust-model) continue to apply.

## RP Request Integrity and Broker-Side Consent

The checks in (#rp-authentication-and-the-request-verification) apply to signed and unsigned requests.

The OP brokers requests between RPs and CPs using the broker-side consent approach
in [OAuth.Security.Update]. The CP grant authorizes collection, and the Subject's
authorization at the OP governs RP disclosure. (#subject-granting) covers both
RP-triggered collection and reuse. The Subject can withdraw authorization under
(#authorization-withdrawal-and-grant-revocation) even if the CP grant remains valid.
Pre-collection can keep the recipient RP and its activity timing from the CP.

An ID Token returned from the Authorization Endpoint can expose embedded CP-signed Claim
Sets to browser scripts and front-channel response handling. Depending on the response
mode and implementation, those artifacts can persist in URLs, including fragments, browser
history, or application and diagnostic logs. Unlike an authorization code, the signed
personal data can be copied and presented to other parties, subject to their acceptance
checks. The back-channel delivery recommendation in (#claims-delivery) reduces this
exposure; it does not prevent an RP that receives a Claim Set from copying it. This is an
additional reason to minimize front-channel exposure alongside the leakage risks discussed
in Sections 4.2 and 4.3 of [RFC9700].

## Audience Binding

The Claim Set audience identifies the OP that obtained it. The RP checks that audience
under (#claim-validation) and applies its CP trust policy.

1. The CP MUST establish the client under (#client-configuration-phase) before issuing a Claim Set.
2. The CP MUST NOT let another client use that `client_id`, including through a separate registration.

## Cross-User Claim Substitution

A compromised or malicious OP can include a Claim Set for one Subject in a response for
another Subject. The substituted Claim Set can have a valid CP signature and the expected OP
audience. The RP's signature and audience checks therefore cannot detect this substitution.
The trust model in (#trust-model) relies on the OP to preserve the account binding through
collection, storage, and disclosure. A Federation Trust Mark can attest to an OP's compliance
with operational requirements. It does not prove the account binding for a particular response.

## Acquisition Response Integrity

### Operation and Response Binding

The collection nonce correlates an authenticated CP response with a pending OP operation; it
is not an access credential or an issuance-idempotency key. The CP may process a retried
request more than once, but the OP accepts at most one response for its pending operation. A
holder of a stolen bearer token can request additional Claim Sets with new nonces, so a CP
nonce database would not prevent that use. TLS server authentication and the token
protections in (#cp-token-issuance-and-use) address that threat.

1. The OP MUST validate the CP endpoint's TLS server identity.

Deployments can impose issuance rate limits without making every CP maintain a shared
nonce-replay database.

The OP binds the selected signing algorithm to the operation before sending the request
and checks the returned JWT against it. A request or response that traverses an untrusted
internal processing boundary needs integrity protection across that boundary as described
in (#claims-endpoint-response); token sender-constraining alone does not authenticate
arbitrary JSON request or response bodies across such a boundary.

### Trusted Collection and Protected Handoffs

The trusted collection boundary includes the components the deployment relies on to preserve two inputs:

- The authenticated CP response.
- The operation context that the OP selected independently.

Those components preserve both inputs until a trusted component validates the response
and protects the resulting binding record. The deployment identifies which components
it trusts and which compromises it aims to withstand. Common ownership, an OP-managed
label, and the number of TLS connections are insufficient on their own. Access controls,
account and tenant separation, and authenticated handoffs help enforce the boundary.

The base protections suffice when a trusted OP collector receives the response over
authenticated TLS, checks it under (#claims-endpoint-response), and protects the
complete association between the account and the JWT. The account check compares
`account_ref` with the CP's `sub` from the validated Setup ID Token. The CP-signed JWT
contains no CP Subject Identifier that could independently confirm the association.

A TLS-terminating gateway can be part of the trusted collector if the deployment trusts
it to preserve the response and operation context. A deployment that aims to withstand
compromise of that gateway places it outside the trusted collection boundary.

A trusted collector can validate the response and protect the complete binding record
before handing it to a queue, cache, or object store outside the boundary. The trusted
consumer then verifies that record. An extra CP signature is unnecessary for that
handoff alone.

An OP MAC, signature, or suitably bound authenticated encryption can protect the exact
JWT together with its OP account, CP identifiers, and acquisition context.
(#claims-endpoint-response) requires protection of the association as well as the JWT.
On backup restoration, the OP applies the current deletion and withdrawal decisions
under (#subject-control-of-stored-claim-sets). An authentic older record can predate
those decisions.

### Additional CP-Origin Evidence

An additional CP signature can help when a TLS terminator outside the trusted collection
boundary can alter the response before an honest OP component validates it.

For example, a gateway could pair a valid Claim Set for CP account B with an acquisition
envelope for account A. B's JWT can have the expected OP audience, requested attributes,
and selected signing algorithm. The envelope can carry A's `account_ref` and pending
operation nonce. The checks of the account reference and the JWT's issuer, audience,
signature, and lifetime can all pass because the JWT has no CP Subject Identifier.
If the gateway kept B's `account_ref`, the account comparison would fail.
A MAC that the OP adds after substitution protects the pairing it received.
It cannot establish that the CP supplied that pairing.

The trusted validator needs to verify that the CP supplied the association between the
account and the exact Claim Set. A CP-signed envelope or receipt can provide that
evidence. An authenticated connection from the CP to the trusted
validator can also protect it if the connection keeps the plaintext from the intermediary.
The need for extra evidence depends on which components the deployment trusts.

An independently authorized auditor can also need evidence that the CP associated an
account with a particular JWT. The relevant evidence depends on the audit question and
policy:

- An OP signature can provide the evidence if the audit policy accepts records that the OP creates.
- The existing Claim Set signature shows which attributes the CP signed.
- A CP-signed receipt can show which account the CP associated with the Claim Set.
  This is useful when the auditor needs evidence from the CP.

This audit use requires a separately authorized purpose for access to stable CP account
references and acquisition records. That access also requires minimization and retention
controls. Normal RP disclosure follows (#trust-model).

### Receipt Scope and Reuse Limits

A separate receipt profile would need to bind the following values to the exact signed
Claim Set or to a collision-resistant commitment to it:

- A distinct receipt purpose.
- The CP issuer.
- The recipient OP.
- The CP-derived account reference.
- The acquisition operation nonce.

The OP uses one identifier here. Its Entity Identifier, Issuer Identifier, and CP-facing
`client_id` are equal. A commitment would specify its algorithm and byte representation.
Using the exact compact JWS avoids reserializing decoded claims. The proof protects the
pairing only if it covers both the account reference and the JWT or its commitment.

A receipt profile would also need to specify trusted key and algorithm selection,
pending-operation checks, and what to do if a required proof is missing or stripped.
It would define how to handle empty results. This specification defines no receipt
format, parameter, or mandatory additional CP signature.

A verified receipt authenticates a CP statement under the accepted signing key and policy.
It cannot prove that the CP sent an HTTP response or that the OP received or validated it.
It cannot establish the truth of the CP's account association or the Subject's consent to later RP disclosure.
An issuance timestamp does not prove delivery or a new identity check.

The OP still needs its protected account binding. A receipt cannot restore a lost
association with an authenticated OP account. A malicious OP can still violate
(#trust-model). A receipt also cannot prevent misuse of stolen tokens, suppression of
responses, or rollback of authorization state.

A signature provides integrity and evidence of origin. Anyone with the OP's public key
can encrypt to it, so encryption to the OP alone cannot establish CP origin. A deployment
that needs both confidentiality and CP-origin integrity across a boundary needs a design
that protects the contents and authenticates the CP.

The Subject's authorization governs disclosure, including when the OP stores encrypted
data or holds a receipt. The Aggregated Claims response excludes acquisition receipts.
Storage, audit access, and backup handling of receipts remain sensitive-data processing.

If a receipt profile sets an initial acceptance deadline, a late receipt cannot
establish a new acquisition binding.
When the OP validates acquisition in time and preserves the binding in a protected
record, expiry of that deadline alone does not require CP contact or suspension of an
otherwise acceptable stored Claim Set.

A receipt within its acceptance window does not extend the inner JWT's `exp`.
Current key, signature, audience, trust, freshness, and Subject authorization checks still apply.
These rules concern acquisition and storage. They add no presentation-time CP status
check and leave the grant-revocation rules in
(#authorization-withdrawal-and-grant-revocation) in effect.

## CP Credential Exposure and Claim Set Replay

Pre-collection permits an OP to hold a grant that covers future Subject-authorized uses
beyond a single RP request. The least-privilege requirements in (#setup-phase) and
(#claims-collection) limit requested access. Downscoping an access token does not by itself
reduce the authority of the original refresh token. The protections in
(#cp-token-issuance-and-use) and (#token-and-claim-set-storage) address the resulting
concentration of credentials and personal data at the OP.

The assertion audience restriction in (#op-client-authentication) implements the preferred
audience-injection countermeasure in Section 2.1.2.1 of [OAuth.Security.Update]. The OP's
Entity Identifier is its `client_id` at every CP, so uniqueness of client identifiers
across CPs is not an available countermeasure. Using different authentication keys for
different CPs can provide additional isolation only when each CP's accepted key set is
also restricted accordingly. Publishing several keys in a common RP key set does not by
itself establish that isolation.

The OP Entity manages the client authentication keys in this profile. An app on a
device acts as the Entity's user interface or agent. The CP resolves one client identity
and one RP metadata object for the OP's Entity Identifier. This profile does not define
separate enrollment or authentication bindings for each device instance.

Sharing one authentication private key across devices increases the risk of key extraction.
Listing all device keys in the common RP JWK Set can make that set grow without bound.
It can reveal how many devices the OP uses and how often devices are added or removed.
The CP still resolves the same client identity for those keys.

A confidential client can run on a device. Device-generated keys and registration for
each instance can support secure client authentication. Combining these with the common
Entity Identifier, OP issuer, and RP metadata requires a separate profile.

Such a profile could use Explicit Registration or Dynamic Client Registration for each
instance. It could also let the OP Entity attest to each instance's key while it keeps the
Entity Identifier as `client_id`. The profile would need to define the binding between
each instance, its credentials, `client_id`, and the OP issuer. It would also need rules
for selecting the authentication method. Giving an instance a different `client_id` while
keeping a common OP issuer would change the identity relationship in this base profile.
These instance profiles are outside the scope of this specification.

Client authentication and sender-constrained CP access tokens protect collection, not the
subsequent presentation of a signed Claim Set. A Claim Set's audience identifies the OP,
not an individual RP or presentation. An RP or another holder can copy that JWT and send
it elsewhere. To accept the Claim Set, the recipient validates the enclosing response and the Claim Set under
(#claims-verification). The recipient also relies on the account binding described in
(#trust-model). Possession of the embedded JWT alone does not authenticate the Subject.
A short Claim Set lifetime limits the exposure period.
A holder can still copy or reuse the Claim Set before expiration.

Under the trust model in (#trust-model), the RP relies on the OP's account binding and disclosure
controls. These protections neither require per-presentation CP contact nor cause CP grant
revocation to invalidate stored Claim Sets. Storage remains under the Subject's control
within the limits described in (#freshness-and-revocation-limits).

## Freshness and Revocation Limits

The CP's signed `iat` establishes the JWT's age for freshness checks.

1. The verifier MUST NOT substitute an OP collection timestamp or enclosing ID Token `iat` for the CP-signed `iat`.

A CP can issue a new JWT containing attributes verified earlier. Applications needing
freshness of identity verification or evidence can use the corresponding signed data and
validation rules in [OpenID4IDA], as described in
(#local-freshness-policy-and-user-directed-updates).

The Subject controls a signed Claim Set held by the OP. CP grant or token revocation,
including unilateral revocation, affects future collection. The Subject can continue to
present previously issued Claim Sets until expiration, subject to this profile's validation and acceptance rules.
(#authorization-withdrawal-and-grant-revocation) describes the Subject's control over
further disclosure at the OP.

A CP can choose a short lifetime when the underlying attributes can change quickly.
An application that needs prompt status updates, such as for a revoked driver's license,
can use a separate authenticated status mechanism and an acceptance policy for the issued
Claim Set. Offline verification checks the signed Claim Set. It cannot establish that the
attributes still reflect the current state. A current status check supplements that verification
and concerns the issued Claim Set rather than the collection grant.

# Privacy Considerations

## OP Visibility and Reliance on Subject Instructions

The OP processes the contents of Claim Sets from CPs and knows which RPs receive them. This
combination can reveal attributes and relationships across services. In a deployment where
a third party operates the OP and can access that processing or its records, the Subject
places substantial trust in that operator. Encryption at rest protects stored data against
some compromises; it does not by itself hide data from the OP while processing it. A
distributed-claims deployment does not necessarily hide information from the OP either;
visibility depends on which components actually obtain and process the data.

At Setup, the Subject authorizes the CP to release claims to the OP for future use under
the Subject's direction. The CP relies on the OP to enforce the later RP-specific
authorization in (#subject-granting). A CP signature authenticates the issued data; it does
not prove that the OP obtained authorization for a particular disclosure. Federation trust
and policy information can inform a trust decision, but do not by themselves prove that
the OP honored the Subject's instructions in an individual transaction.

The least-privilege and disclosure requirements in (#setup-phase), (#claims-collection),
and (#claims-delivery) limit what the OP obtains and discloses. In particular, the RP
receives all claims in an embedded signed JWT, including claims not listed in
`_claim_names`. The OP cannot remove individual claims from that JWT while preserving the
CP's signature. A deployment seeking stronger limits on OP visibility or finer-grained
disclosure needs an appropriate architecture or extension, rather than relying on storage
encryption alone.

## Correlation and Transferable Signed Data

The OP uses the CP's stable Subject Identifier for account binding. The RP-facing
Claim Set omits that identifier. Pairwise identifiers at the CP would otherwise
be scoped to the OP's Sector Identifier rather than to each downstream RP, as specified
in Section 8.1 of [OpenID.Core]. Omitting the CP `sub` removes that direct downstream identifier;
it does not guarantee unlinkability. Authorized identifying attributes can still correlate
Subjects, and a CP can recognize information it issued when an RP shares it.
The OP's pairwise identifiers in enclosing responses do not hide the inner JWT's contents.

When the OP reuses a Claim Set, it sends the same CP-signed JWT.
An RP can compare the JWTs it receives in different presentations.
RPs that share the JWTs they receive can also compare them across services.
A matching JWT, including its signature, lets these recipients correlate the presentations.
Different enclosing OP responses leave a reused inner JWT intact.
Correlation by JWT comparison can therefore occur even when other identifiers are ephemeral or pairwise.

Recipients can also correlate newly issued JWTs through stable identifiers, identifying
combinations of claims, or distinctive timestamps.

An RP can also pass a CP-signed JWT to a third party that can independently verify the CP's
signature and the signed contents. This makes disclosure of signed personal data more
consequential than disclosure of an unauthenticated assertion. The signature is evidence of
what the CP issued, not proof that the Subject presented it to a particular RP or that the
attributes remain current. The base format does not cryptographically prevent onward
transfer. The Subject's controls at the OP cannot recover copies already held by RPs.

Selective disclosure can reduce the attributes revealed to a recipient, but does not by
itself ensure unlinkability. For example, Section 10.1 of [SD-JWT] explains that recipients
can correlate reuse of an issuer-signed credential and that colluding issuers and verifiers
can recognize the same credential. SD-JWT is an example for future profiles, not a format
introduced by this specification. Such profiles would need compatible subject-binding,
audience, consent, and verification rules.

## Pre-Collection, Batch Issuance, and On-Demand Issuance

Pre-collection and reuse of stored Claim Sets can reduce the CP's visibility into when
the Subject uses an RP. If an RP asks the Subject for fresher claims, the Subject can
request an update. The OP can then request a new Claim Set from the CP.

The CP can observe when Claims Endpoint requests arrive and how often they arrive.
If those requests follow RP activity, the CP can use that pattern to infer when the Subject uses an RP.

The following recommendations apply when the OP seeks the Subject's collection or disclosure authorization.

1. The OP SHOULD explain that reusing a signed JWT can link presentations.
2. The OP SHOULD explain that updates can reveal RP activity timing to the CP.

The Subject can then choose whether to authorize reuse or request an update, subject to the
RP's acceptance policy. (#collection-and-reuse) describes privacy policies and rate limits
for user-directed updates.

Reuse avoids a Claims Endpoint call for each presentation. The CP can still observe activity
through information shared by RPs or retrieval of metadata, verification keys, or status.
Valid metadata and key caches tied to the issuer can reduce some such contact, subject to the requirements
in (#cp-metadata-and-verification-keys).

An alternative design can pre-issue a batch of distinct credentials for one-time use,
combining advance collection with avoidance of a common reused artifact. This introduces
inventory and replenishment requirements. Section 10.1 of [SD-JWT] describes batch issuance
for presentation and verifier-verifier unlinkability, including the need to avoid other
common identifiers and timing values. It does not solve issuer-verifier collusion.

With this profile, the Subject can instead request a newly issued Claim Set for a use,
without a CP `sub` in the presented JWT. This avoids maintaining a stock of unused
credentials, but requires CP availability and continued willingness to issue, and exposes
issuance timing to the CP. It does not require revealing the RP's identity to the CP.
The correlation risks for newly issued Claim Sets are described in
(#correlation-and-transferable-signed-data).

The stable account-binding identifier remains in the OP-facing acquisition envelope. The
OP validates it against the Setup ID Token, then discloses only the inner JWT. The new
endpoint avoids changing UserInfo's requirement that its `sub` match the ID Token `sub`.
Using a refreshed ID Token itself would not provide that separation: Section 12.2 of [OpenID.Core]
requires its issuer, subject, and audience to remain those of the original ID Token.

This specification introduces no batch issuance protocol and does not require a newly
issued JWT per presentation. Reuse of stored Claim Sets and user-directed updates remain
Subject choices, subject to RP acceptance policy. These issuance and reuse tradeoffs are
not unique to either an OP-mediated or issuer-holder-verifier architecture.

## Subject Control of Retention and Disclosure

The controls in (#subject-control-of-stored-claim-sets) let the Subject distinguish stored
data from collection and disclosure permissions. They complement the CP's grant-management
interface: revoking a CP grant does not retract issued Claim Sets, while withdrawal at the
OP controls further OP disclosure. Neither operation retracts data already received by an
RP. A Subject may retain a Claim Set as a personal record even after it expires; expiration
restricts valid use rather than imposing deletion. The safeguards in
(#token-and-claim-set-storage) address the resulting storage risks without imposing a
protocol retention deadline or a particular archival encryption design.

Disclosure history can help the Subject identify RPs that already received their data,
including when seeking deletion from those RPs. That history is itself sensitive personal
data and remains subject to protection, minimization, and Subject deletion controls in
(#subject-control-of-stored-claim-sets). Export can give the Subject an independent copy of
an issued artifact, but does not remove the transferability or correlation risks described
in (#correlation-and-transferable-signed-data).


# IANA Considerations

## Registration Overview

This specification requests registration of two OAuth Authorization Server Metadata
parameters and one media type. The templates below do not indicate that registration has
already been completed.

## OAuth Authorization Server Metadata Registrations

### Registry and Template

The following entries are requested in the OAuth Authorization Server Metadata registry
[IANA.OAuth.Parameters], using the template in Section 7.1.1 of [RFC8414]. These metadata
parameters apply to the CP's resolved `openid_provider` metadata and its OpenID Connect
Discovery document as specified in (#discovery-phase).

### claims_endpoint

- Metadata Name: `claims_endpoint`
- Metadata Description: HTTPS URL of the Claims Provider's Claims Endpoint.
- Change Controller: OpenID Foundation Artifact Binding Working Group -
  openid-specs-ab@lists.openid.net
- Specification Document(s): This specification, (#discovery-phase) and
  (#claims-endpoint-request).

### claims_signing_alg_values_supported

- Metadata Name: `claims_signing_alg_values_supported`
- Metadata Description: JSON array of asymmetric JWS signing algorithms supported by the Claims
  Provider for signed Claim Sets.
- Change Controller: OpenID Foundation Artifact Binding Working Group -
  openid-specs-ab@lists.openid.net
- Specification Document(s): This specification, (#discovery-phase) and
  (#signed-claim-set-format).

## Media Type Registration

The following registration is requested in the Media Types registry [IANA.MediaTypes],
using the template in Section 5.6 of [RFC6838].

- Type name: `application`
- Subtype name: `claims-aggregation+jwt`
- Required parameters: None.
- Optional parameters: None.
- Encoding considerations: binary; a compact JWS as defined in [RFC7515].
- Security considerations: See (#security-considerations) and (#privacy-considerations).
- Interoperability considerations: See (#signed-claim-set-format), (#claim-set-profile),
  and (#claims-verification).
- Published specification: This specification, (#signed-claim-set-format) and
  (#claims-verification).
- Applications that use this media type: Implementations of this specification.
- Fragment identifier considerations: No fragment identifier syntax is defined for this media
  type. The existing `+jwt` fragment identifier rules apply.
- Additional information:
    - Deprecated alias names for this type: None.
    - Magic number(s): None.
    - File extension(s): None.
    - Macintosh file type code(s): None.
- Person & email address to contact for further information: Nat Sakimura - nat@nat.consulting.
- Intended usage: COMMON.
- Restrictions on usage: None.
- Author: Nat Sakimura and Edmund Jay.
- Change controller: OpenID Foundation Artifact Binding Working Group -
  openid-specs-ab@lists.openid.net
- Provisional registration? No.

## Other Protocol Elements

The `account_ref`, `nonce`, `claims`, `signing_alg`, and `claim_set` members are defined
within this API's JSON request and response objects. They are not new top-level JWT claims
or new Authorization or Token Endpoint parameters, and this specification requests no
registrations for them in those registries. Existing names in other registries do not
supply their API semantics. No new JOSE header parameter, signing algorithm, or structured
syntax suffix is defined. The existing `typ` header, RS256 algorithm, `+jwt` suffix, JWT
claims, and OAuth token/error mechanisms are reused. No new client capability metadata or
OAuth error value is registered by this specification.


{backmatter}

# Bibliography

[IDA.Schema] - OpenID Identity Assurance Schema Definition 1.0 incorporating errata set 1
[IDA.Schema]: https://openid.net/specs/openid-ida-verified-claims-1_0.html

[IANA.OAuth.Parameters] - IANA OAuth Parameters
[IANA.OAuth.Parameters]: https://www.iana.org/assignments/oauth-parameters/

[IANA.MediaTypes] - IANA Media Types
[IANA.MediaTypes]: https://www.iana.org/assignments/media-types/

[SD-JWT] - RFC 9901 - Selective Disclosure for JSON Web Tokens
[SD-JWT]: https://www.rfc-editor.org/rfc/rfc9901.html

[OAuth.Security.Update] - Updates to OAuth 2.0 Security Best Current Practice, draft-ietf-oauth-security-topics-update-03, Work in Progress
[OAuth.Security.Update]: https://www.ietf.org/archive/id/draft-ietf-oauth-security-topics-update-03.html

[ClaimsAggregation.TestVectors] - Claims Endpoint prototype and reproducible RS256 test vectors
[ClaimsAggregation.TestVectors]: https://github.com/sakimura/claims-endpoint-prototype/tree/f5f6be8e5e7e3853711a02952f754a93ec4c3963

# Notices

Copyright (c) 2026 The OpenID Foundation.

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


# Acknowledgements

The editors thank Michael B. Jones for his feedback and contributions.

# Document History

[[ To be removed from the final specification ]]

-04

* Replaced signed UserInfo collection with a dedicated Claims Endpoint. Added CP
  endpoint and signing-algorithm metadata, strict JSON handling, operation nonces,
  and partial and empty results.
* Defined a signed Claim Set JWT without a CP Subject Identifier. Required RS256
  support and specified algorithm selection, verification key resolution, and OP
  and RP validation.
* Defined the OP's responsibility for Subject binding. Kept the CP account
  reference in the acquisition response and specified how the OP protects its
  association with the exact JWT through storage and redisclosure.
* Required OpenID Federation Automatic Registration and confidential OP client
  authentication with `private_key_jwt` in the base profile. Bound client assertion
  audiences to the CP issuer.
* Required Authorization Code Flow, PKCE S256, authorization response issuer
  validation, and transaction and session binding during Setup. Defined CP consent,
  token handling, and account relinking.
* Clarified how RPs request and receive Aggregated Claims. Defined RP-specific
  consent, claim omission, local freshness policy, and user-directed updates.
  Recommended back-channel delivery.
* Defined Subject controls for stored Claim Set deletion and authorization
  withdrawal. Clarified how those controls interact with CP grant revocation and
  backup restoration.
* Documented acquisition trust boundaries, optional CP-origin evidence,
  correlation and replay risks, and the limits of identity assurance query support.
* Added IANA registration templates for the two CP metadata parameters and the
  Claim Set media type.

-03

* Simplified claims aggregation 
  * Rollback changes introduced in version 02
* Removed Claims Endpoint and related metadata and registration options
* Reuses Userinfo endpoint at Claims Provider to return aggregation claims
* Removed c_token in claims object

-02

* defined new names for actors 
  * OpenID Provider (OP) -> Identity Wallet (IW)
  * Claims Provider (CP) -> Issuing Authority (IA)
  * Relying Party (RP) -> Claims Consumer (CC)
* Claims endpoint response formats allows multiple schema types (W3C VC, JWT)
  * Added 'claimset_format', 'sub_jwk', 'did' to authorization request parameters
  * Added 'format' to claims endpoint response
* Added new requirements for claims endpoint
  * MTLS or DPOP for sender constrain tokens
  * Support OID4IDA claims
  * Support W3C VC response format
* Support for DIDs in request/response

-01

* initial revision
* defined claims endpoint & discovery metadata
* defined registration of claims endpoint response signature and encryption algs
* defined c_token in claims object to request claims from claims endpoint

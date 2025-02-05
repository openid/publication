%%%
title = "Grant Management for OAuth 2.0 (Draft)"
abbrev = "OAuth GM"
ipr = "none"
workgroup = "FAPI"
keyword = ["security", "oauth", "grant", "consent"]

[seriesInfo]
name = "Internet-Draft"
value = "oauth-v2-grant-management-03"
status = "standard"

[[author]]
initials="T."
surname="Lodderstedt"
fullname="Torsten Lodderstedt"
organization="yes.com"
    [author.address]
    email = "torsten@lodderstedt.net"

[[author]]
initials="S."
surname="Low"
fullname="Stuart Low"
organization="Biza.io"
    [author.address]
    email = "stuart@biza.io"

[[author]]
initials="D."
surname="Postnikov"
fullname="Dima Postnikov"
organization="Independent"
    [author.address]
    email = "dima@postnikov.net"

%%%

.# Abstract

This specification defines an extension of OAuth 2.0 [@!RFC6749] to allow clients to explicitly manage their grants with the authorization server.

.# Notational Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP14] [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

{mainmatter}

# Introduction {#Introduction}

OAuth authorization servers issue access and refresh tokens based on privileges granted by a resource owner to a particular client in the course of an authorization process or based on pre-configured policies. The concept representing these privileges and their assignment to a particular client is sometimes referred to as "underlying grant".

Although this concept is fundamental to OAuth, there is no explicit representation of the grant in the OAuth protocol. This leads to the situation that clients cannot explicitly manage grants, e.g. query the status or revoke a grant that is no longer needed. The status is implicitly communicated if an access token refresh succeeds or fails or if an API call using an access token fails with HTTP status codes 401 (token is invalid) or 403 (token lacks privileges).

It also means the client cannot explicitly ask the authorization server to update a certain grant that is bound to a certain resource owner. Instead the authorization server, typically, will determine a pre-existing grant using the client id from the authorization request and the user id of the authenticated resource owner.

If a client wants the authorization server to update a pre-existing grant, it needs to obtain identity data about the resource owner and utilize it in a login hint kind of parameter to refer to the "same user as last time", exposing more identity data to the client than necessary.

Another pattern that was proposed is to use refresh tokens to refer to grants. This would require to send the refresh token as part of the authorization request through the front channel, which poses security issues since the refresh token is a credential and could leak and be injected that way.

There are also use cases in highly regulated sectors, e.g. Open Data, where the client might be forced to maintain concurrent, independent grants to represent the privileges delegated by the resource owner to this client in the context of a distinct service offered by the client to this user and using different client_ids is not appropriate.

In order to support the before mentioned use cases, this specification introduces a `grant_id` clients can use to identify a particular grant along with additional authorization request parameters to request creation and use of such grant ids. This specification also defines a new grant management API provided by the authorization server that clients can use to query the status of a grant and to revoke it.

## Terminology

* Grant is a set of permissions (authorization) granted by a Resource Owner to a Client. Grant is a resource captured and managed by an Authorization Server.

* Consent is a legal concept that can result in a grant being created, but also can include legal, audit, reporting, archiving and non-repudiation requirements. Grant is an authorization created as a result of consent.

* Grant Management API: an HTTP-based API provided by the authorization server that clients can use to query the status of, update, replace and revoke grants.

* Data Recipients (Australia and FDX) and TPPs (UK and PSD2) are examples of OAuth clients used to describe use cases below.

* Data Holders (Australia), ASPSPs (UK and PSD2) and Data Providers (FDX) are examples of OAuth Authorization Servers used to describe use cases below.

# Overview

An authorization server supporting this extension allows a client to explicitly manage its grants. The basic design principle is that creation and update of grants is always requested using an OAuth authorization request while querying the status of a grant and revoking it are performed using the new Grant Management API.

The underlying assumption is that creation and updates of grants almost always require interaction with the resource owner. Moreover, the client is supposed to manage the grant ids along with the respective tokens on its own without support from the authorization server.

# Use cases supported

## Revoking a grant

A client needs an ability to revoke a particular grant.

Examples:

* In the UK, TPPs currently use `DELETE /account-access-consents/{ConsentId}` custom endpoint to revoke authorization on ASPSP side.

* In Australia, Data Recipients currently use `cdr_arrangement_id` and `POST /arrangements/revoke` custom endpoint to revoke authorization on Data Holder's side after a user revoked their consent via Data Recipient's dashboard.

Both could use standardized `grant_id` and grant management endpoint's `DELETE` operation to achieve the same.

## Querying the details of a grant

There are a lot of business scenarios where some details of the grant could change post original authorization. Therefore, clients might need a way to query the current details of a grant.

Examples:

* In the UK, TPPs currently use `GET /account-access-consents/{ConsentId}` custom endpoint to retrieve authorization details from the ASPSP.

* In banking, the client could query the details of a grant to determine what accounts have been added to the grant by a user or other fine-grained details of the authorization (when the user has a choice).

* In some scenarios, a resource owner can be multiple natural persons, so additional authorizations might be required and this might occur after the original authorization was granted by the intiating resource owner. The client can query the status of consent at any point after the authorization to determine if complete authorization has occured (by adhoc query or regular polling). Another scenario that fits in this category is multi-party approval process for business entities.

* Some jurisdictions require client's and authorization server's applications to provide a dashboard to a user to view and revoke authorizations given to the authorization server. Querying the details of the grant allows clients to have access to the up-to-date status and contents of the consent.

## Replace the details of a grant

A client wants to replace existing privileges of a certain grant with the new privileges.

In some scenarios, clients might choose to replace the grant with the new one while keeping the same grant id. Old privileges will be revoked and new privileges will be added if approved by the user. The client has to specify full details of the new request.

Examples:

* In the UK and Australia, "replace" is supported when grant identifier is specified in the authorization request.

## Update the details of a grant

A client wants to update details of the existing grant. Additional details are merged into the grant.

This is especially useful, if the client wants to add privileges as needed to an existing grant in order to be able to access APIs with the same access token or obtain a new access token from a single refresh token. In some scenarios, clients might choose to update to just extend the duration of a grant.

The client only has to specify additional or amended authorization details. The grant id will be kept the same.

The client might also have to start another authorization process if a certain API request fails due to missing privileges (typically an HTTP status code 403).

Examples that can be implemented using "merge" action:

* Time extension of an authorization
* Add additional scopes without requiring authorization for pre-existing scopes
* Add additional claims to an existing grant without reauthorizing other components of the grant (ie. scopes)

## Support for concurrent grants

Some ecosystems allow multiple active authorizations between the same client, the same authorization server and the same resource owner at the same time (concurrent grants).
In order to support concurrent grants, at a minimum, a client needs an ability to reference and revoke a particular grant, as well as, ability to create a new grant where there is an existing grant between the same parties.

Examples:

* In Australia, Data Recipients and Data Holders are mandated to support concurrent grants (authorizations). It's Data Recipient's choice to decide if a new grant is the replacement of a previous grant or a new grant.

* In UK, concurrent grants are also supported.

## Creation of another resource

In some use cases, grant is a permission to create another resource. This created resource will have a separate lifecycle and can be managed outside of the Authorization Server.

Examples:

* For payment initiation, a new grant with a permission to create a payment request might be created first. A client can then use obtained access tokens to initiate the payment and, as a result, a new payment / transaction resource might be created.

## Obtaining new tokens for existing grants

Clients can also obtain fresh access and, optionally refresh tokens based on existing grants if they re-issue an authorization request with all request parameters, reference an existing grant, specify `merge` as `grant_management_action` and follow the rest of the authorization flow (e.g.: redirect or decoupled).

# Use cases not supported

## Historical grant, authorization or consent records

Grant Management specification allows a client to query the status and contents of a grant (resource owner's consent). This is designed for clients to understand what is included in the current active grant. This is NOT designed to provide for legal, reporting or archiving purposes, for example, keeping 7 years of expired or revoked consents.

## Consent resource shared with other parties

There is a use case where resource owner might want to share their consents with third parties (e.g. centralized consent management dashboards).
A new Consent Resource API could be created for this purpose.
This is out of scope for this specification.  

There is also another use case where AS could support sharing of grants among clients belonging to a single administrative entity, for instance where an organization delivers its service across different platforms (e.g. iOS, Android and a Web App each having separate clients). Sector identifier URIs as defined in [@OpenID.Registration] is one option to achieve this objective.
This is out of scope for this specification.  

# OAuth Protocol Extensions

## Requirements for Authorization Servers

Grant management is restricted to confidential only clients due to security reasons.

## Authorization Request {#authz_request}

This specification introduces the authorization request parameters `grant_id` and `grant_management_action`. These parameters can be used with any request serving as authorization request, e.g. it may be used with CIBA requests.

`grant_id`: OPTIONAL. String value identifying an individual grant managed by a particular authorization server for a certain client and a certain resource owner. The `grant_id` value must have been issued by the respective authorization server and the respective client must be authorized to use the particular grant id.  

`grant_management_action`: String value controlling the way the authorization server shall handle the grant when processing an authorization request. This specification defines the following values:

* `create`: The AS will create a fresh grant if the AS supports the grant management action `create`.
* `merge`: This mode requires the client to specify a grant id using the `grant_id` parameter. If the parameter is present and the AS supports the grant management action `merge`, the AS will merge the permissions consented by the resource owner in the actual request with those which already exist within the grant and shall invalidate existing refresh tokens associated with the updated grant.
* `replace`: This mode requires the client to specify a grant id using the `grant_id` parameter. If the parameter is present and the AS supports the grant management action `replace`, the AS will change the grant to be ONLY the permissions requested by the client and consented by the resource owner in the actual request and shall invalidate existing refresh tokens associated with the replaced grant.

The following example shows how a client may ask the authorization request to use a certain grant id:

```http
GET /authorize?response_type=code&
     client_id=s6BhdRkqt3
     &grant_management_action=merge
     &grant_id=TSdqirmAxDa0_-DB_1bASQ
     &scope=write
     &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
     &code_challenge_method=S256
     &code_challenge=K2-ltc83acc4h... HTTP/1.1
Host: as.example.com 
```

## Authorization Response
This specification doesn't introduce any changes to authorization response. `grant_id` should not be included in the authorization response.

## Authorization Error Response

In case the `grant_id` is unknown, invalid or logged in user doesn't match a resource owner, the authorization server shall respond with an error code `invalid_grant_id`.

In case the `grant_id` is provided for the `create` action, the authorization server shall respond with an error code `invalid_request`.

In case the `grant_id` is provided and the action is not specified, the authorization server shall respond with an error code `invalid_request`.

In case the AS does not support a grant management action requested by the client, or the grant management action is required (according to `grant_management_action_required` metadata) but not specified, the authorization server shall respond with an error code `invalid_request`.

## Token Response

This specification introduces the token response parameter `grant_id`:

`grant_id`: URL safe string value identifying an individual grant managed by a particular authorization server for a certain client and a certain resource owner. The `grant_id` value must be unique in the context of a certain authorization server and should have enough entropy to make it impractical to guess it.

The AS must return a `grant_id` if the `grant_management_action` request parameter is provided and specified action is valid and supported (for example, `create`, `update` or `replace`).

Here is an example response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache, no-store

{
   "access_token": "2YotnFZFEjr1zCsicMWpAA",
   "token_type": "example",
   "expires_in": 3600,
   "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA",
   “grant_id”: ”TSdqirmAxDa0_-DB_1bASQ”
}
```

## Lifecycle of the grant

### Creation

Grant, as a set of authorized permissions, is created by the AS on authorization request completion.

For the initial authorization flow, a grant should be considered active when associated tokens have been successfully claimed by the client.

If the tokens haven't been claimed the grant should be deleted by the AS after a reasonable timeout. Timeline of the deletion is left up to AS implementations.

### Modification

Grant can be modified by a client via update or replace actions.

Some elements of a grant can be updated by the AS to reflect the status of some resources included in the grant. For example, if a user chose to share an account with a client and this account required additional authorizations before being considered as fully authorized.

### Deletion

Authorization server may remove an obsolete grant at its discretion, but it should consider status and expiry of authorization elements included in the grant. The exact mechanism could differ between different deployments, for example, some deployments could purge a grant when all individual authorization_details attached to the grant have expired or revoked.

# Grant Management API

The Grant Management API allows clients to perform various actions on a grant whose `grant_id` the client previously obtained from the authorization server.

Currently supported actions are:

* Query: Retrieve the current status of a specific grant
* Revoke: Request the revocation of a grant

The Grant Management API does not provide bulk access to all grants of a certain client for functional and privacy reasons. Every grant is associated with a certain resource owner, so just getting the status is useless for the client as long as there is not indication of the user the client can use this grant for. Adding user identity data to the status data would weaken the privacy protection OAuth offers for users towards a client.

The Grant Management API will not expose any tokens associated with a certain grant in order to prevent token leakage. The client is supposed to manage its grants along with the respective tokens and ensure its usage in the correct user context.

## API authorization

Using the Grant Management API requires the client to obtain an access token authorized for this API. The grant type the client uses to obtain this access token is out of scope of this specification.

The token is required to be associated with the following scope value:

`grant_management_query`: Scope value the client uses to request an access token to query the status of its grants.

`grant_management_revoke`: Scope value the client uses to request an access token to revoke its grants.

## Endpoint

The Grant Management API is a new endpoint provided by the authorization server. The client may utilize the server metadata parameter `grant_management_endpoint` (see (#server_metadata)) to obtain the endpoint URL.

Communication with the Grant Management API must use the "https" scheme.

## Grant Resource URL

The resource URL for a certain grant is built by concatenating the grant management endpoint URL, a slash, and the the `grant_id`. For example, if the grant management endpoint is defined as

```
https://as.example.com/grants
```

and the `grant_id` is

```
TSdqirmAxDa0_-DB_1bASQ
```

the resulting resource URL would be

```
https://as.example.com/grants/TSdqirmAxDa0_-DB_1bASQ 
```

## Query Status of a Grant

The status of a grant is queried by sending an HTTP GET request to the grant's resource URL as shown by the following example.

```http
GET /grants/TSdqirmAxDa0_-DB_1bASQ HTTP/1.1
Host: as.example.com
Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA
```

The authorization server will respond with a JSON-formatted response as shown in the following example:

```http
HTTP/1.1 200 OK
Cache-Control: no-cache, no-store
Content-Type: application/json

{
   "scopes":[
      {
         "scope":"contacts read",
         "resource":[
            "https://rs.example.com/api1"
         ]
      },
      {
         "scope":"write",
         "resource":[
            "https://rs.example.com/api2",
            "https://rs.example.com/api3"
         ]
       },
      {
         "scope":"openid"
      }
   ],
   "claims":[
      "given_name",
      "nickname",
      "email",
      "email_verified"
   ],
   "authorization_details":[
      {
         "type":"account_information",
         "actions":[
            "list_accounts",
            "read_balances",
            "read_transactions"
         ],
         "locations":[
            "https://example.com/accounts"
         ]
      }
   ],
   "created_at":1356123600,
   "last_updated_at":1356123600,
   "expires_at":1356123600,
   "updated_by":"client"
}
```

The following example demonstrates a simpler scenario when the `authorization_details` or the `resource` indicators are not used or not supported by the AS:

```http
HTTP/1.1 200 OK
Cache-Control: no-cache, no-store
Content-Type: application/json

{
   "scopes":[
      {
         "scope":"openid email address phone"
      }
   ],
   "claims":[
      "email",
      "email_verified",
      "phone_number",
      "phone_number_verified",
      "address"
   ]
}
```

The privileges associated with the grant will be provided as a JSON array containing objects with the following structure:

* `scopes`: (optional) JSON array where every JSON object may contain a `scope` field of type JSON string and may contain a `resource` field with an array of resource indicators. The `resource` array contains one or more absolute URIs referencing the resources (as defined in [RFC8707]) authorized for that scope. This structure allows the AS to represent the relationship between scope values and the resource indicators (as defined in [@!RFC8707]) that were requested and approved with (or pre-defined `resource` value by the AS and approved). The concrete mapping is at the discretion of the AS. The AS could, for example, organize those objects "by resource", i.e. for every resource there is a list of related scope values. It could also store chunks of scope values along with the `resource` parameter values as requested and approved in a certain authorization request.
* `claims`: (optional) JSON array containing the names of all OpenID Connect claims (see [@!OpenID.Core]) as requested by the client (acting as OpenID Connect RP) and consented by the Resource Owner in one or more authorization requests associated with the respective grant. The definition of consented claims is left up to the implementation when special scopes are used (e.g. `profile`).
* `authorization_details`: (optional) JSON array of JSON objects as defined in [@!I-D.ietf-oauth-rar] containing all authorization details as requested and consented in one or more authorization requests associated with the respective grant.

The following information about the grant may be provided:
* `last_updated`: (optional) time when the grant was last updated expressed as a number containing a NumericDate value.
* `expires_at`: (optional) time when the grant expires expressed as a number containing a NumericDate value.
* `created_at`: (optional) time when the grant was originally created expressed as a number containing a NumericDate value.
* `updated_by`: (optional) string value that indicates who updated the grant. Allowed values are 'client' and “authorization_server“.

`NumericDate` is JSON numeric value representing the number of seconds from 1970-01-01T00:00:00Z UTC until the specified UTC date/time, ignoring leap seconds.  This is equivalent to the IEEE Std 1003.1, 2013 Edition [POSIX.1] definition "Seconds Since the Epoch", in which each day is accounted for by exactly 86400 seconds, other than that non-integer values can be represented.  See RFC 3339 [RFC3339] for details regarding date/times in general and UTC in particular.
      
The response structure MAY also include further elements defined by extensions.

Where an OP is currently experiencing high load it may return an HTTP 503 with a Retry-After response header as described in Section 7.1.3 of [@!RFC7231]. Clients should respect such headers and only retry after the time indicated in the header.

## Revoke Grant

To revoke a grant, the client sends an HTTP DELETE request to the grant's resource URL. The authorization server responds with an HTTP status code 204 and an empty response body.

This is illustrated by the following example.

```http
DELETE /grants/TSdqirmAxDa0_-DB_1bASQ HTTP/1.1
Host: as.example.com
Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA
```

```http
HTTP/1.1 204 No Content
```

The AS MUST revoke the grant and all refresh tokens issued based on that particular grant, it should revoke all access tokens issued based on that particular grant.

Note: Token revocation as defined in [@RFC7009] differentiates from grant revocation as defined in this specification in that token revocation is not required to cause the revocation of the underlying grant. It is at the discretion of the AS to retain a grant in case of token revocation and allow the client to re-connect to this grant through a subsequent authorization request. This decoupling may improve user experience in case the client just wanted to discard the token as a credential.

## Error Responses

If the resource URL is unknown, the authorization server responds with an HTTP status code 404.

If the client is not authorized to perform a call, the authorization server responds with an HTTP status code 403.

If the request lacks a valid access token, the authorization server responds with an HTTP status code 401 and an `invalid_token` error code.

# Metadata

## Authorization server's metadata {#server_metadata}

`grant_management_actions_supported`:
OPTIONAL. JSON array containing the actions supported by the AS. Allowed values are `query`, `revoke`, `merge`, `replace` and `create`.

* `query`: The AS allows clients to query the permissions associated with a certain grant.
* `revoke`: The AS allows clients to revoke grants.
* `merge`: The AS allows clients to update existing grants.
* `replace`: The AS allows clients to replace existing grants.
* `create`: The AS allows clients to request the creation of a new grant.

If omitted, the AS does not support any grant management actions.

`grant_management_endpoint`:
OPTIONAL. URL of the authorization server's Grant Management Administration Endpoint.

`grant_management_action_required`:
OPTIONAL. Boolean where, if `true`, all authorization requests must specify a `grant_management_action`. If omitted, it defaults to `false`.

# Implementation Considerations {#Implementation}

## Client to grant relationship

A client (as logical entity) may use multiple client ids to deliver its service across different platforms, e.g. apps for iOS and Android and a Web App. It is recommended that the AS support sharing of grants among client ids belonging to the same client. Sector identifier URIs as defined in [@OpenID.Registration] is one option to group client ids under single administrative control.

## Addressibility of grant components

Implementations may wish to consider solutions to allow for addressibility of individual components within a grant. Trust ecosystems should consider their requirements during implementation and consider either;

* Including a unique identifier within the authorization object (ie. `id` within the RAR) or;
* Defining a comparison algorithm for the grant to allow for derivation of update and append actions

## Access Tokens and Introspection Responses

The grant resource's data model serves the purpose of making the content of a grant transparent to the respective client. The way grant data (e.g. scopes) is conveyed between AS and RS is at the discretion of AS and RS.

Deployments should ensure access tokens are issued with an audience restricted to a certain resource server. This is good security practice and it allows implementations to use the existing claim "aud" to convey the resource value in addition to the scope in access tokens and respective introspection responses.

# Privacy Consideration {#Privacy}

`grant_id` is issued by the authorization server for each established grant between a client and a resource owner. This should prevent correlation between different clients.

It must not be possible to identify the user or derive any personally identifiable information (PII) based on `grant_id` alone.

`grant_id` potentially could be shared with different client ids belonging to the same entity.

# Security Considerations {#Security}

A grant id is considered a public identifier, it is not a secret. Implementations must assume grant ids leak to attackers, e.g. through authorization requests. For example, access to the sensitive data associated with a certain grant must not be made accessible without suitable security measures, e.g. an authentication and authorization of the respective client.

During the execution of a transaction utilizing grant mode `replace`, it is possible that the results of the resultant grant contain a permission set which is not a superset of the previous permission set. Consequently, where self-contained access tokens are in use and there is a requirement for immediate propogation shorter than the lifespan of access tokens, the AS should immediately revoke all relevant tokens by an out-of-band means.

{backmatter}

<reference anchor="IANA.OAuth.Parameters" target="http://www.iana.org/assignments/oauth-parameters">
 <front>
  <title>OAuth Parameters</title>
  <author>
    <organization>IANA</organization>
  </author>
  <date/>
 </front>
</reference>

<reference anchor="OpenID.Core" target="http://openid.net/specs/openid-connect-core-1_0.html">
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

<reference anchor="OpenID.Registration" target="https://openid.net/specs/openid-connect-registration-1_0.html">
        <front>
          <title>OpenID Connect Dynamic Client Registration 1.0 incorporating errata set 1</title>
		  <author fullname="Nat Sakimura">
            <organization>NRI</organization>
          </author>
          <author fullname="John Bradley">
            <organization>Ping Identity</organization>
          </author>
          <author fullname="Mike Jones">
            <organization>Microsoft</organization>
          </author>
          <date day="8" month="Nov" year="2014"/>
        </front>
</reference>

<reference anchor="BCP14" target="https://tools.ietf.org/rfc/bcp/bcp14">
    <front>
        <title>Best Current Practice: Key words for use in RFCs to Indicate Requirement Levels</title>
    </front>
</reference>

<reference anchor="RFC2119" target="https://datatracker.ietf.org/doc/html/rfc2119">
    <front>
        <title>Key words for use in RFCs to Indicate Requirement Levels</title>
        <author fullname="S. Bradner">
          <organization>Harvard University</organization>
        </author>
    </front>
</reference>

<reference anchor="RFC8174" target="https://datatracker.ietf.org/doc/html/rfc8174">
    <front>
        <title>Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words</title>
        <author fullname="B. Leiba">
          <organization>Huawei Technologies</organization>
        </author>
    </front>
</reference>


# IANA Considerations

## OAuth Parameter registry

This specification requests registration of the following value in the IANA "OAuth Parameters Registry" registry of [@IANA.OAuth.Parameters] established by [@RFC6749].

{spacing="compact"}
Parameter name:
: `grant_id`

Parameter location:
: authorization request, token response

Change Controller:
: IESG

Specification Document(s):
: (#authz_request) of [[ this document ]]

Parameter name:
: `grant_management_action`

Parameter location:
: authorization request

Change Controller:
: IESG

Specification Document(s):
: (#authz_request) of [[ this document ]]

## OAuth Authorization Server Metadata

This specification requests registration of the following values in the IANA "OAuth Authorization Server Metadata" registry of [@IANA.OAuth.Parameters] established by [@!RFC8414].

{spacing="compact"}
Metadata Name:
: `grant_management_actions_supported`

Metadata Description:
: JSON array containing the authorization details types the AS supports

Change Controller:
: IESG

Specification Document(s):
: (#server_metadata) of [[ this document ]]

Metadata Name:
: `grant_management_endpoint`

Metadata Description:
: URL of the authorization server's Grant Management Administration Endpoint.

Change Controller:
: IESG

Specification Document(s):
: (#server_metadata) of [[ this document ]]

Metadata Name:
: `grant_management_action_required`

Metadata Description:
: Boolean where, if `true`, all authorization requests MUST specify a `grant_management_action`.

Change Controller:
: IESG

Specification Document(s):
: (#server_metadata) of [[ this document ]]

## OAuth Extensions Error registry

This specification requests registration of the following value in the IANA "OAuth Extensions Error registry" registry of [@IANA.OAuth.Parameters] established by [@RFC6749].

{spacing="compact"}
Metadata Name:
: `invalid_grant_id`

Metadata Description:
: indicates invalid `grant_id` to the client.

Change Controller:
: IESG

Specification Document(s):
: (#authz_request) of [[ this document ]]

# Acknowledgements {#Acknowledgements}

We would like to thank Vladimir Dzhuvinov, Takahiko Kawasaki, Roland Hedberg, Filip Skokan, Dave Tonge, Brian Campbell, Ralph Bragg, Jacob Ideskog, Lukasz Jaromin, Joseph Heenan and Travis Spencer for their valuable feedback and contributions that helped to evolve this specification.

# Notices

Copyright (c) 2023 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.

# Document History

   [[ To be removed from the final specification ]]

   -03

   * editorial changes


   -02
   
   * renamed `update` action to `merge`
   * added `expires_at`, `created_at`, `last_updated` and `updated_by`
   * clarifications
   * added `replace` grant management action to server metadata
   * added IANA section content
      
   -01 
   
   * simplified authorization requests
   * added metadata control grant management behavior of AS and client
   * extended grant resource data model

   -00 

   *  initial revision

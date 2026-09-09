%%%
title = "IPSIE AL SCIM 2.0 Profile Draft 00"
abbrev = "SCIM IPSIE"
ipr = "trust200902"
area = "Applications and Real-Time"
workgroup = "IPSIE Working Group"
keyword = ["scim", "ipsie", "provisioning", "identity", "oauth"]

[seriesInfo]
name = "Internet-Draft"
value = "draft-openid-ipsie-al-scim-profile-latest"
stream = "IETF"
status = "informational"

[[author]]
initials = "J."
surname = "Schreiber"
fullname = "Jen Schreiber"
organization = "Crowdstrike"
  [author.address]
  email = "jwschreib@gmail.com"

[[author]]
initials = "D."
surname = "Zollner"
fullname = "Danny Zollner"
organization = "Okta"
 [author.address]
 email = "danny.zollner@okta.com"

%%%

.# Abstract

This document defines a profile for SCIM 2.0 to meet the security and interoperability requirements for identity lifecycle management within enterprises. Within the context of SCIM, the profile establishes requirements for provisioning, account management, client authentication, and identity synchronization across three Account Lifecycle assurance levels: AL1 (User Deprovisioning), AL2 (User and Group Management), and AL3 (Role Management).

{mainmatter}

# Discussion Venues

This note is to be removed before publishing as an RFC.

Source for this draft and an issue tracker can be found at
<https://github.com/openid/ipsie-scim-al>.

# Introduction

This document defines the SCIM 2.0 IPSIE Profile for enterprise identity lifecycle management. It provides a clear reference for SCIM deployments that require a well-defined security baseline meeting best practices for interoperable enterprise identity management.

The profile is organized according to the three IPSIE Account Lifecycle assurance levels as defined in the IPSIE Levels specification:

* **AL1 - User Deprovisioning**: The Application deprovisions users at the request of the Identity Service. This includes account deactivation and deletion.
* **AL2 - User and Group Management**: The Identity Service synchronizes user provisioning and group membership with the Application. The Application accepts creation and updates of user accounts and maps groups and their memberships to application roles and capabilities.
* **AL3 - Role Management**: The Application exposes its available roles to the Identity Service, enabling centralized role assignment and synchronization.

Each level is cumulative: AL2 requirements extend AL1, and AL3 requirements extend AL2.

The profile addresses critical aspects of secure identity management, with particular emphasis on:

* Client authentication
* Retrieve, add, and modify Users
* Retrieve, add, and modify Groups
* Synchronization of data from the Identity Service to the Application

By adhering to this profile, organizations can implement SCIM-based integrations that meet stringent security requirements while ensuring interoperability across different implementations.

# Conventions and Definitions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [@!RFC2119] [@!RFC8174] when, and only when, they appear in all capitals, as shown here.

## Terminology

SCIM

> The System for Cross-domain Identity Management as defined in [@!RFC7643] and [@!RFC7644]

SCIM Client

> An application that uses the SCIM protocol to access or manage identity data maintained by the SCIM service provider (SP). The client initiates SCIM HTTP requests to a SCIM service provider. To clarify the relationship in terms of identity management, the Identity Provider (IdP) is the SCIM Client and initiates requests to the SP, which is the SCIM Server.

SCIM Server (also referred to as SCIM Service Provider)

> An HTTP web application that provides identity information via the SCIM protocol. To clarify the relationship in terms of identity management, the SP is the SCIM Server and receives the requests from the IdP, which is the SCIM Client.

Role

> A set of permissions.  Any user or account within the same role receives the predefined ability to access a resource and/or perform an action.

Identity Service or Identity Provider (IdP)

> Acts as the SCIM client, initiating all provisioning, updates, and deprovisioning operations.

Application

> Acts as the SCIM server or service provider, hosting SCIM endpoints and processing all provisioning requests.

Note: When SCIM is applied to the context of IPSIE, the Identity Service acts as the SCIM client and the Application acts as the SCIM service provider. The document will use the Role terms below for consistency across IPSIE profiles.

# Shared Prerequisites

The following requirements apply to all assurance levels defined in this profile.

## Authentication and Authorization {#authn-authz}

The Identity Service and Application MUST use OAuth 2.0 [@!RFC6749] for authentication and authorization of all SCIM (HTTP) requests.

> **Editor's Note:** This section should be expanded and may need to reference the IPSIE Session Lifecycle 1 (SL1) profile.

The following requirements ensure consistent and secure handling of access tokens and authorization server configuration:

* OAuth 2.0 interactions MUST use the client_credentials grant type with JWT Client Authentication as defined in [@!RFC7523] section 2.2.
* The Identity Provider SHALL acquire an access token and present that token in the {Authorization: Bearer} header on all subsequent SCIM requests.
* The Identity Service MUST authenticate to the Application's OAuth 2.0 authorization server using HTTP Basic authentication in the Authorization request header. Transmission of client credentials (e.g., client_assertion, client_secret) in the HTTP request body is prohibited.
* The Access Token MUST include the "scim" scope and not grant broader permissions.
* Both the Application and the Identity Service MUST expose OAuth Authorization Server metadata as defined in [@!RFC8414]. The Application's metadata document MUST include a "token_endpoint" value identifying its OAuth 2.0 token endpoint. The Identity Service's metadata document MUST include a "jwks_uri" so that the Application can retrieve the Identity Service's public keys and validate the signatures of JWTs it issues.

## SCIM Interoperability Requirements

* Implementations conforming to this profile MUST also conform to the SCIM 2.0 Interoperability Profile [@!I-D.zollner-scim-interop-profile]. The requirements of this profile supplement and extend those of the SCIM 2.0 Interoperability Profile.
* The Identity Service SHALL implement the required functionality of a SCIM client as defined in [@!RFC7643] and [@!RFC7644].
* The Application SHALL implement the required functionality of a SCIM service provider as defined in [@!RFC7643] and [@!RFC7644].
* Local modifications to Users or Groups in the Application are prohibited.

## Performance and Efficiency

* The Application MUST enforce rate limits on all SCIM endpoints and must respond with appropriate headers, such as "429 Too Many Requests" and "Retry-After," when limits are exceeded.
* The Application MUST support at least 25 SCIM requests per second. This requirement is per-tenant for multi-tenant (B2B SaaS, etc.) applications.
* The Application and the Identity Service MUST support the SCIM /Bulk endpoint defined in [@!RFC7643] section 3.7.
* The Application MUST support PATCH requests that update multiple attributes within a single request.
* The Identity Service SHOULD optimize its SCIM request logic to minimize the number of SCIM requests made for each resource in a short period of time. As an example, a single PATCH request containing multiple attribute updates should be made rather than updating each attribute in a separate PATCH request.
* The Identity Service SHOULD use the SCIM /Bulk endpoint when it plans to make changes to more than 100 SCIM resources in a 5 minute period.

# AL1: User Deprovisioning

AL1 requires the Application to deprovision users at the request of the Identity Service. The Identity Service can suspend, archive, delete, or otherwise deprovision accounts at the Application.

## Deactivate or Reactivate User (PATCH /Users/{id})

Changes to the user activation status, such deactivation and reactivation, are performed by the SCIM operation PATCH /Users/{id}

The Identity Service SHOULD propagate user deactivation events to the Application within 5 minutes of the user being deactivated.

The Application SHOULD respond to user deactivation events by revoking the ability for the user to continue accessing the Application, including the revocation of currently active sessions. Session revocation mechanisms are outside the scope of this profile. Revocation SHOULD occur within 5 minutes of receiving the deactivation request.

When a user account is deactivated, all access mechanisms and authorizations associated with that account MUST also be deactivated. This includes, but is not limited to:

* Web sessions
* API tokens
* Refresh tokens
* Personal access tokens
* SSH keys associated with the user
* Device-based authentication credentials

The Application MUST allow reactivation of a deactivated user.

## Delete User (DELETE /Users/{id})

Applications MAY allow users to be deleted via the SCIM operation DELETE /Users/{id}.

After a user is deleted, the Application MUST allow the creation of a new user with the same username.

> **Editor's Note:** Need to clarify implications for maintaining user data and avoiding conflicts when recreating users with the same username.

## Get User By ID (GET /Users/{id})

The Application MUST support retrieving a single user by ID via the SCIM operation GET /Users/{id}.

## List Users By Alternate Identifier (GET /Users?)

The Application MUST support the following filter expressions:

* username eq \{username\}
* externalId eq \{externalId\}
* emails[value eq \{email\}]
* emails[type eq "work" and value eq \{email\}]

# AL2: User and Group Management

AL2 extends AL1. In addition to deprovisioning, the Identity Service synchronizes user provisioning and group membership with the Application. The Application MUST accept creation and updates of user accounts from the Identity Service and MUST prohibit local account creation for users managed by the Identity Service. The Application MUST support mapping Identity Service groups to local Application roles and capabilities.

## User Provisioning

Requirements for user provisioning operations are defined in this section.

### Schema

The Application MUST include the following attributes in the User schema:

* userName
* displayName
* active

Additionally, the "externalId" attribute defined as optional in the "common" resource schema in [@!RFC7643] MUST be supported by the Application.

### Passwords and other credentials

The Application MUST NOT support the "password" attribute.

The Identity Service MUST NOT include the "password" attribute in any SCIM requests.

A user resource may have various credentials or similar data associated with them. This includes passwords, password hashes, private keys, and multi-factor authentication data such as Time-Based One-Time Password (TOTP) seeds. The Application MUST NOT define attributes containing credentials in custom schemas. The Identity Service MUST NOT send values for user credentials in any SCIM requests.

### Create User (POST /Users)

The Identity Service and the Application MUST support user creation via POST /Users.

### Update User (PATCH /Users/{id})

The Identity Service and the Application MUST support updating a user's attribute values via the SCIM operation PATCH /Users/{id}.

### Get All Users (GET /Users)

The Application MUST support retrieval of all users via the SCIM operation GET /Users.

The Application SHOULD avoid returning more than 1,000 users per page. Support for cursor-based pagination by the Application is RECOMMENDED.

## Group Provisioning Operations

Requirements for group provisioning operations are defined in this section. The Application MAY implement support for groups and MUST follow the below requirements if it does.

### Schema

The Application MUST include the following attributes in the Group schema:

* displayName
* members

Additionally, the "externalId" attribute defined as optional in the "common" resource schema in [@!RFC7643] MUST be supported by the Application.

The Application SHOULD NOT allow multiple groups to have the same value for the "displayName" attribute".

The Identity Service SHOULD use a unique value for the "displayName" attribute.

### Create Group (POST /Groups)

The Identity Service and the Application MUST support group creation via POST /Groups.

The Application MUST allow groups to be created with zero members.

### Get All Groups (GET /Groups)

The Application MUST support retrieval of all groups via the SCIM operation GET /Groups.

The Identity Service SHOULD include excludedAttributes=members in the HTTP URI when listing all groups.

### Get Group By ID (GET /Group/{id})

The Application MUST support retrieving a single group by ID via the SCIM operation GET /Groups/{id}.

### List Groups By Alternate Identifier (GET /Groups?)

The Application MUST support the following filter expressions for groups:

* displayName eq \{displayName\}
* externalId eq \{externalId\}
* members[value eq \{memberId\}]

### Update Group (PATCH /Group/{id})

The Identity Service and the Application MUST support updating a group's attribute values via the SCIM operation PATCH /Groups/{id}.

The Application MUST support the inclusion of at least 50 add or remove operations on the "members" attribute in a single PATCH request.

The Identity Service SHOULD compile multiple changes to the "members" attribute into a single PATCH request.

# AL3: Role Management

AL3 extends AL2. The Application exposes its available roles to the Identity Service, enabling centralized role assignment and synchronization. The Identity Service maps Application roles to users and synchronizes those assignments back to the Application.

> **Editor's Note:** AL3 requirements are not yet defined in this draft. Requirements will be added in a future revision.

# Security Considerations

For SCIM security considerations, see [@!RFC7643] and [@!RFC7644]

Additionally, the following requirements are included to address security considerations.

* **Error Handling**: Error responses SHALL use the SCIM error format and SHALL NOT leak internal details.
* **Replay Resistance**: Access tokens SHALL expire and nonces SHALL be validated to prevent replay.
* **Auditing**: All SCIM requests resulting in the creation, deletion, or modification of a SCIM resource SHALL be logged for audit and troubleshooting.
* **Rate Limiting**: All endpoints SHALL enforce rate limiting and must respond with "429 Too Many Requests" when limits are exceeded.

# IANA Considerations

This document has no IANA actions.

# Compliance Statement

Implementation of all mandatory requirements at each level results in a SCIM 2.0 deployment satisfying the corresponding IPSIE Account Lifecycle assurance level.

* **AL1 (User Deprovisioning)**
  * **Identity Service (SCIM client)**: SHALL initiate deactivation and deletion operations for Users and SHALL adhere to the security considerations above.
  * **Application (SCIM service provider)**: SHALL support PATCH /Users/{id} for deactivation and reactivation, SHALL support DELETE /Users/{id}, SHALL prevent local modifications outside of SCIM, SHALL enforce OAuth 2.0 JWT Profile for Authentication [@!RFC7523], and SHALL adhere to the security considerations above.

* **AL2 (User and Group Management)** — requires AL1
  * **Identity Service (SCIM client)**: SHALL initiate all CRUD operations for Users and Groups and SHALL adhere to the security considerations above.
  * **Application (SCIM service provider)**: SHALL host all SCIM endpoints with full support for User provisioning, and if supported, Group provisioning; SHALL prevent local modifications outside of SCIM; SHALL enforce OAuth 2.0 JWT Profile for Authentication [@!RFC7523]; and SHALL adhere to the security considerations above.

* **AL3 (Role Management)** — requires AL2
  * Requirements to be defined in a future revision.

By conforming to this profile at the appropriate level, implementations will achieve a consistent, secure, and interoperable baseline for enterprise identity lifecycle management.

{backmatter}

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

Initial draft

# Acknowledgments


TODO acknowledge.


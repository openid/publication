%%%
title = "OpenID Connect Enterprise Extensions 1.0 - draft 00"
abbrev = "openid-connect-enterprise-extensions"
ipr = "none"
workgroup = "OpenID Connect"
keyword = ["security", "openid", "enterprise"]

[seriesInfo]
name = "Internet-Draft"
value = "openid-connect-commands-1_0"
status = "standard"

[[author]]
initials="D."
surname="Hardt"
fullname="Dick Hardt"
organization="Hellō"
    [author.address]
    email = "dick.hardt@gmail.com"

[[author]]  
initials="K."
surname="McGuinness"
fullname="Karl McGuinness"
organization="Independent"
    [author.address]
    email = "me@karlmcguinness.com"

%%%

.# Abstract

OpenID Connect 1.0 has become a popular choice for single sign on in enterprise use cases. To improve interoperability, OpenID Connect Enterprise Extensions specifies a number of common or desirable extensions to OpenID Connect.



{mainmatter}

# Introduction


OpenID Connect 1.0 is a widely adopted identity protocol that enables client applications, known as relying parties (RPs), to verify the identity of end-users based on authentication performed by a trusted service, the OpenID Provider (OP). 

Initial adoption of OpenID Connect was by sites providing personal identity to applications. OpenID Connect has become a popular choice in enterprise use cases, and implementors have defined their own extensions for use cases that were not addressed in the original specification. 

To improve interoperability between systems, OpenID Connect Enterprise Extensions specifies optional claims that may be included in an ID Token, optional parameters that may be included in an authentication request, and optional parameters optional parameters that may be included in when initiating login from a third party.



## Requirements Notation and Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in [RFC2119](#RFC2119).

In the .txt version of this specification,
values are quoted to indicate that they are to be taken literally.
When using these values in protocol messages,
the quotes MUST NOT be used as part of the value.
In the HTML version of this specification,
values to be taken literally are indicated by
the use of *this fixed-width font*.

## Terminology

This specification defines the following terms:

- **Account**: A set of claims about a user.

- **Tenant**: A logically isolated entity within an OP that represents a distinct organizational or administrative boundary. An OP may have a single Tenant, or multiple Tenants. The Tenant may contain Accounts managed by individuals, or may contain Accounts managed by an organization.

# ID Token Claims

An ID Token is defined in Section 2 of [OpenID Connect Core 1.0](#OpenID Connect Core 1.0). 

Following are OPTIONAL claims that may be included in an ID Token:

## session_expiry

The `session_expiry` claim is a JSON integer that represents the Unix timestamp (seconds since epoch) indicating when a session created from the ID Token MUST expire. 

## tenant

The `tenant` claim is an opaque JSON string that represents a tenant identifier and MAY have the value `personal`, `organization` or a stable OP unique value for multi-tenant OPs. The `personal` value is reserved for when Accounts are managed by individuals. The `organization` value is reserved for Accounts managed by an organization.


# Authentication Request Parameters

An Authentication request is defined in Section 3.1.2.1 of [OpenID Connect Core 1.0](#OpenID Connect Core 1.0).

Following are OPTIONAL parameters that may be included in an Authentication Request:

## domain_hint

The `domain_hint` parameter provides a hint for the OP to determine which Tenant to present to the user to authenticate to.

## tenant

The `tenant` identifier per the `tenant` claim for the OP Tenant that the RP would like the user to be authenticated to. Passing a `tenant` value of `personal` indicates the RP would like the user to use an account managed by user. Passing a `tenant` value of `organization` indicates the RP would like the user to use an account managed by an organization.


# Login from a Third Party Parameters

Initiating a login from a third party and a login initiation endpoint are defined in Section 4 of [OpenID Connect Core 1.0](#OpenID Connect Core 1.0). 

Following are OPTIONAL parameters that may be included in request to the login initiation endpoint:

## client_id

The `client_id` value the RP should use when making the Authentication Request. This allows an multi-tenant application that hosts multiple tenants, each represented by a different `client_id`, to know which `client_id` to use.

## domain_hint

The `domain_hint` value to be included in the Authentication Request.

## tenant

The `tenant` value to be included in the Authentication Request.


# Security Considerations

*To be completed.*



# Privacy Considerations

*To be completed.*

# IANA Considerations

*To be completed.*


# References

## Normative References

- **[RFC2119]** Bradner, S. “Key words for use in RFCs to Indicate Requirement Levels,” *RFC 2119*, March 1997.
- **[OpenID Connect Core 1.0]** – “OpenID Connect Core 1.0 incorporating errata set 1,” available at <https://openid.net/specs/openid-connect-core-1_0.html>. 

## Informative References

- **IANA JSON Web Token Claims Registry**, available at <https://www.iana.org/assignments/jwt/jwt.xhtml>.
- **IANA OAuth Parameters**, available at <https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#client-metadata>.

{backmatter}

# Acknowledgements

*To be updated.*

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

%%%
title = "OpenID Connect Ephermeral Subject Identifier 1.0 - Draft 00"
abbrev = "oidc-esid"
ipr = "none"
workgroup = "Connect"
keyword = ["openid", "ephemeral", "subject", "privacy"]

[seriesInfo]
name = "OpenID-Draft"
value = "openid-connect-ephemeral-subject-identifier-1_0-00"
status = "standard"

[pi]
subcompact = "yes"
private = "Draft-00"
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
OpenID Connect specifies the public and pairwise subject identifier types. These types of subject identifiers allow relying parties to keep track of the End-User across multiple visits to the relying party application by correlating the subject identifier. This document specifies an ephemeral subject identifier type that prevents correlation of the subject identifier across multiple visits to enhance user privacy.


.# Warning

This document is not an OIDF International Standard. It is distributed for review and comment. It is subject to change without notice and may not be referred to as an International Standard.

Recipients of this draft are invited to submit, with their comments, notification of any relevant patent rights of which they are aware and to provide supporting documentation.


.# Foreword

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised by over 160 participating entities (workgroup participants). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established has the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

{mainmatter}

# Introduction
This document specifies an ephemeral subject identifier type for [OpenID Connect Core 1.0][OIDC]. The ephemeral subject identifier identifies the End-User for a short time and remains constant for the duration of the authentication session. In subsequent visits by the End-User to a Relying Party application that requires authentication, the authorization server will return a subject identifier with a different value. The authorization server provides an ephemeral subject identifier to the Relying Party in the ID Token and UserInfo endpoint response as specified by [OpenID Connect Core 1.0][OIDC].


# Requirements Notation and Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in BCP
14 [RFC2119] [RFC8174] when, and only when, they appear in all
capitals, as shown here.

In the .txt version of this document, values are quoted to indicate that they are to be taken literally. When using these values in protocol messages, the quotes MUST NOT be used as part of the value. In the HTML version of this document, values to be taken literally are indicated by the use of this fixed-width font.

# Terms and definitions

For the purpose of this document, the terms defined in [RFC6749], and [OpenID Connect Core 1.0][OIDC] apply.


# Ephemeral Identifier
This document adds a new subject identifier type as follows, in addition to what is defined in Section 8 of [OpenID Connect Core 1.0][OIDC]:

ephemeral
: This provides a different *sub* value to each visit by the End User to a relying party, so as not to enable Clients to correlate the End-User's multiple visits.


# OpenID Provider Discovery Metadata

The OpenID Provider indicates support for ephemeral subject identifiers in the metadata document.

This document defines the following new value for the _subject\_types\_supported_ metadata of [OpenID Discovery 1.0][OpenID.Discovery]:

* _ephemeral_ - ephemeral subject identifiers

# Client Registration

The RP requests the OP to return ephemeral subject identifiers by registering _ephemeral_ as the _subject\_type_ in [OpenID Dynamic Registration 1.0][OpenID.Registration] or by other means.

# Security Considerations

The generated ephemeral identifier needs to be unique over time.
Otherwise, the RP may link two different users to the same record and will cause a security incident.
One way to achieve uniqueness is to use the hash of the combination of a cryptographic
random and the timestamp as the *sub* value.

# Privacy Considerations

The privacy objectives of this document are as follows:

1.  to make it unfeasible for the RP to link two independent visits by the user. Inclusion of cryptographic random in the input to the hash function that generates the subject identifier would achieve it.
2.  to make it unfeasible for colluding RPs to link two independent visits among them.

# References

## Normative references
The following referenced documents are indispensable for the application of this document. For dated references, only the edition cited applied. For undated references, the latest edition of the referenced document (including any amendments) applies.

[BCP14] - Key words for use in RFCs to Indicate Requirement Levels
[BCP14]: https://tools.ietf.org/html/bcp14

[RFC2119] - Key words for use in RFCs to Indicate Requirement Levels
[RFC2119]: https://tools.ietf.org/html/rfc2119

[RFC8174] - Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words
[RFC8174]: https://tools.ietf.org/html/rfc8174

[RFC6749] - The OAuth 2.0 Authorization Framework
[RFC6749]: https://tools.ietf.org/html/rfc6749

[OIDC] - OpenID Connect Core 1.0 incorporating errata set 1
[OIDC]: https://openid.net/specs/openid-connect-core-1_0.html

[OpenID.Discovery] - OpenID Connect Discovery 1.0
[OpenID.Discovery]: https://openid.net/specs/openid-connect-discovery-1_0.html

[OpenID.Registration] - OpenID Connect Registration 1.0
[OpenID.Registration]: http://openid.net/specs/openid-connect-registration-1_0.html


{backmatter}

# Acknowledgements

We would like to thank the following people for their valuable feedback and contributions to this specification.

[[TBD]]

# Notices

Copyright (c) 2025 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft, Final Specification, or Final Specification Incorporating Errata Corrections solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts, Final Specifications, and Final Specification Incorporating Errata Corrections based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy (found at openid.net) requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. OpenID invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.

# Document History

[[ To be removed from the final specification ]]

-00

* initial revision

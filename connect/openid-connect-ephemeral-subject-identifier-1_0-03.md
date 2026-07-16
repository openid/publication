%%%
title = "OpenID Connect Ephemeral Subject Identifier 1.0 - Draft 03"
abbrev = "oidc-esid"
ipr = "none"
workgroup = "Connect"
keyword = ["openid", "ephemeral", "subject", "privacy"]

[seriesInfo]
name = "OpenID-Draft"
value = "openid-connect-ephemeral-subject-identifier-1_0-03"
status = "standard"

[pi]
subcompact = "yes"
private = "Draft-03"
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

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised of over 160 participating entities (workgroup participants). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established have the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

{mainmatter}

# Introduction
This document specifies an ephemeral subject identifier type for [OpenID Connect Core 1.0][OpenID.Core]. The ephemeral subject identifier identifies the End-User for a short time and remains constant for the duration of the authentication session. In subsequent visits by the End-User to a Relying Party application that requires authentication, the authorization server will return a subject identifier with a different value. The authorization server provides an ephemeral subject identifier to the Relying Party in the ID Token and UserInfo endpoint response as specified by [OpenID Connect Core 1.0][OpenID.Core]. 

There are several reasons for defining it:  

* It is already used in some ecosystems. Standardizing it would therefore reduce existing variations.
* It is a condition needed to mathematically prove that OpenID Connect with Self-Issued OpenID Provider fulfills the Unlinkability Level (UL) 3A+ defined in [ISO/IEC 27551] Information security, cybersecurity and privacy protection — Requirements for attribute-based unlinkable entity authentication.

Examples of attribute-based unlinkable entity authentication include Overage verification, Underage verification, Registered domicile verification, etc. 


# Requirements Notation and Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in [BCP14]
([RFC2119], [RFC8174]) when, and only when, they appear in all
capitals, as shown here.

In the .txt version of this document, values are quoted to indicate that they are to be taken literally. When using these values in protocol messages, the quotes MUST NOT be used as part of the value. In the HTML version of this document, values to be taken literally are indicated by the use of this fixed-width font.

# Terms and definitions

For the purpose of this document, the terms defined in [RFC6749], and [OpenID Connect Core 1.0][OpenID.Core] apply.


# Ephemeral Identifier
This document adds a new subject identifier type as follows, in addition to what is defined in Section 8 of [OpenID Connect Core 1.0][OpenID.Core]:

ephemeral
: type of an identifier when the sub provided by ID Token is different for every authentication request

To ensure that it is not possible for Clients to correlate multiple authentication responses, an OP 

1. MUST NOT reuse an ephemeral identifier value;
2. MUST generate the value with a guessing probability of 2^-128^ or less;
3. SHOULD target 2^-160^ or less; and
4. SHOULD generate the value with a collision probability that is infeasible for the expected lifetime and scale of the deployment.

# OpenID Provider Discovery Metadata

The OpenID Provider indicates support for ephemeral subject identifiers in the metadata document.

This document defines the following new value for the `subject_types_supported` metadata of [OpenID Discovery 1.0][OpenID Discovery]:

* `ephemeral` - ephemeral subject identifiers

# Client Registration

The RP requests the OP to return ephemeral subject identifiers by registering `ephemeral` as the `subject_type` in [OpenID Dynamic Client Registration 1.0][OpenID Registration] or by other means.

# Security Considerations

The security and privacy properties of ephemeral identifiers depend on non-reuse, unpredictability, and a sufficiently low probability of collision over the expected lifetime and scale of the deployment. Reuse or predictability can allow a Client to correlate multiple authentication responses. A collision can cause an RP to associate two different authentication responses, and potentially two different users, with the same local record, resulting in account mix-up, incorrect authorization decisions, information disclosure, or other security and privacy incidents.

Implementers need to generate ephemeral identifiers using a cryptographically secure source of randomness with sufficient entropy. General-purpose pseudo-random functions are not adequate. Constructions based on timestamps, process identifiers, counters, weak pseudo-random functions, or insufficiently seeded random number generators can be predictable or can repeat across processes, containers, virtual machines, or restarts. The effective guessing and collision resistance depends on the entropy actually provided by the generation process, not on the textual length or apparent syntax of the identifier.

# Privacy Considerations

The privacy objectives of this document are as follows:

1.  to make it unfeasible for the RP to link two independent visits by the user. Inclusion of cryptographic random in the input to the hash function that generates the subject identifier would achieve it.
2.  to make it unfeasible for colluding RPs to link two independent authentication responses among them.

# References

## Normative references
The following referenced documents are indispensable for the application of this document. For dated references, only the edition cited applies. For undated references, the latest edition of the referenced document (including any amendments) applies.

[BCP14] - Key words for use in RFCs to Indicate Requirement Levels
[BCP14]: https://tools.ietf.org/html/bcp14

[RFC2119] - Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997, <https://www.rfc-editor.org/info/rfc2119>.
[RFC2119]: https://tools.ietf.org/html/rfc2119

[RFC8174] - Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, DOI 10.17487/RFC8174, May 2017, <https://www.rfc-editor.org/info/rfc8174>.
[RFC8174]: https://tools.ietf.org/html/rfc8174

[RFC6749] - Hardt, D., Ed., "The OAuth 2.0 Authorization Framework", RFC 6749, DOI 10.17487/RFC6749, October 2012, <https://www.rfc-editor.org/info/rfc6749>.
[RFC6749]: https://tools.ietf.org/html/rfc6749

[OpenID.Core] - Sakimura, N., Bradley, J., Jones, M., de Medeiros, B., and C. Mortimore, "OpenID Connect Core 1.0 incorporating errata set 2", 15 December 2023, <https://openid.net/specs/openid-connect-core-1_0.html>.
[OpenID.Core]: https://openid.net/specs/openid-connect-core-1_0.html

[OpenID Discovery] - Sakimura, N., Bradley, J., Jones, M.B., and E. Jay, "OpenID Connect Discovery 1.0", 15 December 2023, <https://openid.net/specs/openid-connect-discovery-1_0.html>.
[OpenID Discovery]: https://openid.net/specs/openid-connect-discovery-1_0.html

[OpenID Registration] - Sakimura, N., Bradley, J., and M.B. Jones, "OpenID Connect Dynamic Client Registration 1.0", 15 December 2023, <https://openid.net/specs/openid-connect-registration-1_0.html>.
[OpenID Registration]: https://openid.net/specs/openid-connect-registration-1_0.html

## Informative references

[ISO/IEC 27551] - Information security, cybersecurity and privacy protection — Requirements for attribute-based unlinkable entity authentication
[ISO/IEC 27551]: https://www.iso.org/standard/72018.html

{backmatter}

# Acknowledgements

We would like to thank the following people for their valuable feedback and contributions to this specification.

* Frederik Krogsdal Jacobsen
* Mark Haine
* Andy Barlow
* Edmund Jay
* Nat Sakimura

<reference anchor="OpenID.Core" target="https://openid.net/specs/openid-connect-core-1_0.html">
  <front>
    <title>OpenID Connect Core 1.0 incorporating errata set 2</title>
    <author initials="N." surname="Sakimura" fullname="Nat Sakimura">
      <organization>NRI</organization>
    </author>
    <author initials="J." surname="Bradley" fullname="John Bradley">
      <organization>Ping Identity</organization>
    </author>
    <author initials="M." surname="Jones" fullname="Michael B. Jones">
      <organization>Microsoft</organization>
    </author>
    <author initials="B." surname="de Medeiros" fullname="Breno de Medeiros">
      <organization>Google</organization>
    </author>
    <author initials="C." surname="Mortimore" fullname="Chuck Mortimore">
      <organization>Salesforce</organization>
    </author>
   <date day="15" month="December" year="2023"/>
  </front>
</reference>

<reference anchor="OpenID.Discovery" target="https://openid.net/specs/openid-connect-discovery-1_0.html">
  <front>
    <title>OpenID Connect Discovery 1.0</title>

    <author fullname="Nat Sakimura" initials="N." surname="Sakimura">
      <organization abbrev="NAT.Consulting (was at NRI)">NAT.Consulting</organization>
    </author>

    <author fullname="John Bradley" initials="J." surname="Bradley">
      <organization abbrev="Yubico (was at Ping Identity)">Yubico</organization>
    </author>

    <author fullname="Michael B. Jones" initials="M.B." surname="Jones">
      <organization abbrev="Self-Issued Consulting (was at Microsoft)">Self-Issued Consulting</organization>
    </author>

    <author fullname="Edmund Jay" initials="E." surname="Jay">
      <organization abbrev="Illumila">Illumila</organization>
    </author>

    <date day="15" month="December" year="2023"/>
  </front>
</reference>

<reference anchor="OpenID.Registration" target="https://openid.net/specs/openid-connect-registration-1_0.html">
  <front>
    <title>OpenID Connect Dynamic Client Registration 1.0</title>

    <author fullname="Nat Sakimura" initials="N." surname="Sakimura">
      <organization abbrev="NAT.Consulting (was at NRI)">NAT.Consulting</organization>
    </author>

    <author fullname="John Bradley" initials="J." surname="Bradley">
      <organization abbrev="Yubico (was at Ping Identity)">Yubico</organization>
    </author>

    <author fullname="Michael B. Jones" initials="M.B." surname="Jones">
      <organization abbrev="Self-Issued Consulting (was at Microsoft)">Self-Issued Consulting</organization>
    </author>

    <date day="15" month="December" year="2023"/>
  </front>
</reference>


<reference anchor="ISO.27551" target="https://www.iso.org/standard/72018.html">
  <front>
    <title>Information security, cybersecurity and privacy protection — Requirements for attribute-based unlinkable entity authentication</title>

    <date month="September" year="2021" />
  </front>
</reference>

# Notices

Copyright (c) 2026 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft, Final Specification, or Final Specification Incorporating Errata Corrections solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts, Final Specifications, and Final Specification Incorporating Errata Corrections based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy (found at openid.net) requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. OpenID invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.

# Document History

[[ To be removed from the final specification ]]

-03 Made the Security Consideration more explanatory. Reworded 'visits' in Privacy Consideration. 

-02 Tightened the ephemeral identifier definition. Added names to acknowledgements. 

-01 Added rationale for this document and a reference to [ISO/IEC 27551].

* initial revision

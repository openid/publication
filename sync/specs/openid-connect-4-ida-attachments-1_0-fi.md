%%%
title = "OpenID Attachments 1.0"
abbrev = "openid-connect-4-ida-attachments-1_0"
ipr = "none"
workgroup = "eKYC-IDA"
keyword = ["security", "openid", "identity assurance", "ekyc", "claims"]

[seriesInfo]
name = "Internet-Draft"

value = "openid-connect-4-ida-attachments-1_0-02"

status = "standard"

[[author]]
initials="T."
surname="Lodderstedt"
fullname="Torsten Lodderstedt"
organization="sprind.org"
    [author.address]
    email = "torsten@lodderstedt.net"

[[author]]
initials="D."
surname="Fett"
fullname="Daniel Fett"
organization="Authlete"
    [author.address]
    email = "mail@danielfett.de"

[[author]]
initials="M."
surname="Haine"
fullname="Mark Haine"
organization="Considrd.Consulting Ltd"
    [author.address]
    email = "mark@considrd.consulting"

[[author]]
initials="A."
surname="Pulido"
fullname="Alberto Pulido"
organization="Santander"
    [author.address]
    email = "alberto.pulido@santander.co.uk"

[[author]]
initials="K."
surname="Lehmann"
fullname="Kai Lehmann"
organization="1&1 Mail & Media Development & Technology GmbH"
    [author.address]
    email = "kai.lehmann@1und1.de"

[[author]]
initials="K."
surname="Koiwai"
fullname="Kosuke Koiwai"
organization="KDDI Corporation"
    [author.address]
    email = "ko-koiwai@kddi.com"

%%%

.# Abstract

This document defines a way of representing binary data in the context of a JSON payload. It can be used as an extension of OpenID Connect that defines new attachments relating to the identity of a natural person or in other JSON contexts that have binary data elements. The work and the preceding drafts are the work of the eKYC and Identity Assurance working group of the OpenID Foundation.

.# Introduction {#Introduction}

This document defines an attachment element as a JWT claim for use in various contexts.

Attachment element was inspired by the work done on [@OpenID4IDA] and in particular how to include images of various pieces of evidence used as part of an identity assurance process. However, it is anticipated that there are other cases where the ability to embed or refer to non-JSON structured data is useful.

.# Foreword

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised of over 160 participating entities. The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established have the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

Final drafts adopted by the Workgroup through consensus are circulated publicly for the public review for 60 days and for the OIDF members for voting. Publication as an OIDF Standard requires approval by at least 50% of the members casting a vote. There is a possibility that some of the elements of this document may be subject to patent rights. OIDF shall not be held responsible for identifying any or all such patent rights.

.# Notational conventions

The keywords "shall", "shall not", "should", "should not", "may", and "can" in
this document are to be interpreted as described in ISO Directive Part 2
[@!ISODIR2]. These keywords are not used as dictionary terms such that any
occurrence of them shall be interpreted as keywords and are not to be
interpreted with their natural language meanings.

{mainmatter}

# Scope

This document defines how embedded and external attachments are used.

# Normative references

See section 9 for normative references.

# Terms and definitions
No terms and definitions are listed in this document.

# Attachments {#attachments}

There are potentially a wide range of use cases where representing binary data in the context of a JSON payload might be useful. One example is when evidence is used in identity verification process, specific document artifacts (such as images of that evidence) might need to be presented and, depending on the trust framework, might need to be stored by the recipient for a period. These artifacts can then, for example, be reviewed during audit or quality control. These artifacts include, but are not limited to:

* scans of filled and signed forms documenting/certifying the verification process itself
* scans or photographs of the documents used to verify the identity of end-users
* video recordings of the verification process
* certificates of electronic signatures

The intent is that this document can be referenced by any implementer or specification author where the ability to convey binary artifacts that relate to a JSON structure is useful.

When using OpenID Connect and requested by the RP, these artifacts can be included as part of an ID token or UserInfo response, and in particular part of an [@OpenID4IDA] `verified_claims` element allowing the RP to store these artifacts along with the other `verified_claims` information.

An attachment is part of JSON object. This document allows for two types, "Embedded" or "External".

## Embedded attachments

All the information of the attached artifact (including the content itself) is provided within a JSON object having the following elements:

`desc`: Optional. Description of the document. This can be the filename or just an explanation of the content. The used language is not specified, but is usually bound to the jurisdiction of the underlying trust framework of the OP.

`type`: Optional. A type identifier that indicates the type of attachment contained in the `content` element.  Values for this element should be handled as described in the section below about Predefined Values.

`content_type`: Required. Content (MIME) type of the document. See [@!RFC6838]. Multipart or message media types are not allowed. Example: "image/png"

`content`: Required. Base64 encoded representation of the document content. See [@!RFC4648].

The following example shows embedded attachments within an OpenID Connect UserInfo endpoint response. The actual contents of the attached documents are truncated:

<{{examples/response/embedded_attachments.json}}

Note: Due to their size, embedded attachments are not always appropriate when embedding in objects such as access tokens or ID Tokens.

## External attachments

External attachments are similar to distributed claims as defined in [@OpenID] in that the binary content is accessible as a referenced resource that is separate from the JSON object. The difference is that there are additional elements that provide more certainty that the binary object returned is the one intended when the assertion containing the attachment was created. The reference to the external attachment is provided in a JSON object with the following elements:

`desc`: Optional. Description of the document. This can be the filename or just an explanation of the content. The used language is not specified, but is usually bound to the jurisdiction of the underlying trust framework or the OP.

`type`: Optional. A type identifier that indicates the type of attachment linked via `url` element.  Values for this element should be handled as described in the section below about Predefined Values.

`url`: Required. OAuth 2.0 [@RFC6749] protected resource endpoint from which the attachment can be retrieved. Providers shall protect this endpoint, ensuring that the attachment cannot be retrieved by unauthorized parties (typically by requiring an access token as described below). The endpoint URL shall return the attachment whose cryptographic hash matches the value given in the `digest` element. The content MIME type of the attachment shall be indicated in a content-type HTTP response header, as per [@!RFC6838]. Multipart or message media types shall not be used.

`access_token`: Optional. Access token as type `string` enabling retrieval of the attachment from a Resource server at the given `url`. The attachment shall be requested using the OAuth 2.0 Bearer Token Usage [@!RFC6750] protocol and the OP shall support this method, unless another token type or method has been negotiated between the OP and the client. Use of other token types is outside the scope of this document. If the `access_token` element is not available or the value of the `access_token` element is `null` then the RP shall use the access token issued by the OP in the token response, unless an alternative effective method to protect the `url` endpoint from unauthorized access has been negotiated between the OP and the client.

`exp`: Optional. The "exp" (expiration time) claim identifies the expiration time on or after which the external attachment will not be available from the resource endpoint defined in the `url` element (e.g. the `access_token` will expire or the document will be removed at that time). Implementers may provide for some small leeway, usually no more than a few minutes, to account for clock skew.  Its value shall be a number containing a NumericDate value as per [@!RFC7519].

`digest`: Required. JSON object containing details of a cryptographic hash of the document content taken over the bytes of the payload (and not, e.g., the representation in the HTTP response). The JSON object has the following elements:

* `alg`: Required. Specifies the algorithm used for the calculation of the cryptographic hash. The algorithm has been negotiated previously between RP and OP during client registration or management.
* `value`: Required. Base64-encoded [@RFC4648] bytes of the cryptographic hash.

Access tokens for external attachments should be bound to the specific resource being requested so that the access token may not be used to retrieve additional external attachments or resources. For example, the value of `url` could be tied to the access token as audience. This enhances security by enabling the resource server to check whether the audience of a presented access token matches the accessed URL and reject the access when they do not match. The same idea is described in Resource Indicators for OAuth 2.0 [@RFC8707], which defines the `resource` request parameter whereby to specify one or more resources which should be tied to an access token being issued.

The following example shows external attachments:

<{{examples/response/external_attachments.json}}

## External attachment validation

Clients shall validate each external attachment they wish to rely on in the following manner:

1. Ensure that the object includes the required elements: `url`, `digest`.
2. Ensure that, when an `exp` element is present, the request to the value in `url` is made before the time represented by the `exp` element.
3. Ensure that the URL defined in the `url` element uses the `https` scheme.
4. Ensure that the `digest` element contains both `alg` and `value` keys.
5. Retrieve the attachment from the `url` element in the object.
6. Ensure that the content MIME type of the attachment is indicated in a content-type HTTP response header
7. Ensure that the MIME type is not multipart (see Section 5.1 of [@RFC2046])
8. Ensure that the MIME type is not a "message" media type (see [@RFC5322])
9. Ensure the returned attachment has a cryptographic hash digest that matches the value given in the `digest` object's `value` and algorithm defined in the value of the `alg` element.

If any of these requirements are not met, do not use the content of the attachment, discard it and do not rely upon it.

# Privacy considerations

As attachments will most likely contain more personal information than was requested by the RP with specific claim names, an OP shall ensure that the end-user is well aware of when and what kind of attachments are about to be transferred to the RP. If possible or applicable, the OP should allow the end-user to review the content of these attachments before giving consent to the transaction.

# Security considerations

When using attachments containing personal information, implementers should choose a well tested and well-supported hashing function. Cryptographic hash functions take as input a message of arbitrary length and produce a fixed length message digest and are employed as a data integrity mechanism for non-repudiation. The OP should ensure that hash functions and algorithms used follow the recommendedations of an appropriate standards body. Lists of approved digest/hash function names and status are maintained by NIST CSRC in [@nist_approved_hash_algorithms] (established in [@FIPSSP180-4] and [@FIPSSP202]), by ISO as established in [@ISO10118-3], and by EPC as esablished in [@EPCCryptoAlgoUsage].

# Client registration and management {#client_metadata_parameters}

If external attachments are used in the context of an OpenID Provider that uses mechanisms such as [@!OpenID-Registration] or [@RFC7592] to gather client details the following additional properties should be available as part of any client registration or client management interactions:

`digest_algorithm`: String value representing the chosen digest algorithm (for external attachments). The value shall be one of the digest algorithms supported by the OP as advertised in the [OP metadata](#opmetadata). If this property is not set, `sha-256` will be used by default.

# OP metadata {#opmetadata}

If attachments are used in [@OpenID] implementations, an additional element of OP Metadata is required to advertise its capabilities with respect to supported attachments in its openid-configuration (see [@!OpenID-Discovery]):

`attachments_supported`: Required when OP supports attachments. JSON array containing all attachment types supported by the OP. Possible values are `external` and `embedded`. When present, this array shall have at least one member. If omitted, the OP does not support attachments.

`digest_algorithms_supported`: Required when OP supports external attachments. JSON array containing all supported digest algorithms which can be used as `alg` property within the digest object of external attachments.

This is an example openid-configuration snippet:

```json
{
...
  "attachments_supported": [
    "external",
    "embedded"
  ],
  "digest_algorithms_supported": [
    "sha-256"
  ],
...
}
```

# Predefined values {#predefined_values}

This document focuses on the technical mechanisms to convey attachments and thus does not define any identifiers for the many attachment types. This is left to adopters of the technical specification, e.g., implementers, identity schemes, or jurisdictions.

Each party defining such identifiers shall ensure the collision resistance of these identifiers. This can be achieved by including a domain name under the control of this party into the identifier name, e.g., `https://mycompany.com/identifiers/cool_check_method`.

The eKYC and Identity Assurance Working Group maintains a wiki page [@!predefined_values_page] that can be utilized to share predefined values with other parties and may reference any registry that emerges in the future.

# Examples

This section contains JSON snippets showing examples of evidences and attachments described in this document.

## Example requests
This section shows examples of requests for `verified_claims`.

### Verification of claims by trust framework with a document and attachments

<{{examples/request/verification_aml_with_attachments.json}}

#### Attachments

RPs can explicitly request to receive attachments along with the verified claims:

<{{examples/request/verification_with_attachments.json}}

As with other claims, the attachment claim can be marked as `essential` in the request as well.

## Example responses

This section shows examples of responses containing `verified_claims`.

Note: examples of embedded attachments contain truncated values.

### Document with external attachments

<{{examples/response/document_with_attachments.json}}

### Utility statement with attachments

<{{examples/response/utility_statement_with_attachments.json}}

### Vouch with embedded attachments

<{{examples/response/vouch_with_attachments.json}}

{backmatter}

<reference anchor="ISODIR2" target="https://www.iso.org/sites/directives/current/part2/index.xhtml">
<front>
<title>ISO/IEC Directives, Part 2 - Principles and rules for the structure and drafting of ISO and IEC documents</title>
    <author fullname="ISO/IEC">
      <organization>ISO/IEC</organization>
    </author>
</front>
</reference>

<reference anchor="OpenID" target="http://openid.net/specs/openid-connect-core-1_0.html">
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

<reference anchor="OpenID4IDA" target="http://openid.net/specs/openid-connect-4-identity-assurance-1_0.html">
  <front>
    <title>OpenID Connect for Identity Assurance 1.0</title>
    <author initials="T." surname="Lodderstedt" fullname="Torsten Lodderstedt">
      <organization>sprind.org</organization>
    </author>
    <author initials="D." surname="Fett" fullname="Daniel Fett">
      <organization>Authlete</organization>
    </author>
    <author initials="M." surname="Haine" fullname="Mark Haine">
      <organization>Considrd.Consulting Ltd</organization>
    </author>
    <author initials="A." surname="Pulido" fullname="Alberto Pulido">
      <organization>Santander</organization>
    </author>
    <author initials="K." surname="Lehmann" fullname="Kai Lehmann">
      <organization>1&amp;1 Mail &amp; Media Development &amp; Technology GmbH</organization>
    </author>
        <author initials="K." surname="Koiwai" fullname="Kosuke Koiwai">
      <organization>KDDI Corporation</organization>
    </author>
   <date day="16" month="Jun" year="2023"/>
  </front>
</reference>

<reference anchor="ISO3166-1" target="https://www.iso.org/standard/72482.html">
    <front>
      <title>ISO 3166-1:2020. Codes for the representation of names of
      countries and their subdivisions -- Part 1: Country codes</title>
      <author surname="International Organization for Standardization">
        <organization abbrev="ISO">International Organization for Standardization</organization>
      </author>
      <date year="2020" />
    </front>
</reference>

<reference anchor="ISO3166-3" target="https://www.iso.org/standard/72482.html">
    <front>
      <title>ISO 3166-3:2020. Codes for the representation of names of countries and their subdivisions -- Part 3: Code for formerly used names of countries</title>
      <author surname="International Organization for Standardization">
        <organization abbrev="ISO">International Organization for
        Standardization</organization>
      </author>
      <date year="2020" />
    </front>
</reference>

<reference anchor="ICAO-Doc9303" target="https://www.icao.int/publications/Documents/9303_p3_cons_en.pdf">
  <front>
    <title>Machine Readable Travel Documents, Seventh Edition, 2015, Part 3: Specifications Common to all MRTDs</title>
      <author surname="International Civil Aviation Organization">
        <organization>International Civil Aviation Organization</organization>
      </author>
   <date year="2015"/>
  </front>
</reference>

<reference anchor="E.164" target="https://www.itu.int/rec/T-REC-E.164/en">
  <front>
    <title>Recommendation ITU-T E.164</title>
    <author>
      <organization>ITU-T</organization>
    </author>
    <date year="2010" month="11"/>
  </front>
</reference>

<reference anchor="OpenID-Discovery" target="https://openid.net/specs/openid-connect-discovery-1_0.html">
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

<reference anchor="OpenID-Registration" target="https://openid.net/specs/openid-connect-registration-1_0.html">
  <front>
    <title>OpenID Connect Dynamic Client Registration 1.0 incorporating errata set 1</title>
    <author initials="N." surname="Sakimura" fullname="Nat Sakimura">
      <organization>NRI</organization>
    </author>
    <author initials="J." surname="Bradley" fullname="John Bradley">
      <organization>Ping Identity</organization>
    </author>
    <author initials="M." surname="Jones" fullname="Mike Jones">
      <organization>Microsoft</organization>
    </author>
   <date day="8" month="Nov" year="2014"/>
  </front>
</reference>

<reference anchor="RFC4648" target="https://www.rfc-editor.org/info/rfc4648">
  <front>
    <title>The Base16, Base32, and Base64 Data Encodings</title>
    <author initials="S." surname="Josefsson" fullname="S. Josefsson">
      <organization>SJD</organization>
    </author>
   <date month="Oct" year="2006"/>
  </front>
</reference>

<reference anchor="RFC6749" target="https://www.rfc-editor.org/info/rfc6749">
  <front>
    <title>The OAuth 2.0 Authorization Framework</title>
    <author initials="D." surname="Hardt" fullname="Dick Hardt">
      <organization>Microsoft</organization>
    </author>
   <date month="Oct" year="2012"/>
  </front>
</reference>

<reference anchor="nist_approved_hash_algorithms" target="https://csrc.nist.gov/projects/hash-functions#approved-algorithms">
  <front>
    <title>NIST CSRC Approved Hash Functions</title>
    <author>
      <organization>NIST</organization>
    </author>
    <date month="Sept" year="2024"/>
  </front>
</reference>

<reference anchor="FIPSSP180-4" target="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf">
  <front>
    <title>FIPS PUB 180-4, Secure Hash Standard</title>
    <author>
      <organization>National Institute of Standards and Technology</organization>
    </author>
   <date day="4" month="Aug" year="2015"/>
  </front>
</reference>

<reference anchor="FIPSSP202" target="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf">
  <front>
    <title>FIPS PUB 202, SHA-3 Standard: Permutation-Based Hash and Extendable-Output Functions</title>
    <author>
      <organization>National Institute of Standards and Technology</organization>
    </author>
   <date day="4" month="Aug" year="2015"/>
  </front>
</reference>

<reference anchor="ISO10118-3" target="https://www.iso.org/obp/ui/en/#iso:std:iso-iec:10118:-3:ed-4:v1:en">
  <front>
    <title>ISO/IEC 10118-3:2018 IT Security techniques - Hash-functions - Part 3: Dedicated hash-functions</title>
    <author>
      <organization>International Organization for Standardization</organization>
    </author>
   <date month="Oct" year="2018"/>
  </front>
</reference>

<reference anchor="EPCCryptoAlgoUsage" target="https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2022-03/EPC342-08%20v11.0%20Guidelines%20on%20Cryptographic%20Algorithms%20Usage%20and%20Key%20Management.pdf">
  <front>
    <title>Guidelines on cryptographic algorithms usage and key management</title>
    <author>
      <organization>European Payments Council</organization>
    </author>
   <date day = "8" month="Mar" year="2022"/>
  </front>
</reference>

<reference anchor="predefined_values_page" target="https://openid.net/wg/ekyc-ida/identifiers/">
  <front>
    <title>Overview page for predefined values</title>
    <author>
      <organization>OpenID Foundation</organization>
    </author>
    <date year="2021"/>
  </front>
</reference>

<reference anchor="IANA.OAuth.Parameters" target="https://www.iana.org/assignments/oauth-parameters">
  <front>
    <title>OAuth Parameters</title>
    <author>
      <organization>IANA</organization>
    </author>
    <date/>
  </front>
</reference>

# IANA Considerations

## OAuth Authorization Server Metadata Registry

This specification registers the following authorization server metadata parameters
in the IANA "OAuth Authorization Server Metadata" registry [@IANA.OAuth.Parameters]
established by [@!RFC8414].

### attachments_supported

* Metadata Name: `attachments_supported`
* Metadata Description: An array containing a list attachment types supported by the OP
* Change Controller: OpenID Foundation eKYC & IDA Working Group - openid-specs-ekyc-ida@lists.openid.net
* Reference: (#opmetadata) of this specification

### digest_algorithms_supported

* Metadata Name: `digest_algorithms_supported`
* Metadata Description: An array containing a list of values, where each value is a string identifying a digest algorithm supported by the OP in the context of an external attachment.
* Change Controller: OpenID Foundation eKYC & IDA Working Group - openid-specs-ekyc-ida@lists.openid.net
* Reference: (#opmetadata) of this specification

## OAuth Dynamic Client Registration Metadata Registry

This specification registers the following client metadata parameters
in the IANA "OAuth Dynamic Client Registration Metadata" registry [@IANA.OAuth.Parameters]
established by [@!RFC7591].

### digest_algorithm

* Client Metadata Name: `digest_algorithm`
* Client Metadata Description: An element containing a single value, where the value of the string identifies the digest algorithm chosen the client to used by the OP when presenting any external attachments
* Change Controller: OpenID Foundation eKYC & IDA Working Group - openid-specs-ekyc-ida@lists.openid.net
* Reference: (#client_metadata_parameters) of this specification

# Acknowledgements {#Acknowledgements}

The following people at yes.com and partner companies contributed to the concept described in the initial contribution to this document: Karsten Buch, Lukas Stiebig, Sven Manz, Waldemar Zimpfer, Willi Wiedergold, Fabian Hoffmann, Daniel Keijsers, Ralf Wagner, Sebastian Ebling, Peter Eisenhofer.

We would like to thank Julian White, Bjorn Hjelm, Stephane Mouy, Alberto Pulido, Joseph Heenan, Vladimir Dzhuvinov, Azusa Kikuchi, Naohiro Fujie, Takahiko Kawasaki, Sebastian Ebling, Marcos Sanz, Tom Jones, Mike Pegman, Michael B. Jones, Jeff Lombardo, Taylor Ongaro, Peter Bainbridge-Clayton, Adrian Field, George Fletcher, Tim Cappalli, Michael Palage, Sascha Preibisch, Giuseppe De Marco, Nick Mothershaw, Hodari McClain, Nat Sakimura and Dima Postnikov for their valuable feedback and contributions that helped to evolve this document.

# Notices

Copyright (c) 2025 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer,
or other interested party a non-exclusive, royalty free, worldwide copyright license to
reproduce, prepare derivative works from, distribute, perform and display, this
Implementers Draft, Final Specification, or Final Specification Incorporating Errata
Corrections solely for the purposes of (i) developing specifications, and (ii)
implementing Implementers Drafts, Final Specifications, and Final Specification
Incorporating Errata Corrections based on such documents, provided that attribution
be made to the OIDF as the source of the material, but that such attribution does not
indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions
from various sources, including members of the OpenID Foundation and others.
Although the OpenID Foundation has taken steps to help ensure that the technology
is available for distribution, it takes no position regarding the validity or scope of any
intellectual property or other rights that might be claimed to pertain to the
implementation or use of the technology described in this specification or the extent
to which any license under such rights might or might not be available; neither does it
represent that it has made any independent effort to identify any such rights. The
OpenID Foundation and the contributors to this specification make no (and hereby
expressly disclaim any) warranties (express, implied, or otherwise), including implied
warranties of merchantability, non-infringement, fitness for a particular purpose, or
title, related to this specification, and the entire risk as to implementing this
specification is assumed by the implementer. The OpenID Intellectual Property
Rights policy (found at openid.net) requires contributors to offer a patent promise not
to assert certain patent claims against other contributors and against implementers.
OpenID invites any interested party to bring to its attention any copyrights, patents,
patent applications, or other proprietary rights that may cover technology that may be
required to practice this specification.
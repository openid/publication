%%%
title = "OpenID Identity Assurance Schema Definition 1.0"
abbrev = "openid-ida-verified-claims-1_0"
ipr = "none"
workgroup = "eKYC-IDA"
keyword = ["security", "openid", "identity assurance", "ekyc", "claims"]

[seriesInfo]
name = "Internet-Draft"

value = "openid-ida-verified-claims-1_0-02"

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

This specification defines a payload schema that can be used to describe a wide variety of identity assurance metadata about a number of claims that have been assessed as meeting a given assurance level.

It is intended that this payload schema is re-usable across many different contexts and application layer protocols including but not limited to [@!OpenID] and [@W3C_VCDM].

This document defines a new claim relating to the identity assurance of a natural person called "verified_claims".  This was originally developed within earlier drafts of OpenID Connect for Identity Assurance. The work and the preceding drafts are the work of the eKYC and Identity Assurance working group of the OpenID Foundation.

.# Foreword

The OpenID Foundation (OIDF) promotes, protects and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised by over 160 participating entities (workgroup participant). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established have the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

Final drafts adopted by the Workgroup through consensus are circulated publicly for the public review for 60 days and for the OIDF members for voting. Publication as an OIDF Standard requires approval by at least 50% of the members casting a vote. There is a possibility that some of the elements of this document may be subject to patent rights. OIDF shall not be held responsible for identifying any or all such patent rights.

.# Introduction {#Introduction}

This specification defines a schema for describing assured identity claims and a range of associated identity assurance metadata. Much of this definition will be optional as it depends on which processes were run, and the operational requirements for data-minimization, which elements of the JSON schema described in this document will be needed for a specific transaction.

.# Warning

This document is not an OIDF International Standard. It is distributed for
review and comment. It is subject to change without notice and may not be
referred to as an International Standard.

Recipients of this draft are invited to submit, with their comments,
notification of any relevant patent rights of which they are aware and to
provide supporting documentation.

.# Notational conventions

The keywords "shall", "shall not", "should", "should not", "may", and "can" in
this document are to be interpreted as described in ISO Directive Part 2
[@!ISODIR2]. These keywords are not used as dictionary terms such that any
occurrence of them shall be interpreted as keywords and are not to be
interpreted with their natural language meanings.

{mainmatter}

# Scope

This specification defines the schema of JSON objects used to describe identity assurance relating to a natural person.  It consists of the definition of a new claim called `verified_claims` that will be registered with the IANA "JSON Web Token Claims Registry" established by [@!RFC7519].  As part of the definition of the `verified_claims` claim there is also be an element defined called `verification` that provides a flexible container for identity assurance metadata. It is anticipated that the `verification` element may be used by other spec authors and implementers where the verification metadata is needed independently of the end-user verified claims.

# Normative references

See section 6 for normative references.

# Terms and definitions

For the purposes of this document, the following terms and definitions apply.

## claim
piece of information asserted about an entity

[SOURCE: [@!OpenID], 1.2]

## claim provider
server that can return claims and verified claims about an entity

Note 1 to entry : A claim provider could be an OpenID Connect provider, a verifiable claim issuer or other application component that provides verified claims.

[SOURCE: [@!OpenID], 1.2, modified - added requirement to return verified claims]

## claim recipient
application that receives claims from the claim provider

## identity proofing
process in which an end-user provides evidence to a provider reliably identifying themselves, thereby allowing the provider to assert that identification at a useful assurance level.

## identity verification
process conducted by the provider to verify the end-user's identity.

## identity assurance
process in which the provider asserts identity data of a certain end-user with a certain assurance towards another consuming entity (such as a relying party or verifier as described in [@W3C_VCDM]), typically expressed by way of an assurance level

Note 1 to entry: Depending on legal requirements, the provider can be required to provide evidence of the identity verification process to the consuming entity.

## verified claims
claims about an end-user, typically a natural person, whose binding to a particular end-user account was verified in the course of an identity verification process.

# Requirements

The specified JSON structures defined in this document should be usable by any protocol that needs to pass assured digital identity attributes or needs to transfer identity assurance metadata between systems using the [@JSON] Data Interchange Format.

# Verified claims {#verified_claims}

## General
This specification defines a generic mechanism to add verified claims to JSON-based assertions. It uses a container element, called `verified_claims`, to provide the claim recipient with a set of claims along with the respective metadata and verification evidence related to the verification of these claims. This way, claim recipients cannot mix up verified claims and unverified claims and accidentally process unverified claims as verified claims.

The following example would assert to the claim recipient that the claim provider has verified the claims provided (`given_name` and `family_name`) according to an example trust framework `trust_framework_example`:

<{{examples/response/verified_claims_simple.json}}

The normative definition is given in the following.

## Base elements

`verified_claims`: A single object or an array of objects, each object comprising the following sub-elements:

* `claims`: Required. Object that is the container for the verified claims about the end-user.
* `verification`: Required. Object that contains data about the verification process.

Note: Implementations shall ignore any sub-element not defined in this specification or extensions of this specification. Extensions to this specification that specify additional sub-elements under the `verified_claims` element may be created by the OpenID Foundation, ecosystem or scheme operators or indeed singular implementers using this specification.

A machine-readable syntax definition of `verified_claims` is given as JSON schema in [@verified_claims.json], it can be used to automatically validate JSON documents containing a `verified_claims` element. The provided JSON schema files are a non-normative implementation of this specification and any discrepancies that exist are either implementation bugs or interpretations.

Extensions of this specification, including trust framework definitions, can define further constraints on the data structure.

## Claims element {#claimselement}

The `claims` element contains the claims about the end-user which were verified by the process and according to the policies determined by the corresponding `verification` element described in the next section.

The `claims` element may contain any of the following claims as defined in section 5.1 of the OpenID Connect specification [@!OpenID]

* `name`
* `given_name`
* `middle_name`
* `family_name`
* `birthdate`
* `address`

and the claims defined in [@OpenID4IDAClaims].

The `claims` element may also contain other claims provided the value of the respective claim was verified in the verification process represented by the sibling `verification` element.

Claim names may be annotated with language tags as specified in section 5.2 of the OpenID Connect specification [@!OpenID].

The `claims` element may be empty, to support use cases where verification is required but no claims data needs to be shared.

## Verification element {#verification}

### General

This element contains the information about the process conducted to verify a person's identity and bind the respective person data to a user account.

### Element structure

The `verification` element can be used independently of OpenID Connect and OpenID Connect for Identity Assurance where there is a need for representation of identity assurance metadata in a different application protocol or digital identity data format such as [@W3C_VCDM].

The `verification` element consists of the following elements:

* `trust_framework`: Required. String determining the trust framework governing the identity verification process of the claim provider.
An example value is `eidas`, which denotes a notified eID system under eIDAS [@eIDAS].

Claim recipients should ignore `verified_claims` claims containing a trust framework identifier they do not understand.

The `trust_framework` value determines what further data is provided to the claim recipient in the `verification` element. A notified eID system under eIDAS, for example, would not need to provide any further data whereas a claim provider not governed by eIDAS would need to provide verification evidence in order to allow the claim recipient to fulfill its legal obligations. An example of the latter is a claim provider acting under the German anti-money laundering law (`de_aml`).

* `assurance_level`: Optional. String determining the assurance level associated with the end-user claims in the respective `verified_claims`. The value range depends on the respective `trust_framework` value. For example, the trust framework `eidas` can have the identity assurance levels `low`, `substantial` and `high`. For information on predefined trust framework and assurance level values see [@!predefined_values_page].

* `assurance_process`: Optional. JSON object representing the assurance process that was followed. This reflects how the evidence meets the requirements of the `trust_framework` and `assurance_level`. The factual record of the evidence and the procedures followed are recorded in the `evidence` element; this element is used to cross reference the `evidence` to the `assurance_process` followed. This has one or more of the following sub-elements:
  * `policy`: Optional. String representing the standard or policy that was followed.
  * `procedure`: Optional. String representing a specific procedure from the `policy` that was followed.
  * `assurance_details`: Optional. JSON array denoting the details about how the evidence complies with the `policy`. When present this array shall have at least one member. Each member can have the following sub-elements:
     * `assurance_type`: Optional. String denoting which part of the `assurance_process` the evidence fulfills.
    * `assurance_classification`: Optional. String reflecting how the `evidence` has been classified or measured as required by the `trust_framework`.
    * `evidence_ref`: Optional. JSON array of the evidence being referred to. When present this array shall have at least one member.
      * `check_id`: Required. Identifier referring to the `check_id` key used in the `check_details` element of members of the `evidence` array. The claim provider shall ensure that `check_id` is present in the `check_details` when `evidence_ref` element is used.
      * `evidence_metadata`: Optional. Object indicating any metadata about the `evidence` that is required by the `assurance_process` in order to demonstrate compliance with the `trust_framework`. It has the following sub-elements:
        * `evidence_classification`: Optional. String indicating how the process demonstrated by the `check_details` for the `evidence` is classified by the `assurance_process` in order to demonstrate compliance with the `trust_framework`.

* `time`: Optional. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date and time when the identity verification process took place. This time might deviate from (a potentially also present) `document/time` element since the latter represents the time when a certain evidence was checked whereas this element represents the time when the process was completed. Moreover, the overall verification process and evidence verification can be conducted by different parties (see `document/verifier`). Presence of this element might be required for certain trust frameworks.

* `verification_process`: Optional. Unique reference to the identity verification process as performed by the claim provider. Used for identifying and retrieving details in case of disputes or audits. Presence of this element might be required for certain trust frameworks.

* `evidence`: Optional. JSON array containing information about the evidence the claim provider used to verify the end-user's identity as separate JSON objects. Every object contains the property `type` which determines the type of the evidence. The claim recipient uses this information to process the `evidence` property appropriately.

Important: Implementations shall ignore any sub-element not defined in this specification or extensions of this specification.

### Minimum conformant

Based on the definition above and that there are a significant number of optional sub-elements it is informative to show a minimum conformant `verified_claims` payload.  There can be optionally much more detail included in an openid-ida-verified-claims conformant `verified_claims` element when further detail needs to be transferred. The example is not normative.

<{{examples/response/ida_minimum.json}}

### Evidence element {#evidence_element}

#### Evidence element structure

Members of the `evidence` array are structured with the following elements:

`type`: Required. The value defines the type of the evidence.

The following types of evidence are defined:

* `document`: Verification based on the content of a physical or electronic document provided by the end-user, e.g. a passport, ID card, PDF signed by a recognized authority, etc.
* `electronic_record`: Verification based on data or information obtained electronically from an approved, recognized, regulated or certified source, e.g. a government organization, bank, utility provider, credit reference agency, etc.
* `vouch`: Verification based on an attestation given by an approved or recognized natural person declaring they believe that the claim(s) presented by the end-user are, to the best of their knowledge, genuine and true.
* `electronic_signature`: Verification based on the use of an electronic signature that can be uniquely linked to the end-user and is capable of identifying the signatory, e.g. an eIDAS Advanced Electronic Signature (AES) or Qualified Electronic Signature (QES).

`attachments`: Optional. Array of JSON objects representing attachments like photocopies of documents or certificates. Structure of members of the `attachments` array is described in [@!Attachments].

Depending on the evidence type additional elements are defined, as described in the following.
#### Evidence type `document`

The following elements are contained in an evidence sub-element where type is `document`.

`type`: Required with value set to `document`.

`check_details`: Optional. JSON array representing the checks done in relation to the `evidence`. When present this array shall have at least one member.

  * `check_method`: Required. String representing the check done, this includes processes such as checking the authenticity of the document, or verifying the user's biometric against an identity document. For information on predefined `check_details` values see [@!predefined_values_page].
  * `organization`: Optional. String denoting the legal entity that performed the check. This should be included if the claim provider did not perform the check itself.
  * `check_id`: Optional. Identifier referring to the event where a check (either verification or validation) was performed. The claim provider shall ensure that this is present when `evidence_ref` element is used. The claim provider shall ensure that the transaction identifier can be resolved into transaction details during an audit.
  * `time`: Optional. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when the check was completed.

`document_details`: Optional. JSON object representing the document used to perform the identity verification. It consists of the following properties:

* `type`: Required. String denoting the type of the document. For information on predefined document values see [@!predefined_values_page]. The claim provider may use other predefined values in which case the claim recipients will either be unable to process the assertion, just store this value for audit purposes, or apply bespoke business logic to it.
* `document_number`: Optional. String representing an identifier/number that uniquely identifies a document that was issued to the end-user. This is used on one document and will change if it is reissued, e.g., a passport number, certificate number, etc.
* `serial_number`: Optional. String representing an identifier/number that identifies the document irrespective of any personalization information (this usually only applies to physical artifacts and is present before personalization).
* `date_of_issuance`: Optional. The date the document was issued as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `date_of_expiry`: Optional. The date the document will expire as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `issuer`: Optional. JSON object containing information about the issuer of this document. This object consists of the following properties:
    * `name`: Optional. Designation of the issuer of the document.
    * All elements of the OpenID Connect `address` claim (see [@!OpenID])
    * `country_code`: Optional. String denoting the country or supranational organization that issued the document as ISO 3166/ICAO 3-letter codes [@!ICAO-Doc9303], e.g., "USA" or "JPN". 2-letter ICAO codes may be used in some circumstances for compatibility reasons.
    * `jurisdiction`: Optional. String containing the name of the region(s)/state(s)/province(s)/municipality(ies) that issuer has jurisdiction over (if this information is not common knowledge or derivable from the address).

* `derived_claims`: Optional. JSON object containing claims about the end-user which were derived from the document described in the evidence array member it is part of. When used the `derived_claims` element has the following conditions:
    * The `derived_claims` element may contain any of the claims defined in section 5.1 of the OpenID Connect specification [@!OpenID] and the claims defined in [@OpenID4IDAClaims].
    * The `derived_claims` element may also contain other end-user claims (not defined in the OpenID Connect specification [@!OpenID] nor in [@OpenID4IDAClaims]) derived from the document described in the evidence array member it is part of.
    * End-User claims contained in a `derived_claims` element shall have corresponding claims in the `claims` element of `verified_claims`.
    * When the `derived_claims` element is used it should be present in all members of the `evidence` array and all claims under the `claims` element of `verified_claims` should have a corresponding claim in at least one `derived_claims` element.
    * Claim names may be annotated with language tags as specified in section 5.2 of the OpenID Connect specification [@!OpenID].
    * When it is present the `derived_claims` element shall not be empty.

#### Evidence type `electronic_record`

The following elements are contained in an evidence sub-element where type is `electronic_record`.

`type`: Required with value set to `electronic_record`.

`check_details`: Optional. JSON array representing the checks done in relation to the `evidence`.

  * `check_method`: Required. String representing the check done. For information on predefined `check_method` values see [@!predefined_values_page].
  * `organization`: Optional. String denoting the legal entity that performed the check. This should be included if the claim provider did not perform the check itself.
  * `check_id`: Optional. Identifier referring to the event where a check (either verification or validation) was performed. The claim provider shall ensure that this is present when `evidence_ref` element is used. The claim provider shall ensure that the transaction identifier can be resolved into transaction details during an audit.
  * `time`: Optional. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when the check was completed.

`record`: Optional. JSON object representing the record used to perform the identity verification. It consists of the following properties:

* `type`: Required. String denoting the type of electronic record. For information on predefined identity evidence values see [@!predefined_values_page]. The claim provider may use other predefined values in which case the claim recipients will either be unable to process the assertion, just store this value for audit purposes, or apply bespoke business logic to it.
* `created_at`: Optional. The time the record was created as ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format.
* `date_of_expiry`: Optional. The date the evidence will expire as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `source`: Optional. JSON object containing information about the source of this record. This object consists of the following properties:
    * `name`: Optional. Designation of the source of the `electronic_record`.
    * All elements of the OpenID Connect `address` claim (see [@!OpenID]): Optional.
    * `country_code`: Optional. String denoting the country or supranational organization that issued the evidence as ISO 3166/ICAO 3-letter codes [@!ICAO-Doc9303], e.g., "USA" or "JPN". 2-letter ICAO codes may be used in some circumstances for compatibility reasons.
    * `jurisdiction`: Optional. String containing the name of the region(s) / state(s) / province(s) / municipality(ies) that source has jurisdiction over (if it is not common knowledge or derivable from the address).
* `derived_claims`: Optional. JSON object containing claims about the end-user which were derived from the electronic record described in the evidence array member it is part of.
    * The `derived_claims` element may contain any of the claims defined in section 5.1 of the OpenID Connect specification [@!OpenID] and the claims defined in [@OpenID4IDAClaims].
    * The `derived_claims` element may also contain other end-user claims (not defined in the OpenID Connect specification [@!OpenID] nor in [@OpenID4IDAClaims]) derived from the electronic record described in the evidence array member it is part of.
    * Claim names may be annotated with language tags as specified in section 5.2 of the OpenID Connect specification [@!OpenID].
    * When it is present the `derived_claims` element shall not be empty.

#### Evidence type `vouch`

The following elements are contained in an evidence sub-element where type is `vouch`.

`type`: Required with value set to `vouch`.

`check_details`: Optional. JSON array representing the checks done in relation to the `vouch`.

  * `check_method`: Required. String representing the check done, this includes processes such as checking the authenticity of the vouch, or verifying the user as the person referenced in the vouch. For information on predefined `check_method` values see [@!predefined_values_page].
  * `organization`: Optional. String denoting the legal entity that performed the check. This should be included if the claim provider did not perform the check itself.
  * `check_id`: Optional. Identifier referring to the event where a check (either verification or validation) was performed. The claim provider shall ensure that this is present when `evidence_ref` element is used. The claim provider shall ensure that the transaction identifier can be resolved into transaction details during an audit.
  * `time`: Optional. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when the check was completed.

`attestation`: Optional. JSON object representing the attestation that is the basis of the vouch. It consists of the following properties:

* `type`: Required. String denoting the type of vouch. For information on predefined vouch values see [@!predefined_values_page]. The claim provider may use other than the predefined values in which case the claim recipients will either be unable to process the assertion, just store this value for audit purposes, or apply bespoke business logic to it.
* `reference_number`: Optional. String representing an identifier/number that uniquely identifies a vouch given about the end-user.
* `date_of_issuance`: Optional. The date the vouch was made as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `date_of_expiry`: Optional. The date the evidence will expire as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `voucher`: Optional. JSON object containing information about the entity giving the vouch. This object consists of the following properties:
    * `name`: Optional. String containing the name of the person giving the vouch/reference in the same format as defined in section 5.1 (Standard Claims) of the OpenID Connect Core specification.
    * `birthdate`: Optional. String containing the birthdate of the person giving the vouch/reference in the same format as defined in section 5.1 (Standard Claims) of the OpenID Connect Core specification.
    * All elements of the OpenID Connect `address` claim (see [@!OpenID]): Optional.
    * `country_code`: Optional. String denoting the country or supranational organization that issued the evidence as ISO 3166/ICAO 3-letter codes [@!ICAO-Doc9303], e.g., "USA" or "JPN". 2-letter ICAO codes may be used in some circumstances for compatibility reasons.
    * `occupation`: Optional. String containing the occupation or other authority of the person giving the vouch/reference.
    * `organization`: Optional. String containing the name of the organization the voucher is representing.
* `derived_claims`: Optional. JSON object containing claims about the end-user which were derived from the vouch described in the evidence array member it is part of (an example is presented later in this document)
    * The `derived_claims` element may contain any of the claims defined in section 5.1 of the OpenID Connect specification [@!OpenID] and the claims defined in [@OpenID4IDAClaims].
    * The `derived_claims` element may also contain other end-user claims (not defined in the OpenID Connect specification [@!OpenID] nor in [@OpenID4IDAClaims]) derived from the vouch described in the evidence array member it is part of.
    * Claim names may be annotated with language tags as specified in section 5.2 of the   OpenID Connect specification [@!OpenID].
    * When it is present the `derived_claims` element shall not be empty.

#### Evidence type `electronic_signature`

The following elements are contained in an `electronic_signature` evidence sub-element.

* `type`: Required with value set to `electronic_signature`.
* `signature_type`: Required. String denoting the type of signature used as evidence. The value range might be restricted by the respective trust framework.
* `issuer`: Required. String denoting the certification authority that issued the signer's certificate.
* `serial_number`: Required. String containing the serial number of the certificate used to sign.
* `created_at`: Optional. The time the signature was created as ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format.
* `derived_claims`: Optional. JSON object containing claims about the end-user which were derived from the electronic signature described in the evidence array member it is part of.
    * The `derived_claims` element may contain any of the claims defined in section 5.1 of the OpenID Connect specification [@!OpenID] and the claims defined in [@OpenID4IDAClaims].
    * The `derived_claims` element may also contain other end-user claims derived from the electronically signed object described in the evidence array member it is part of, such as elements of an advanced electronic signature described under eIDAS used to uniquely link the signed object to the signatory.
    * Claim names may be annotated with language tags as specified in section 5.2 of the OpenID Connect specification [@!OpenID].
    * When it is present the `derived_claims` element shall not be empty.

### Attachments {#attachments}

During the identity verification process, specific document artifacts could be collected and depending on the trust framework, will be required to be stored for a specific duration. These artifacts can later be reviewed during audits or quality control for example. These artifacts include, but are not limited to:

* scans of filled and signed forms documenting/certifying the verification process itself,
* scans or photocopies of the documents used to verify the identity of end-users,
* video recordings of the verification process, and
* certificates of electronic signatures.

When supported by the claim provider and requested by the claim recipient, these elements can be included in the verified claims response allowing the claims recipient to store these artifacts along with the verified claims information.

An attachment is represented by a JSON element. The definition of attachments and the schema representing them are described in [@Attachments].

## Examples

### Framework with assurance level and associated claims

<{{examples/response/eidas.json}}

### Document + utility statement

<{{examples/response/document_and_utility_statement.json}}

### Array of verified claims

<{{examples/response/multiple_verified_claims.json}}

### Derived claims

<{{examples/response/derived_claims_1.json}}

# Security considerations {#Security}

The working group has identified no security considerations that pertain directly to this specification.

The data structures described in this specification will contain personal information. Standards referencing this specification and implementers using this specification should consider the secure transport of these structures and security and privacy implications that may arise from their use.

{backmatter}

<reference anchor="ISODIR2" target="https://www.iso.org/sites/directives/current/part2/index.xhtml">
<front>
<title>ISO/IEC Directives, Part 2 - Principles and rules for the structure and drafting of ISO and IEC documents</title>
    <author fullname="ISO/IEC">
      <organization>ISO/IEC</organization>
    </author>
</front>
</reference>

<reference anchor="OpenID" target="https://openid.net/specs/openid-connect-core-1_0.html">
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

<reference anchor="OpenID4IDAClaims" target="https://openid.net/specs/openid-connect-4-ida-claims-1_0.html">
  <front>
    <title>OpenID Connect for Identity Assurance Claims Registration 1.0</title>
    <author initials="T." surname="Lodderstedt" fullname="Torsten Lodderstedt">
      <organization>yes.com</organization>
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

<reference anchor="Attachments" target="https://openid.net/specs/openid-connect-4-ida-attachments-1_0.html">
  <front>
    <title>OpenID Connect for Identity Assurance Attachments 1.0</title>
    <author initials="T." surname="Lodderstedt" fullname="Torsten Lodderstedt">
      <organization>yes.com</organization>
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
   <date day="19" month="July" year="2023"/>
  </front>
</reference>

<reference anchor="JSON" target="https://www.rfc-editor.org/rfc/rfc8259">
    <front>
      <title>The JavaScript Object Notation (JSON) Data Interchange Format</title>
      <author initials="T." surname="Bray">
        <organization abbrev="IETF">Internet Engineering Task Force</organization>
      </author>
      <date month="December" year="2017"/>
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

<reference anchor="ISO8601" target="https://www.iso.org/iso/catalogue_detail?csnumber=40874">
    <front>
      <title>ISO 8601. Data elements and interchange formats - Information interchange - Representation of dates and times</title>
      <author surname="International Organization for Standardization">
        <organization abbrev="ISO">International Organization for Standardization</organization>
      </author>
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

<reference anchor="eIDAS" target="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32014R0910">
  <front>
    <title>REGULATION (EU) No 910/2014 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL on electronic identification and trust services for electronic transactions in the internal market and repealing Directive 1999/93/EC</title>
    <author initials="" surname="European Parliament">
      <organization>European Parliament</organization>
    </author>
   <date day="23" month="July" year="2014"/>
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

<reference anchor="NIST-SP-800-63a" target="https://doi.org/10.6028/NIST.SP.800-63a">
  <front>
    <title>NIST Special Publication 800-63A, Digital Identity Guidelines, Enrollment and Identity Proofing Requirements</title>
    <author initials="Paul. A." surname="Grassi" fullname="Paul A. Grassi">
      <organization>NIST</organization>
    </author>
    <author initials="James L." surname="Fentony" fullname="James L. Fentony">
      <organization>Altmode Networks</organization>
    </author>
    <author initials="Naomi B." surname="Lefkovitz" fullname="Naomi B. Lefkovitz">
      <organization>NIST</organization>
    </author>
    <author initials="Jamie M." surname="Danker" fullname="Jamie M. Danker">
      <organization>Department of Homeland Security</organization>
    </author>
    <author initials="Yee-Yin" surname="Choong" fullname="Yee-Yin Choong">
      <organization>NIST</organization>
    </author>
    <author initials="Kristen K." surname="Greene" fullname="Kristen K. Greene">
      <organization>NIST</organization>
    </author>
    <author initials="Mary F." surname="Theofanos" fullname="Mary F. Theofanos">
      <organization>NIST</organization>
    </author>
   <date month="June" year="2017"/>
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

<reference anchor="verified_claims.json" target="https://openid.net/wg/ekyc-ida/references/">
  <front>
    <title>JSON Schema for assertions using verified_claims</title>
    <author>
        <organization>OpenID Foundation</organization>
    </author>
   <date year="2020"/>
  </front>
</reference>

<reference anchor="W3C_VCDM" target="https://www.w3.org/TR/vc-data-model/">
  <front>
    <title>Verifiable Credentials Data Model v1.1</title>
    <author initials="M" surname="Sporny" fullname="Manu Sporny">
      <organization>Digital Bazaar</organization>
    </author>
    <author initials="D" surname="Longley" fullname="Dave Longley">
      <organization>Digital Bazaar</organization>
    </author>
    <author initials="D" surname="Chadwick" fullname="David Chadwick">
      <organization>Digital Bazaar</organization>
    </author>
   <date month="March" year="2022"/>
  </front>
</reference>

# IANA considerations

## JSON Web Token claims registration

This specification requests registration of the following value in the IANA "JSON Web Token Claims Registry" established by [@!RFC7519].

### Registry contents

#### Claim `verified_claims`

Claim Name:
: `verified_claims`

Claim Description:
: A structured claim containing end-user claims and the details of how those end-user claims were assured.

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [verified claims](#verified_claims) of this document

# Acknowledgements {#Acknowledgements}

The following people at yes.com and partner companies contributed to the concept described in the initial contribution to this specification: Karsten Buch, Lukas Stiebig, Sven Manz, Waldemar Zimpfer, Willi Wiedergold, Fabian Hoffmann, Daniel Keijsers, Ralf Wagner, Sebastian Ebling, Peter Eisenhofer.

We would like to thank Julian White, Bjorn Hjelm, Stephane Mouy, Joseph Heenan, Vladimir Dzhuvinov, Azusa Kikuchi, Naohiro Fujie, Takahiko Kawasaki, Sebastian Ebling, Marcos Sanz, Tom Jones, Mike Pegman, Michael B. Jones, Jeff Lombardo, Taylor Ongaro, Peter Bainbridge-Clayton, Adrian Field, George Fletcher, Tim Cappalli, Michael Palage, Sascha Preibisch, Giuseppe De Marco, Nick Mothershaw, Hodari McClain, Dima Postnikov and Nat Sakimura for their valuable feedback and contributions that helped to evolve this specification.

# Notices

Copyright (c) 2024 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.
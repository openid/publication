%%%
title = "OpenID Connect for Identity Assurance 1.0"
abbrev = "openid-connect-4-identity-assurance-1_0"
ipr = "none"
workgroup = "eKYC-IDA"
keyword = ["security", "openid", "identity assurance", "ekyc"]

[seriesInfo]
name = "Internet-Draft"

value = "openid-connect-4-identity-assurance-1_0-13"

status = "standard"

[[author]]
initials="T."
surname="Lodderstedt"
fullname="Torsten Lodderstedt"
organization="yes.com"
    [author.address]
    email = "torsten@lodderstedt.net"

[[author]]
initials="D."
surname="Fett"
fullname="Daniel Fett"
organization="yes.com"
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

This specification defines an extension of OpenID Connect for providing Relying Parties with Verified Claims about End-Users. This extension facilitates the verification of the identity of a natural person.

{mainmatter}

# Introduction {#Introduction}

This specification defines an extension to OpenID Connect [@!OpenID] for providing Relying Parties with identity information, i.e., Verified Claims, along with an explicit statement about the verification status of these Claims (what, how, when, according to what rules, using what evidence). This specification is aimed at enabling use cases requiring strong assurance, for example, to comply with regulatory requirements such as Anti-Money Laundering laws or access to health data, risk mitigation, or fraud prevention.

In such use cases, the Relying Party (RP) needs to understand the trustworthiness or assurance level of the Claims about the End-User that the OpenID Connect Provider (OP) is willing to communicate, along with process-related information and evidence used to verify the End-User Claims.

The `acr` Claim, as defined in Section 2 of the OpenID Connect specification [@!OpenID], is suited to assure information about the authentication performed in an OpenID Connect transaction. Identity assurance, however, requires a different representation: While authentication is an aspect of an OpenID Connect transaction, assurance is a property of a certain Claim or a group of Claims. Several of them will typically be conveyed to the RP as the result of an OpenID Connect transaction.

For example, the assurance an OP typically will be able to give for an e-mail address will be “self-asserted” or “verified by opt-in or similar mechanism”. The family name of an End-User, in contrast, might have been verified in accordance with the respective Anti Money Laundering Law by showing an ID Card to a trained employee of the OP operator.

Identity assurance therefore requires a way to convey assurance data along with and coupled to the respective Claims about the End-User. This specification defines a suitable representation and mechanisms the RP will utilize to request Verified Claims about an End-User along with assurance data and for the OP to represent these Verified Claims and accompanying assurance data.

Note: This specifications fulfills the criteria for portability and interoperability mechanisms of Digital ID systems as defined in [@FATF-Digital-Identity].

## Terminology

This section defines some terms relevant to the topic covered in this document, inspired by NIST SP 800-63A [@NIST-SP-800-63a].

* Identity Proofing - process in which an End-User provides evidence to an OP or Claim provider reliably identifying themselves, thereby allowing the OP or Claim provider to assert that identification at a useful assurance level.

* Identity Verification - process conducted by the OP or a Claim provider to verify the End-User's identity.

* Identity Assurance - process in which the OP or a Claim provider asserts identity data of a certain End-User with a certain assurance towards an RP, typically expressed by way of an assurance level. Depending on legal requirements, the OP may also be required to provide evidence of the identity verification process to the RP.

* Verified Claims - Claims about an End-User, typically a natural person, whose binding to a particular End-User account was verified in the course of an identity verification process.

# Scope

This specification defines the technical mechanisms to allow Relying Parties to request Verified Claims and to enable OpenID Providers to provide Relying Parties with Verified Claims ("the tools").

Additional facets needed to deploy a complete solution for identity assurance, such as legal aspects (including liability), concrete trust frameworks, or commercial agreements are out of scope. It is up to the particular deployment to complement the technical solution based on this specification with the respective definitions ("the rules").

Note: Although such aspects are out of scope, the aim of the specification is to enable implementations of the technical mechanism to be flexible enough to fulfill different legal and commercial requirements in jurisdictions around the world. Consequently, such requirements will be discussed in this specification as examples.

# Requirements

The RP will be able to request the minimal data set it needs (data minimization) and to express requirements regarding this data, the evidence and the identity verification processes employed by the OP.

This extension will be usable by OPs operating under a certain regulation related to identity assurance, such as eIDAS, as well as other OPs operating without such a regulation.

It is assumed that OPs operating under a suitable regulation can assure identity data without the need to provide further evidence since they are approved to operate according to well-defined rules with clearly defined liability. For example in the case of eIDAS, the peer review ensures eIDAS compliance and the respective member state assumes the liability for the identities asserted by its notified eID systems.

Every other OP not operating under such well-defined conditions may be required to provide the RP data about the identity verification process along with identity evidence to allow the RP to conduct their own risk assessment and to map the data obtained from the OP to other laws. For example, if an OP verifies and maintains identity data in accordance with an Anti Money Laundering Law, it shall be possible for an RP to use the respective identity in a different regulatory context, such as eHealth or the previously mentioned eIDAS.

The basic idea of this specification is that the OP provides all identity data along with metadata about the identity verification process at the OP. It is the responsibility of the RP to assess this data and map it into its own legal context.

From a technical perspective, this means this specification allows the OP to provide Verified Claims along with information about the respective trust framework, but also supports the externalization of information about the identity verification process.

The representation defined in this specification can be used to provide RPs with Verified Claims about the End-User via any appropriate channel. In the context of OpenID Connnect, Verified Claims can be provided in ID Tokens or as part of the UserInfo response. It is also possible to utilize the format described here in OAuth Access Tokens or Token Introspection responses to provide resource servers with Verified Claims.

This extension is intended to be truly international and support identity assurance across different jurisdictions. The extension is therefore extensible to support various trust frameworks, identity evidence and assurance processes.

In order to give implementors as much flexibility as possible, this extension can be used in conjunction with existing OpenID Connect Claims and other extensions within the same OpenID Connect assertion (e.g., ID Token or UserInfo response) utilized to convey Claims about End-Users.

For example, OpenID Connect [@!OpenID] defines Claims for representing family name and given name of an End-User without a verification status. These Claims can be used in the same OpenID Connect assertion beside Verified Claims represented according to this extension.

In the same way, existing Claims to inform the RP of the verification status of the `phone_number` and `email` Claims can be used together with this extension.

Even for representing Verified Claims, this extension utilizes existing OpenID Connect Claims if possible and reasonable. The extension will, however, ensure RPs cannot (accidentally) interpret unverified Claims as Verified Claims.

# Claims {#claims}

## Additional Claims about End-Users {#userclaims}

In order to fulfill the requirements of some jurisdictions on identity assurance, this specification defines the following Claims for conveying End-User data in addition to the Claims defined in the OpenID Connect specification [@!OpenID]:

| Claim | Type | Description |
|:------|:-----|:------------|
|`place_of_birth`| JSON object | End-User’s place of birth. The value of this member is a JSON structure containing some or all of the following members:|
|||`country`: String representing country in [@!ISO3166-1] Alpha-2 (e.g., DE) or [@!ISO3166-3] syntax.|
|||`region`: String representing state, province, prefecture, or region component. This field might be required in some jurisdictions.|
|||`locality`: String representing city or locality component.|
|`nationalities`| array | End-User’s nationalities using ICAO 3-letter codes [@!ICAO-Doc9303], e.g., "USA" or "JPN". 2-letter ICAO codes MAY be used in some circumstances for compatibility reasons.|
|`birth_family_name`| string | End-User’s family name(s) when they were born, or at least from the time they were a child. This term can be used by a person who changes the family name later in life for any reason. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.|
|`birth_given_name`| string | End-User’s given name(s) when they were born, or at least from the time they were a child. This term can be used by a person who changes the given name later in life for any reason. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.|
|`birth_middle_name`| string | End-User’s middle name(s) when they were born, or at least from the time they were a child. This term can be used by a person who changes the middle name later in life for any reason. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used.|
|`salutation`| string | End-User’s salutation, e.g., “Mr.”|
|`title`| string | End-User’s title, e.g., “Dr.”|
|`msisdn`| string | End-User’s mobile phone number formatted according to ITU-T recommendation [@!E.164], e.g., “1999550123”|
|`also_known_as`| string | Stage name, religious name or any other type of alias/pseudonym with which a person is known in a specific context besides its legal name. This must be part of the applicable legislation and thus the trust framework (e.g., be an attribute on the identity card).|

## txn Claim

Strong identity verification typically requires the participants to keep an audit trail of the whole process.

The `txn` Claim as defined in [@!RFC8417] is used in the context of this extension to build audit trails across the parties involved in an OpenID Connect transaction.

If the OP issues a `txn`, it MUST maintain a corresponding audit trail, which at least consists of the following details:

* the transaction ID,
* the authentication method employed, and
* the transaction type (e.g., the set of Claims returned).

This transaction data MUST be stored as long as it is required to store transaction data for auditing purposes by the respective regulation.

The RP requests this Claim like any other Claim via the `claims` parameter or as part of a default Claim set identified by a scope value.

The `txn` value MUST allow an RP to obtain these transaction details if needed.

Note: The mechanism to obtain the transaction details from the OP and their format is out of scope of this specification.

## Extended address Claim

This specification extends the `address` Claim as defined in [@!OpenID] by another sub field containing the country as ISO code.

`country_code`: OPTIONAL. country part of an address represented using an ISO 3-letter code [@!ISO3166-3], e.g., "USA" or "JPN". 2-letter ISO codes [@!ISO3166-1] MAY be used for compatibility reasons. `country_code` MAY be used as alternative to the existing `country` field.

# Representing Verified Claims {#verified_claims}

This specification defines a generic mechanism to add Verified Claims to JSON-based assertions. The basic idea is to use a container element, called `verified_claims`, to provide the RP with a set of Claims along with the respective metadata and verification evidence related to the verification of these Claims. This way, RPs cannot mix up Verified Claims and unverified Claims and accidentally process unverified Claims as Verified Claims.

The following example would assert to the RP that the OP has verified the Claims provided (`given_name` and `family_name`) according to an example trust framework `trust_framework_example`:

<{{examples/response/verified_claims_simple.json}}

The normative definition is given in the following.

`verified_claims`: A single object or an array of objects, each object comprising the following sub-elements:

* `verification`: REQUIRED. Object that contains data about the verification process.
* `claims`: REQUIRED. Object that is the container for the Verified Claims about the End-User.

Note: Implementations MUST ignore any sub-element not defined in this specification or extensions of this specification. Extensions to this specification that specify additional sub-elements under the `verified_claims` element MAY be created by the OpenID Foundation, ecosystem or scheme operators or indeed singular OpenID Connect for IDA implementers.

A machine-readable syntax definition of `verified_claims` is given as JSON schema in [@verified_claims.json], it can be used to automatically validate JSON documents containing a `verified_claims` element. The provided JSON schema files are a non-normative implementation of this specification and any discrepancies that exist are either implementation bugs or interpretations. 

Extensions of this specification, including trust framework definitions, can define further constraints on the data structure.

## verification Element {#verification}

This element contains the information about the process conducted to verify a person's identity and bind the respective person data to a user account.

The `verification` element consists of the following elements:

`trust_framework`: REQUIRED. String determining the trust framework governing the identity verification process of the OP.

An example value is `eidas`, which denotes a notified eID system under eIDAS [@eIDAS].

RPs SHOULD ignore `verified_claims` Claims containing a trust framework identifier they do not understand.

The `trust_framework` value determines what further data is provided to the RP in the `verification` element. A notified eID system under eIDAS, for example, would not need to provide any further data whereas an OP not governed by eIDAS would need to provide verification evidence in order to allow the RP to fulfill its legal obligations. An example of the latter is an OP acting under the German Anti-Money Laundering Law (`de_aml`).

`assurance_level`: OPTIONAL. String determining the assurance level associated with the End-User Claims in the respective `verified_claims`. The value range depends on the respective `trust_framework` value.

For example, the trust framework `eidas` can have the identity assurance levels `low`, `substantial` and `high`.

For information on predefined trust framework and assurance level values see [@!predefined_values].

`assurance_process`: OPTIONAL. JSON object representing the assurance process that was followed. This reflects how the evidence meets the requirements of the `trust_framework` and `assurance_level`. The factual record of the evidence and the procedures followed are recorded in the `evidence` element, this element is used to cross reference the `evidence` to the `assurance_process` followed. This has one or more of the following sub-elements:

  * `policy`: OPTIONAL. String representing the standard or policy that was followed.
  * `procedure`: OPTIONAL. String representing a specific procedure from the `policy` that was followed.
  * `assurance_details`: OPTIONAL. JSON array denoting the details about how the evidence complies with the `policy`. When present this array MUST have at least one member. Each member can have the following sub-elements:
     * `assurance_type`: OPTIONAL. String denoting which part of the `assurance_process` the evidence fulfils.
    * `assurance_classification`: OPTIONAL. String reflecting how the `evidence` has been classified or measured as required by the `trust_framework`.
    * `evidence_ref`: OPTIONAL. JSON array of the evidence being referred to. When present this array MUST have at least one member.
      * `txn`: REQUIRED. Identifier referring to the `txn` used in the `check_details`. The OP MUST ensure that `txn` is present in the `check_details` when `evidence_ref` element is used.
      * `evidence_metadata`: OPTIONAL. Object indicating any meta data about the `evidence` that is required by the `assurance_process` in order to demonstrate compliance with the `trust_framework`. It has the following sub-elements:
        * `evidence_classification`: OPTIONAL. String indicating how the process demonstrated by the `check_details` for the `evidence` is classified by the `assurance_process` in order to demonstrate compliance with the `trust_framework`.

`time`: OPTIONAL. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date and time when the identity verification process took place. This time might deviate from (a potentially also present) `document/time` element since the latter represents the time when a certain evidence was checked whereas this element represents the time when the process was completed. Moreover, the overall verification process and evidence verification can be conducted by different parties (see `document/verifier`). Presence of this element might be required for certain trust frameworks.

`verification_process`: OPTIONAL. Unique reference to the identity verification process as performed by the OP. Used for identifying and retrieving details in case of disputes or audits. Presence of this element might be required for certain trust frameworks.

Note: While `verification_process` refers to the identity verification process at the OP, the `txn` Claim refers to a particular OpenID Connect transaction in which the OP provided the End-User's verified identity data towards an RP.

`evidence`: OPTIONAL. JSON array containing information about the evidence the OP used to verify the End-User's identity as separate JSON objects. Every object contains the property `type` which determines the type of the evidence. The RP uses this information to process the `evidence` property appropriately.

Important: Implementations MUST ignore any sub-element not defined in this specification or extensions of this specification.

### evidence Element

The `evidence` element is structured with the following elements:

`attachments`: OPTIONAL. Array of JSON objects representing attachments like photocopies of documents or certificates. See (#attachments) on how an attachment is structured.

`type`: REQUIRED. The value defines the type of the evidence.

The following types of evidence are defined:

* `document`: Verification based on any kind of physical or electronic document provided by the End-User.
* `electronic_record`: Verification based on data or information obtained electronically from an approved or recognized source.
* `vouch`: Verification based on an attestation or reference given by an approved or recognized person declaring they believe to the best of their knowledge that the Claim(s) are genuine and true.
* `utility_bill`: Verification based on a utility bill (this is to be deprecated in future releases and implementers are recommended to use the `document` type instead).
* `electronic_signature`: Verification based on an electronic signature.

Note: `id_document` is an alias for `document` for backward compatibility purposes but will be deprecated in future releases, implementers are recommended to use `document`.

Depending on the evidence type additional elements are defined, as described in the following.

#### Evidence Type document

The following elements are contained in an evidence sub-element where type is `document`.

`type`: REQUIRED. Value MUST be set to `document`.

`check_details`: OPTIONAL. JSON array representing the checks done in relation to the `evidence`. When present this array MUST have at least one member.

  * `check_method`: REQUIRED. String representing the check done, this includes processes such as checking the authenticity of the document, or verifying the user's biometric against an identity document. For information on predefined `check_details` values see [@!predefined_values].
  * `organization`: OPTIONAL. String denoting the legal entity that performed the check. This  SHOULD be included if the OP did not perform the check itself.
  * `txn`: OPTIONAL. Identifier referring to the identity verification transaction. The OP MUST ensure that this is present when `evidence_ref` element is used. The OP MUST ensure that the transaction identifier can be resolved into transaction details during an audit.
  * `time`: OPTIONAL. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when the check was completed.

`method`: OPTIONAL. The method used to validate the document and verify the person is the owner of it. In practice this is a combination of a several instances `check_details`, implementers are recommended to use the `check_details` type and deprecate the use of this option unless methods are defined by the trust framework. For information on predefined method values see [@!predefined_values].

`verifier`: OPTIONAL. JSON object denoting the legal entity that performed the identity verification. This object SHOULD be included if the OP did not perform the identity verification itself. This object is retained for backward compatibility, implementers are recommended to use `check_details` & `organization` instead. This object consists of the following properties:

* `organization`: REQUIRED. String denoting the organization which performed the verification on behalf of the OP.
* `txn`: OPTIONAL. Identifier referring to the identity verification transaction. The OP MUST ensure that the transaction identifier can be resolved into transaction details during an audit.

`time`: OPTIONAL. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when this document was verified.

`document_details`: OPTIONAL. JSON object representing the document used to perform the identity verification. Note: `document` can be used as an alias for `document_details` for backward compatibility purposes but will be deprecated in future releases, implementers are recommended to use `document_details`. It consists of the following properties:

* `type`: REQUIRED. String denoting the type of the document. For information on predefined document values see [@!predefined_values]. The OP MAY use other than the predefined values in which case the RPs will either be unable to process the assertion, just store this value for audit purposes, or apply bespoken business logic to it.
* `document_number`: OPTIONAL. String representing an identifier/number that uniquely identifies a document that was issued to the End-User. This is used on one document and will change if it is reissued, e.g., a passport number, certificate number, etc. Note: `number` can be used as an alias for 'document_number' for backward compatibility purposes but will be deprecated in future releases, implementers are recommended to use `document_number`.
* `personal_number`: OPTIONAL. String representing an identifier that is assigned to the End-User and is not limited to being used in one document, for example a national identification number, personal identity number, citizen number, social security number, driver number, account number, customer number, licensee number, etc.
* `serial_number`: OPTIONAL. String representing an identifier/number that identifies the document irrespective of any personalization information (this usually only applies to physical artifacts and is present before personalization).
* `date_of_issuance`: OPTIONAL. The date the document was issued as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `date_of_expiry`: OPTIONAL. The date the document will expire as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `issuer`: OPTIONAL. JSON object containing information about the issuer of this document. This object consists of the following properties:
    * `name`: OPTIONAL. Designation of the issuer of the document.
    * All elements of the OpenID Connect `address` Claim (see [@!OpenID])
    * `country_code`: OPTIONAL. String denoting the country or supranational organization that issued the document as ISO 3166/ICAO 3-letter codes [@!ICAO-Doc9303], e.g., "USA" or "JPN". 2-letter ICAO codes MAY be used in some circumstances for compatibility reasons.
    * `jurisdiction`: OPTIONAL. String containing the name of the region(s)/state(s)/province(s)/municipality(ies) that issuer has jurisdiction over (if this information is not common knowledge or derivable from the address).

#### Evidence Type electronic_record

The following elements are contained in an evidence sub-element where type is `electronic_record`.

`type`: REQUIRED. Value MUST be set to `electronic_record`.

`check_details`: OPTIONAL. JSON array representing the checks done in relation to the `evidence`.

  * `check_method`: REQUIRED. String representing the check done. For information on predefined `check_method` values see [@!predefined_values].
  * `organization`: OPTIONAL. String denoting the legal entity that performed the check. This  SHOULD be included if the OP did not perform the check itself.
  * `txn`: OPTIONAL. Identifier referring to the identity verification transaction. The OP MUST ensure that this is present when `evidence_ref` element is used. The OP MUST ensure that the transaction identifier can be resolved into transaction details during an audit.
  * `time`: OPTIONAL. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when the check was completed.  

`time`: OPTIONAL. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when this record was verified.

`record`: OPTIONAL. JSON object representing the record used to perform the identity verification. It consists of the following properties:

* `type`: REQUIRED. String denoting the type of electronic record. For information on predefined identity evidence values see [@!predefined_values]. The OP MAY use other than the predefined values in which case the RPs will either be unable to process the assertion, just store this value for audit purposes, or apply bespoken business logic to it.
* `personal_number`: OPTIONAL. String representing an identifier that is assigned to the End-User and is not limited to being used in one record, for example a national identification number, personal identity number, citizen number, social security number, driver number, account number, customer number, licensee number, etc.
* `created_at`: OPTIONAL. The time the record was created as ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format.
* `date_of_expiry`: OPTIONAL. The date the evidence will expire as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `source`: OPTIONAL. JSON object containing information about the source of this record. This object consists of the following properties:
    * `name`: OPTIONAL. Designation of the source of the electronic_record.
    * All elements of the OpenID Connect `address` Claim (see [@!OpenID]): OPTIONAL.
    * `country_code`: OPTIONAL. String denoting the country or supranational organization that issued the evidence as ISO 3166/ICAO 3-letter codes [@!ICAO-Doc9303], e.g., "USA" or "JPN". 2-letter ICAO codes MAY be used in some circumstances for compatibility reasons.
    * `jurisdiction`: OPTIONAL. String containing the name of the region(s) / state(s) / province(s) / municipality(ies) that source has jurisdiction over (if it’s not common knowledge or derivable from the address).

#### Evidence Type vouch

The following elements are contained in an evidence sub-element where type is `vouch`.

`type`: REQUIRED. Value MUST be set to `vouch`.

`check_details`: OPTIONAL. JSON array representing the checks done in relation to the `vouch`.

  * `check_method`: REQUIRED. String representing the check done, this includes processes such as checking the authenticity of the vouch, or verifing the user as the person referenced in the vouch. For information on predefined `check_method` values see [@!predefined_values].
  * `organization`: OPTIONAL. String denoting the legal entity that performed the check. This  SHOULD be included if the OP did not perform the check itself.
  * `txn`: OPTIONAL. Identifier referring to the identity verification transaction. The OP MUST ensure that this is present when `evidence_ref` element is used. The OP MUST ensure that the transaction identifier can be resolved into transaction details during an audit.
  * `time`: OPTIONAL. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when the check was completed.  

`time`: OPTIONAL. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when this vouch was verified.

`attestation`: OPTIONAL. JSON object representing the attestation that is the basis of the vouch. It consists of the following properties:

* `type`: REQUIRED. String denoting the type of vouch. For information on predefined vouch values see [@!predefined_values]. The OP MAY use other than the predefined values in which case the RPs will either be unable to process the assertion, just store this value for audit purposes, or apply bespoken business logic to it.
* `reference_number`: OPTIONAL. String representing an identifier/number that uniquely identifies a vouch given about the End-User.
* `personal_number`: OPTIONAL. String representing an identifier that is assigned to the End-User and is not limited to being used in one document, for example a national identification number, personal identity number, citizen number, social security number, driver number, account number, customer number, licensee number, etc.
* `date_of_issuance`: OPTIONAL. The date the vouch was made as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `date_of_expiry`: OPTIONAL. The date the evidence will expire as ISO 8601 [@!ISO8601] `YYYY-MM-DD` format.
* `voucher`: OPTIONAL. JSON object containing information about the entity giving the vouch. This object consists of the following properties:
    * `name`: OPTIONAL. String containing the name of the person giving the vouch/reference in the same format as defined in Section 5.1 (Standard Claims) of the OpenID Connect Core specification.
    * `birthdate`: OPTIONAL. String containing the birthdate of the person giving the vouch/reference in the same format as defined in Section 5.1 (Standard Claims) of the OpenID Connect Core specification.
    * All elements of the OpenID Connect `address` Claim (see [@!OpenID]): OPTIONAL.
    * `country_code`: OPTIONAL. String denoting the country or supranational organization that issued the evidence as ISO 3166/ICAO 3-letter codes [@!ICAO-Doc9303], e.g., "USA" or "JPN". 2-letter ICAO codes MAY be used in some circumstances for compatibility reasons.
    * `occupation`: OPTIONAL. String containing the occupation or other authority of the person giving the vouch/reference.
    * `organization`: OPTIONAL. String containing the name of the organization the voucher is representing.

#### Evidence Type utility_bill

Note: This type is to be deprecated in future releases. Implementers are recommended to use `document` instead.

The following elements are contained in an evidence sub-element where type is `utility_bill`.

`type`: REQUIRED. Value MUST be set to "utility_bill".

`provider`: OPTIONAL. JSON object identifying the respective provider that issued the bill. The object consists of the following properties:

* `name`: REQUIRED. String designating the provider.
* All elements of the OpenID Connect `address` Claim (see [@!OpenID])
* `country_code`: OPTIONAL. String denoting the country or supranational organization that issued the evidence as ISO 3166/ICAO 3-letter codes [@!ICAO-Doc9303], e.g., "USA" or "JPN". 2-letter ICAO codes MAY be used in some circumstances for compatibility reasons.

`date`: OPTIONAL. String in ISO 8601 [@!ISO8601] `YYYY-MM-DD` format containing the date when this bill was issued.

`method`: OPTIONAL. The method used to verify the utility bill. For information on predefined method values see [@!predefined_values].

`time`: OPTIONAL. Time stamp in ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format representing the date when the utility bill was verified.

#### Evidence Type electronic_signature

The following elements are contained in a `electronic_signature` evidence sub-element.

`type`: REQUIRED. Value MUST be set to `electronic_signature`.

`signature_type`: REQUIRED. String denoting the type of signature used as evidence. The value range might be restricted by the respective trust framework.

`issuer`: REQUIRED. String denoting the certification authority that issued the signer's certificate.

`serial_number`: REQUIRED. String containing the serial number of the certificate used to sign.

`created_at`: OPTIONAL. The time the signature was created as ISO 8601 [@!ISO8601] `YYYY-MM-DDThh:mm[:ss]TZD` format.

### Attachments {#attachments}

During the identity verification process, specific document artifacts will be created and depending on the trust framework, will be required to be stored for a specific duration. These artifacts can later be reviewed during audits or quality control for example. These artifacts include, but are not limited to:

* scans of filled and signed forms documenting/certifying the verification process itself,
* scans or photocopies of the documents used to verify the identity of End-Users,
* video recordings of the verification process,
* certificates of electronic signatures.

When requested by the RP, these artifacts can be attached to the Verified Claims response allowing the RP to store these artifacts along with the Verified Claims information.

An attachment is represented by a JSON object. This specification allows two types of representations:

#### Embedded Attachments

All the information of the document (including the content itself) is provided within a JSON object having the following elements:

`desc`: OPTIONAL. Description of the document. This can be the filename or just an explanation of the content. The used language is not specified, but is usually bound to the jurisdiction of the underlying trust framework of the OP.

`content_type`: REQUIRED. Content (MIME) type of the document. See [@!RFC6838]. Multipart or message media types are not allowed. Example: "image/png"

`content`: REQUIRED. Base64 encoded representation of the document content.

`txn`: OPTIONAL. Identifier referring to the transaction. The OP SHOULD ensure this matches a `txn` contained within `check_method` when `check_method` needs to reference the embedded attachment.

The following example shows embedded attachments. The actual contents of the documents are truncated:

<{{examples/response/embedded_attachments.json}}

Note: Due to their size, embedded attachments are not appropriate when embedding Verified Claims in Access Tokens or ID Tokens.

#### External Attachments

External attachments are similar to distributed Claims. The reference to the external document is provided in a JSON object with the following elements:

`desc`: OPTIONAL. Description of the document. This can be the filename or just an explanation of the content. The used language is not specified, but is usually bound to the jurisdiction of the underlying trust framework or the OP.

`url`: REQUIRED. OAuth 2.0 resource endpoint from which the document can be retrieved. Providers MUST protect this endpoint. The endpoint URL MUST return the document whose cryptographic hash matches the value given in the `digest` element. The content MIME type of the document must be indicated in a content-type HTTP response header, as per [RFC6838](https://datatracker.ietf.org/doc/html/rfc6838). Multipart or message media types SHALL NOT be used.

`access_token`: OPTIONAL. Access Token as type `string` enabling retrieval of the document from the given `url`. The attachment MUST be requested using the OAuth 2.0 Bearer Token Usage [@!RFC6750] protocol and the OP MUST support this method, unless another Token Type or method has been negotiated with the Client. Use of other Token Types is outside the scope of this specification. If the `access_token` element is not available, RPs MUST use the Access Token issued by the OP in the Token response and when requesting the attachment the RP MUST use the same method as when accessing the UserInfo endpoint. If the value of this element is `null`, no Access Token is used to request the attachment and the RP MUST NOT use the Access Token issued by the Token response. In this case the OP MUST incorporate other effective methods to protect the attachment and inform/instruct the RP accordingly.

`expires_in`: OPTIONAL. Positive integer representing the number of seconds until the attachment becomes unavailable and/or the provided `access_token` becomes invalid.

`digest`: REQUIRED. JSON object representing a cryptographic hash of the document content. The JSON object has the following elements:

* `alg`: REQUIRED. Specifies the algorithm used for the calculation of the cryptographic hash. The algorithm has been negotiated previously between RP and OP during Client Registration or Management.
* `value`: REQUIRED. Base64 encoded representation of the cryptographic hash.

`txn`: OPTIONAL. Identifier referring to the transaction. The OP SHOULD ensure this matches a `txn` contained within `check_method` when `check_method` needs to reference the embedded attachment.

External attachments are suitable when embedding Verified Claims in Tokens. However, the `verified_claims` element is not self-contained. The documents need to be retrieved separately, and the digest values MUST be calculated and validated to ensure integrity.

It is RECOMMENDED that access tokens for external attachments have a binding to the specific resource being requested so that the access token may not be used to retrieve additional external attachments or resources. For example, the value of `url` could be tied to the access token as audience. This enhances security by enabling the resource server to check whether the audience of a presented access token matches the accessed URL and reject the access when they do not match. The same idea is described in Resource Indicators for OAuth 2.0 [@RFC8707], which defines the `resource` request parameter whereby to specify one or more resources which should be tied to an access token being issued.

The following example shows external attachments:

<{{examples/response/external_attachments.json}}

#### Privacy Considerations

As attachments will most likely contain more personal information than was requested by the RP with specific Claim names, an OP MUST ensure that the End-User is well aware of when and what kind of attachments are about to be transferred to the RP. If possible or applicable, the OP SHOULD allow the End-User to review the content of these attachments before giving consent to the transaction.

## claims Element {#claimselement}

The `claims` element contains the Claims about the End-User which were verified by the process and according to the policies determined by the corresponding `verification` element.

The `claims` element MAY contain one or more of the following Claims as defined in Section 5.1 of the OpenID Connect specification [@!OpenID]

* `name`
* `given_name`
* `middle_name`
* `family_name`
* `birthdate`
* `address`

and the Claims defined in (#userclaims).

The `claims` element MAY also contain other Claims provided the value of the respective Claim was verified in the verification process represented by the sibling `verification` element.

Claim names MAY be annotated with language tags as specified in Section 5.2 of the OpenID Connect specification [@!OpenID].

## verified_claims Delivery

OPs can deliver `verified_claims` in various ways.

A `verified_claims` element can be added to an OpenID Connect UserInfo response or an ID Token.

OAuth Authorization Servers can add `verified_claims` to Access Tokens in JWT format or Token Introspection responses, either in plain JSON or JWT-protected format.

Here is an example of the payload of an Access Token in JWT format including Verified Claims:

```json
{
  "iss": "https://server.example.com",
  "sub": "248289761",
  "aud": "https://rs.example.com/",
  "exp": 1544645174,
  "client_id": "s6BhdRkqt3_",
  "verified_claims": {
    "verification": {
      "trust_framework": "example"
    },
    "claims": {
      "given_name": "Max",
      "family_name": "Mustermann"
    }
  }
}
```

An OP or AS MAY also include `verified_claims` in the above assertions, whether they are Access Tokens or in Token Introspection responses, as aggregated or distributed claims (see Section 5.6.2 of the OpenID Connect specification [@!OpenID]).

For aggregated or distributed claims, every assertion provided by the external Claims source MUST contain:

* an `iss` Claim identifying the claims source,
* a `sub` Claim identifying the End-User in the context of the claim source,
* a `verified_claims` element containing one or more `verified_claims` objects.

The `verified_claims` element in an aggregated or distributed claims object MUST have one of the following forms:

* a JSON string referring to a certain claim source (as defined in [@!OpenID])
* a JSON array of strings referring to the different claim sources
* a JSON object composed of sub-elements formatted with the syntax as defined for requesting `verified_claims` where the name of each object is a name for the respective claim source. Every such named object contains sub-objects called  `claims` and `verification` expressing data provided by the respective claims source. This allows the RP to look ahead before it actually requests distributed Claims in order to prevent extra time, cost, data collisions, etc. caused by these requests.

Note: The two later forms extend the syntax as defined in Section 5.6.2 of the OpenID Connect specification [@!OpenID]) in order to accommodate the specific use cases for `verified_claims`.

The following are examples of assertions including Verified Claims as aggregated Claims

<{{examples/response/aggregated_claims_simple.json}}

and distributed Claims.

<{{examples/response/distributed_claims.json}}

The following example shows an ID Token containing `verified_claims` from two different external claim sources, one as aggregated and the other as distributed Claims.

<{{examples/response/multiple_external_claims_sources.json}}

The next example shows an ID Token containing `verified_claims` from two different external claim sources along with additional data about the content of the Verified Claims (look ahead).

<{{examples/response/multiple_external_claims_sources_with_lookahead.json}}

Claim sources SHOULD sign the assertions containing `verified_claims` in order to demonstrate authenticity and provide for non-repudiation.
The recommended way for an RP to determine the key material used for validation of the signed assertions is via the claim source's public keys. These keys SHOULD be available in the JSON Web Key Set available in the `jwks_uri` metadata value in the `openid-configuration` metadata document. This document can be discovered using the `iss` Claim of the particular JWT.

The OP MAY combine aggregated and distributed Claims with `verified_claims` provided by itself (see (#op_attested_and_external_claims)).

If `verified_claims` elements are contained in multiple places of a response, e.g., in the ID Token and an embedded aggregated Claim, the RP MUST preserve the claims source as context of the particular `verified_claims` element.

Note: Any assertion provided by an OP or AS including aggregated or distributed Claims MAY contain multiple instances of the same End-User Claim. It is up to the RP to decide how to process these different instances.

# Requesting Verified Claims

Making a request for Verified Claims and related verification data can be explicitly requested on the level of individual data elements by utilizing the `claims` parameter as defined in Section 5.5 of the OpenID Connect specification [@!OpenID].

It is also possible to use the `scope` parameter to request one or more specific pre-defined Claim sets as defined in Section 5.4 of the OpenID Connect specification [@!OpenID].

Note: The OP MUST NOT provide the RP with any data it did not request. However, the OP MAY at its discretion omit Claims from the response.

## Requesting End-User Claims {#req_claims}

Verified Claims can be requested on the level of individual Claims about the End-User by utilizing the `claims` parameter as defined in Section 5.5 of the OpenID Connect specification [@!OpenID].

Note: A machine-readable definition of the syntax to be used to request `verified_claims` is given as JSON schema in [@verified_claims_request.json], it can be used to automatically validate `claims` request parameters. The provided JSON schema files are a non-normative implementation of this specification and any discrepancies that exist are either implementation bugs or interpretations.

To request Verified Claims, the `verified_claims` element is added to the `userinfo` or the `id_token` element of the `claims` parameter.

Since `verified_claims` contains the effective Claims about the End-User in a nested `claims` element, the syntax is extended to include expressions on nested elements as follows. The `verified_claims` element includes a `claims` element, which in turn includes the desired Claims as keys. For each claim, the value is either `null` (default), or an object. The object may contain restrictions using `value` or `values` as defined in [@!OpenID] and/or the `essential` or `purpose` keys as described below. An example is shown in the following:

<{{examples/request/claims.json}}

Use of the `claims` parameter allows the RP to exactly select the Claims about the End-User needed for its use case. This extension therefore allows RPs to fulfill the requirement for data minimization.

RPs MAY use the `essential` field as defined in Section 5.5.1 of the OpenID Connect specification [@!OpenID]. The following example shows this for the family and given names.

<{{examples/request/essential.json}}

This specification introduces the additional field `purpose` to allow an RP
to state the purpose for the transfer of a certain End-User Claim it is asking for.
The field `purpose` can be a member value of each individually requested
Claim, but a Claim cannot have more than one associated purpose.

`purpose`: OPTIONAL. String describing the purpose for obtaining a certain End-User Claim from the OP. The purpose MUST NOT be shorter than 3 characters or
longer than 300 characters. If this rule is violated, the authentication
request MUST fail and the OP return an error `invalid_request` to the RP.
The OP MUST display this purpose in the respective End-User consent screen(s)
in order to inform the End-User about the designated use of the data to be
transferred or the authorization to be approved. If the parameter `purpose`
is not present in the request, the OP MAY display a
value that was pre-configured for the respective RP. For details on UI
localization, see (#purpose).

Example:

<{{examples/request/purpose.json}}

## Requesting Verification Data {#req_verification}

RPs request verification data in the same way they request Claims about the End-User. The syntax is based on the rules given in (#req_claims) and extends them for navigation into the structure of the `verification` element.

Elements within `verification` are requested by adding the respective element as shown in the following example:

<{{examples/request/verification.json}}

It requests the trust framework the OP complies with and the date of the verification of the End-User Claims.

The RP MUST explicitly request any data it wants the OP to add to the `verification` element.

Therefore, the RP MUST set fields one step deeper into the structure if it wants to obtain evidence. One or more entries in the `evidence` array are used as filter criteria and templates for all entries in the result array. The following examples shows a request asking for evidence of type `document`.

<{{examples/request/verification_deeper.json}}

The example also requests the OP to add the respective `method` and the `document` elements (including data about the document type) for every evidence to the resulting `verified_claims` Claim.

A single entry in the `evidence` array represents a filter over elements of a certain evidence type. The RP therefore MUST specify this type by including the `type` field including a suitable `value` sub-element value. The `values` sub-element MUST NOT be used for the `evidence/type` field.

If multiple entries are present in `evidence`, these filters are linked by a logical OR.

`check_details` is an array of the processes that have been applied to the `evidence`. An RP MAY filter `check_details` by requesting a particular value for one or more of its sub-elements. If multiple entries for the same sub-element are present this acts as a logical OR between them.

`assurance_details` is an array representing how the `evidence` and `check_details` meets the requirements of the `trust_framework`. RP SHOULD only request this where they need to know this information. Where `assurance_details` have been requested by an RP the OP MUST return the `assurance_details` element along with all sub-elements that it has. If an RP wants to filter what types of `evidence` and `check_methods` they MUST use those methods to do so, e.g. requesting an `assurance_type` should have no filtering effect.

The RP MAY also request certain data within the `document` element to be present. This again follows the syntax rules used above:

<{{examples/request/verification_document.json}}

## Defining further constraints on Verification Data {#constraintedclaims}

### value/values

The RP MAY limit the possible values of the elements `trust_framework`, `evidence/method`, `evidence/check_details`, and `evidence/document/type` by utilizing the `value` or `values` fields and the element `evidence/type` by utilizing the `value` field.

Note: Examples on the usage of a restriction on `evidence/type` were given in the previous section.

The following example shows how an RP may request Claims either complying with trust framework `gold` or `silver`.

<{{examples/request/verification_claims_different_trust_frameworks.json}}

The following example shows that the RP wants to obtain an attestation based on the German Anti Money Laundering Law (trust framework `de_aml`) and limited to End-Users who were identified in a bank branch in person (physical in person proofing - method `pipp`) using either an `idcard` or a `passport`.

<{{examples/request/verification_aml.json}}

The OP MUST NOT ignore some or all of the query restrictions on possible values and MUST NOT deliver available verified/verification data that does not match these constraints.

### max_age

The RP MAY also express a requirement regarding the age of certain data, like the time elapsed since the issuance/expiry of certain evidence types or since the verification process asserted in the `verification` element took place. Section 5.5.1 of the OpenID Connect specification [@!OpenID] defines a query syntax that allows for new special query members to be defined. This specification introduces a new such member `max_age`, which is applicable to the possible values of any elements containing dates or timestamps (e.g., `time`, `date_of_issuance` and `date_of_expiry` elements of evidence of type `document`).

`max_age`: OPTIONAL. JSON number value only applicable to Claims that contain dates or timestamps. It defines the maximum time (in seconds) to be allowed to elapse since the value of the date/timestamp up to the point in time of the request. The OP should make the calculation of elapsed time starting from the last valid second of the date value.

The following is an example of a request for Claims where the verification process of the data is not allowed to be older than 63113852 seconds:

<{{examples/request/verification_max_age.json}}

The OP SHOULD try to fulfill this requirement. If the verification data of the End-User is older than the requested `max_age`, the OP MAY attempt to refresh the End-User’s verification by sending them through an online identity verification process, e.g., by utilizing an electronic ID card or a video identification approach.

## Requesting Claims sets with different verification requirements

It is also possible to request different trust frameworks, assurance levels, and methods for different Claim sets. This requires the RP to send an array of `verified_claims` objects instead of passing a single object.

The following example illustrates this functionality.

<{{examples/request/verification_claims_by_trust_frameworks.json}}

When the RP requests multiple verifications as described above, the OP is supposed to process any element in the array independently. The OP will provide `verified_claims` response elements for every `verified_claims` request element whose requirements it is able to fulfill. This also means if multiple `verified_claims` elements contain the same End-User Claim(s), the OP delivers the Claim in as many Verified Claims response objects it can fulfil. For example, if the trust framework the OP uses is compatible with multiple of the requested trust frameworks, it provides a `verified_claims` element for each of them.

The RP MAY combine multiple `verified_claims` Claims in the request with multiple `trust_framework` and/or `assurance_level` values using the `values` element. In that case, the rules given above for processing `values` are applied for the particular `verified_claims` request object.

<{{examples/request/verification_claims_by_trust_frameworks_same_claims.json}}

In the above example, the RP asks for family and given name either under trust framework `gold` with an evidence of type `document` or under trust framework `silver` or `bronze` but with an evidence `electronic_record`.

## Handling Unfulfillable Requests and Unavailable Data
In some cases, OPs cannot deliver the requested data to an RP, for example, because the data is not available or does not match the RP's requirements. The rules for handling these cases are described in the following.

Extensions of this specification MAY define additional rules or override these rules, for example

* to allow or disallow the use of Claims depending on scheme-specific checks,
* to enable a finer-grained control of the RP over the behavior of the OP when data is unavailable or does not match the criteria, or
* to abort transactions (return error codes) in cases where requests cannot be fulfilled.

Important: The behavior described below is independent from the use of `essential` (as defined in Section 5.5 of [@!OpenID]).

### Unavailable Data
If the RP does not have data about a certain Claim, does not understand/support the respective Claim, or the End-User does not consent to the release of the data, the respective Claim MUST be omitted from the response. The OP MUST NOT return an error to the RP. If the End-User does not consent to the whole transaction, standard OpenID Connect logic applies, as defined in Section 3.1.2.6 of [@!OpenID].


### Data not Matching Requirements
When the available data does not fulfill the requirements of the RP expressed through `value`, `values`, or `max_age`, the following logic applies:

 * If the respective requirement was expressed for a Claim within `verified_claims/verification`, the whole `verified_claims` element MUST be omitted.
 * Otherwise, the respective Claim MUST be omitted from the response.

In both cases, the OP MUST NOT return an error to the RP.

### Omitting Elements

If an element is to be omitted according to the rules above, but is required for a valid response, its parent element MUST be omitted as well. This process MUST be repeated until the response is valid.

### Error Handling

If the `claims` sub-element is empty, the OP MUST abort the transaction with an `invalid_request` error.

Claims unknown to the OP or not available as Verified Claims MUST be ignored and omitted from the response. If the resulting `claims` sub-element is empty, the OP MUST omit the `verified_claims` element.

## Requesting sets of Claims by scope {#req_scope}

Verified Claims about the End-User can be requested as part of a pre-defined set by utilizing the `scope` parameter as defined in Section 5.4 of the OpenID Connect specification [@!OpenID].

When using this approach the Claims associated with a `scope` are administratively defined at the OP.  The OP configuration and RP request parameters will determine whether the Claims are returned via the ID Token or UserInfo endpoint as defined in Section 5.3.2 of the OpenID Connect specification [@!OpenID].


# Example Requests
This section shows examples of requests for `verified_claims`.

## Verification of Claims by a document

<{{examples/request/verification_deeper.json}}

Note that, as shown in the above example, this specification requires that implementations receiving requests are able to distinguish between JSON objects where a key is not present versus where a key is present with a null value.

Support for these null value requests is mandatory for identity providers, so implementors are encouraged to test this behaviour early in their development process. In some programming languages many JSON libraries or HTTP frameworks will, at least by default, ignore null values and omit the relevant key when parsing the JSON.

## Verification of Claims by trust framework and evidence types

<{{examples/request/verification_claims_trust_frameworks_evidence.json}}

## Verification of Claims by trust framework and verification method

<{{examples/request/verification_spid_document_biometric.json}}

## Verification of Claims by trust framework with a document and attachments

<{{examples/request/verification_aml_with_attachments.json}}

## Verification of Claims by electronic signature

<{{examples/request/verification_electronic_signature.json}}


### Attachments

RPs can explicitly request to receive attachments along with the Verified Claims:

<{{examples/request/verification_with_attachments.json}}

As with other Claims, the attachment Claim can be marked as `essential` in the request as well.

### Error Handling

The OP has the discretion to decide whether the requested verification data is to be provided to the RP.


# Example Responses

This section shows examples of responses containing `verified_claims`.

The first and second subsections show JSON snippets of the general identity assurance case, where the RP is provided with verification evidence for different methods along with the actual Claims about the End-User.

The third subsection illustrates how the contents of this object could look like in case of a notified eID system under eIDAS, where the OP does not need to provide evidence of the identity verification process to the RP.

Subsequent subsections contain examples for using the `verified_claims` Claim on different channels and in combination with other (unverified) Claims.

## ID document [deprecated format]

<{{examples/response/id_document.json}}

## Document

<{{examples/response/document_800_63A.json}}

Same document under a different `trust_framework`

<{{examples/response/document_UK_DIATF.json}}

## Document and verifier details

<{{examples/response/document_verifier.json}}

## Document with external attachments

<{{examples/response/document_with_attachments.json}}

## Evidence with all assurance details

<{{examples/response/evidence_with_assurance_details.json}}

## Utility statement with attachments

<{{examples/response/utility_statement_with_attachments.json}}

## Document + utility statement

<{{examples/response/document_and_utility_statement.json}}

## ID document + utility bill [deprecated format]

<{{examples/response/id_document_and_utility_bill.json}}

## Notified eID system (eIDAS)

<{{examples/response/eidas.json}}

## Electronic_record

<{{examples/response/electronic_record.json}}

## Vouch

<{{examples/response/vouch.json}}

## Vouch with embedded attachments

<{{examples/response/vouch_with_attachments.json}}

## Multiple Verified Claims

<{{examples/response/multiple_verified_claims.json}}

## Verified Claims in UserInfo Response

### Request

In this example we assume the RP uses the `scope` parameter to request the email address and, additionally, the `claims` parameter, to request Verified Claims.

The scope value is: `scope=openid email`

The value of the `claims` parameter is:

<{{examples/request/userinfo.json}}

### UserInfo Response

The respective UserInfo response would be

<{{examples/response/userinfo.json}}

## Verified Claims in ID Tokens

### Request

In this case, the RP requests Verified Claims along with other Claims about the End-User in the `claims` parameter and allocates the response to the ID Token (delivered from the token endpoint in case of grant type `authorization_code`).

The `claims` parameter value is

<{{examples/request/id_token.json}}

### ID Token

The respective ID Token could be

<{{examples/response/userinfo.id_token.json}}

## Claims provided by the OP and external sources {#op_attested_and_external_claims}

This example shows how an OP can mix own Claims and Claims provided by  
external sources in a single ID Token.

<{{examples/response/all_in_one.json}}

## Self-Issued OpenID Connect Provider and External Claims

This example shows how a Self-Issued OpenID Connect Provider (SIOP)
may include Verified Claims obtained from different external Claim
sources into a ID Token.

<{{examples/response/siop_aggregated_and_distributed_claims.json}}

# OP Metadata {#opmetadata}

The OP advertises its capabilities with respect to Verified Claims in its openid-configuration (see [@!OpenID-Discovery]) using the following new elements:

`verified_claims_supported`: REQUIRED. Boolean value indicating support for `verified_claims`, i.e., the OpenID Connect for Identity Assurance extension.

`trust_frameworks_supported`: REQUIRED. JSON array containing all supported trust frameworks. This array MUST have at least one member.

`evidence_supported`: REQUIRED. JSON array containing all types of identity evidence the OP uses. This array MUST have at least one member.

`documents_supported`: REQUIRED when `evidence_supported` contains "document". JSON array containing all identity document types utilized by the OP for identity verification. This array MUST have at least one member.

`documents_methods_supported`: OPTIONAL. JSON array containing the methods the OP supports for evidences of type "document" (see @!predefined_values). When present this array MUST have at least one member.

`documents_check_methods_supported`: OPTIONAL. JSON array containing the check methods the OP supports for evidences of type "document" (see @!predefined_values). When present this array MUST have at least one member.

`electronic_records_supported`: REQUIRED when `evidence_supported` contains "electronic\_record". JSON array containing all electronic record types the OP supports (see [@!predefined_values]). When present this array MUST have at least one member.

`claims_in_verified_claims_supported`: REQUIRED. JSON array containing all Claims supported within `verified_claims`. Claims that are not present in this array MUST NOT be returned within the `verified_claims` object. This array MUST have at least one member.

`attachments_supported`: REQUIRED when OP supports attachments. JSON array containing all attachment types supported by the OP. Possible values are `external` and `embedded`. When present this array MUST have at least one member.

`digest_algorithms_supported`: REQUIRED when OP supports external attachments. JSON array containing all supported digest algorithms which can be used as `alg` property within the digest object of external attachments. If the OP supports external attachments, at least the algorithm `sha-256` MUST be supported by the OP as well. The list of possible digest/hash algorithm names is maintained by IANA in [@!hash_name_registry] (established by [@RFC6920]).

This is an example openid-configuration snippet:

```json
{
...
   "verified_claims_supported":true,
   "trust_frameworks_supported":[
     "nist_800_63A"
   ],
   "evidence_supported": [
      "document",
      "electronic_record",
      "vouch",
      "electronic_signature"
   ],
   "documents_supported": [
       "idcard",
       "passport",
       "driving_permit"
   ],
   "documents_methods_supported": [
       "pipp",
       "sripp",
       "eid"
   ],
   "electronic_records_supported": [
       "secure_mail"
   ],   
   "claims_in_verified_claims_supported": [
      "given_name",
      "family_name",
      "birthdate",
      "place_of_birth",
      "nationalities",
      "address"
   ],
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

The OP MUST support the `claims` parameter and needs to publish this in its openid-configuration using the `claims_parameter_supported` element.

If the OP supports distributed and/or aggregated Claim types in `verified_claims`, the OP MUST advertise this in its metadata using the `claim_types_supported` element.

# Client Registration and Management

During Client Registration (see [@!OpenID-Registration]) as well as during Client Management [@RFC7592] the following additional properties are available:

`digest_algorithm`: String value representing the chosen digest algorithm (for external attachments). The value MUST be one of the digest algorithms supported by the OP as advertised in the [OP metadata](#opmetadata). If this property is not set, `sha-256` will be used by default.

# Transaction-specific Purpose {#purpose}

This specification introduces the request parameter `purpose` to allow an RP
to state the purpose for the transfer of End-User data it is asking for.

`purpose`: OPTIONAL. String describing the purpose for obtaining certain End-User data from the OP. The purpose MUST NOT be shorter than 3 characters and MUST NOT be longer than 300 characters. If these rules are violated, the authentication request MUST fail and the OP returns an error `invalid_request` to the RP.

The OP SHOULD use the purpose provided by the RP to inform the respective End-User about the designated use of the data to be transferred or the authorization to be approved.

In order to ensure a consistent UX, the RP MAY send the `purpose` in a certain language and request the OP to use the same language using the `ui_locales` parameter.

If the parameter `purpose` is not present in the request, the OP MAY utilize a description that was pre-configured for the respective RP.

Note: In order to prevent injection attacks, the OP MUST escape the text appropriately before it will be shown in a user interface. The OP MUST expect special characters in the URL decoded purpose text provided by the RP. The OP MUST ensure that any special characters in the purpose text cannot be used to inject code into the web interface of the OP (e.g., cross-site scripting, defacing). Proper escaping MUST be applied by the OP. The OP SHALL NOT remove characters from the purpose text to this end.

# Privacy Consideration {#Privacy}

Timestamps with a time zone component can potentially reveal the person’s location. To preserve the person’s privacy timestamps within the verification element and Verified Claims that represent times SHOULD be represented in Coordinated Universal Time (UTC), unless there is a specific reason to include the time zone, such as the time zone being an essential part of a consented time related Claim in verified data.

The use of scopes is a potential shortcut to request a pre-defined set of Claims, however, the use of scopes might result in more data being returned to the RP than is strictly necessary and not achieving the goal of data minimization. The RP SHOULD only request End-User Claims and metadata it requires.

# Security Considerations {#Security}

This specification focuses on mechanisms to carry End-User Claims and accompanying metadata in JSON objects and JSON web tokens, typically as part of an OpenID Connect protocol exchange. Since such an exchange is supposed to take place in security sensitive use cases, implementers MUST:

* ensure End-Users are authenticated using appropriately strong authentication methods, and
* combine this specification with an appropriate security profile for OpenID Connect.

## End-User Authentication

Secure identification of End-Users not only depends on the identity verification at the OP but also on the strength of the user authentication at the OP. Combining a strong identification with weak authentication creates a false impression of security while being open to attacks. For example if an OP uses a simple PIN login, an attacker could guess the PIN of another user and identify himself as the other user at an RP with a high identity assurance level. To prevent this kind of attack, RPs SHOULD request the OP to authenticate the user at a reasonable level, typically using multi-factor authentication, when requesting verified End-User Claims. OpenID Connect supports this by way of the `acr_values` request parameter.

## Security Profile

This specification does not define or require a particular security profile since there are several security 
profiles and new security profiles under development.  Implementers shall be given flexibility to select the security profile that best suits 
their needs. Implementers might consider [@FAPI-1-RW] or [@FAPI-2-BL].

Implementers are recommended to select a security profile that has a certification program or other resources that allow both OpenID Providers and Relying Parties to ensure they have complied with the profile’s security and interoperability requirements, such as the OpenID Foundation Certification Program, https://openid.net/certification/.

The integrity and authenticity of the issued assertions MUST be ensured in order to prevent identity spoofing.

The confidentiality of all End-User data exchanged between the protocol parties MUST be ensured using suitable methods at transport or application layer.

# Predefined Values {#predefined_values}

This specification focuses on the technical mechanisms to convey Verified Claims and thus does not define any identifiers for trust frameworks, documents, methods, validation methods or verification methods. This is left to adopters of the technical specification, e.g., implementers, identity schemes, or jurisdictions.

Each party defining such identifiers MUST ensure the collision resistance of these identifiers. This is achieved by including a domain name under the control of this party into the identifier name, e.g., `https://mycompany.com/identifiers/cool_verification_method`.

The eKYC and Identity Assurance Working Group maintains a wiki page [@!predefined_values_page] that can be utilized to share predefined values with other parties.

{backmatter}

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

<reference anchor="FAPI-1-RW" target="https://bitbucket.org/openid/fapi/src/master/Financial_API_WD_002.md">
  <front>
    <title>Financial-grade API - Part 2: Read and Write API Security Profile</title>
    <author initials="" surname="OpenID Foundation's Financial API (FAPI) Working Group">
      <organization>OpenID Foundation's Financial API (FAPI) Working Group</organization>
    </author>
   <date day="9" month="Sep" year="2020"/>
  </front>
</reference>

<reference anchor="FAPI-2-BL" target="https://bitbucket.org/openid/fapi/src/master/FAPI_2_0_Baseline_Profile.md">
  <front>
    <title>FAPI 2.0 Baseline Profile </title>
    <author initials="" surname="OpenID Foundation's Financial API (FAPI) Working Group">
      <organization>OpenID Foundation's Financial API (FAPI) Working Group</organization>
    </author>
   <date day="9" month="Sep" year="2020"/>
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

<reference anchor="eIDAS" target="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32014R0910">
  <front>
    <title>REGULATION (EU) No 910/2014 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL on electronic identification and trust services for electronic transactions in the internal market and repealing Directive 1999/93/EC</title>
    <author initials="" surname="European Parliament">
      <organization>European Parliament</organization>
    </author>
   <date day="23" month="July" year="2014"/>
  </front>
</reference>

<reference anchor="FATF-Digital-Identity" target="https://www.fatf-gafi.org/media/fatf/documents/recommendations/Guidance-on-Digital-Identity.pdf">
  <front>
    <title>Guidance on Digital Identity</title>
    <author initials="" surname="FATF">
      <organization>Financial Action Task Force (FATF)</organization>
    </author>
   <date month="March" year="2020"/>
  </front>
</reference>

<reference anchor="ISO8601" target="http://www.iso.org/iso/catalogue_detail?csnumber=40874">
    <front>
      <title>ISO 8601. Data elements and interchange formats - Information interchange -
      Representation of dates and times</title>
      <author surname="International Organization for Standardization">
        <organization abbrev="ISO">International Organization for Standardization</organization>
      </author>
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
      <author surname="INTERNATIONAL CIVIL AVIATION ORGANIZATION">
        <organization>INTERNATIONAL CIVIL AVIATION ORGANIZATION</organization>
      </author>
   <date year="2015"/>
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

<reference anchor="verified_claims_request.json" target="https://openid.net/wg/ekyc-ida/references/">
  <front>
    <title>JSON Schema for requesting verified_claims</title>
    <author>
        <organization>OpenID Foundation</organization>
      </author>
   <date year="2020"/>
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

<reference anchor="E.164" target="https://www.itu.int/rec/T-REC-E.164/en">
  <front>
    <title>Recommendation ITU-T E.164</title>
    <author>
      <organization>ITU-T</organization>
    </author>
    <date year="2010" month="11"/>
  </front>
</reference>

<reference anchor="hash_name_registry" target="https://www.iana.org/assignments/named-information/">
  <front>
    <title>Named Information Hash Algorithm Registry</title>
    <author>
      <organization>IANA</organization>
    </author>
    <date year="2016" month="09"/>
  </front>
</reference>

# IANA Considerations

## JSON Web Token Claims Registration

This specification requests registration of the following value in the IANA "JSON Web Token Claims Registry" established by [@!RFC7519].

### Registry Contents

{spacing="compact"}
Claim Name:
: `verified_claims`

Claim Description:
: This container Claim is composed of the verification evidence related to a certain verification process and the corresponding Claims about the End-User which were verified in this process.

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Verified Claims](#verified_claims) of this document

Claim Name:
: `place_of_birth`

Claim Description:
: A structured Claim representing the End-User’s place of birth.

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

Claim Name:
: `nationalities`

Claim Description:
: String array representing the End-User’s nationalities.

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

Claim Name:
: `birth_family_name`

Claim Description:
: Family name(s) someone has when they were born, or at least from the time they were a child. This term can be used by a person who changes the family name(s) later in life for any reason. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

Claim Name:
: `birth_given_name`

Claim Description:
: Given name(s) someone has when they were born, or at least from the time they were a child. This term can be used by a person who changes the given name later in life for any reason. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

Claim Name:
: `birth_middle_name`

Claim Description:
: Middle name(s) someone has when they were born, or at least from the time they were a child. This term can be used by a person who changes the middle name later in life for any reason. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used.

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

Claim Name:
: `salutation`

Claim Description:
: End-User’s salutation, e.g., “Mr.”

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

Claim Name:
: `title`

Claim Description:
: End-User’s title, e.g., “Dr.”

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

Claim Name:
: `msisdn`

Claim Description:
: End-User’s mobile phone number formatted according to ITU-T recommendation [@!E.164]

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

Claim Name:
: `also_known_as`

Claim Description:
: Stage name, religious name or any other type of alias/pseudonym with which a person is known in a specific context besides its legal name. This must be part of the applicable legislation and thus the trust framework (e.g., be an attribute on the identity card).

Change Controller:
: eKYC and Identity Assurance Working Group - openid-specs-ekyc-ida@lists.openid.net

Specification Document(s):
: Section [Claims](#claims) of this document

# Acknowledgements {#Acknowledgements}

The following people at yes.com and partner companies contributed to the concept described in the initial contribution to this specification: Karsten Buch, Lukas Stiebig, Sven Manz, Waldemar Zimpfer, Willi Wiedergold, Fabian Hoffmann, Daniel Keijsers, Ralf Wagner, Sebastian Ebling, Peter Eisenhofer.

We would like to thank Julian White, Bjorn Hjelm, Stephane Mouy, Alberto Pulido, Joseph Heenan, Vladimir Dzhuvinov, Azusa Kikuchi, Naohiro Fujie, Takahiko Kawasaki, Sebastian Ebling, Marcos Sanz, Tom Jones, Mike Pegman, Michael B. Jones, Jeff Lombardo, Taylor Ongaro, Peter Bainbridge-Clayton, Adrian Field, George Fletcher, Tim Cappalli, Michael Palage, Sascha Preibisch, Giuseppe De Marco, and Nat Sakimura for their valuable feedback and contributions that helped to evolve this specification.

# Notices

Copyright (c) 2022 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.

# Document History

   [[ To be removed from the final specification ]]

   -13
   * Preparation for Implementers Draft 4
   * Checked and fixed referencing
   * Added note about issues with JSON null
   * Defined clearly that JSON schema is not normative
   * Various editorial clarifications
   * Added checking of defined end-user claims to JSON schema
   * Clarified OP Metadata wording

   -12

   * introduced `document` evidence type, which is more universal than `id_document`
   * deprecated `id_document`
   * introduced `electronic_record` and `vouch` evidence types
   * introduced `check_details` & `assurance_details` to provide more detail than `method`
   * added lookahead capabilities for distributed Claims
   * added support to attach document artifacts
   * added txn for attachments
   * changed evidence type `qes` to `electronic_signature`
   * added Claim `also_known_as`
   * added text regarding security profiles
   * editorial improvements
   * added further co-authors
   * added `assurance_level` field
   * added `assurance_process` type
   * added text about dependency between identity assurance and authentication assurance
   * added new field `country_code` to `address` Claim
   * relaxed requirements for showing purpose

   -11

   * Added support for requesting different sets of Claims with different requirements regarding trust_framework and other verification elements (e.g., evidence)
   * added `msisdn` Claim
   * clarified scope of this specification

   -10

   * Editorial improvements
   * Improved JSON schema (alignment with spec and bug fix)

   -09

   * `verified_claims` element may contain one or more Verified Claims objects
   * an individual assertion may contain `verified_claims` elements in the assertion itself and any aggregated or distributed Claims sets it includes or refers to, respectively
   * moved all definitions of pre-defined values for trust frameworks, id documents and verification methods to a wiki page as non-normative overview
   * clarified and simplified request syntax
   * reduced mandatory requirement `verified_claims` to bare minimum
   * removed JSON schema from draft and added reference to JSON schema file instead
   * added request JSON schema
   * added IANA section with JSON Web Token Claims Registration
   * integrated source into single md file
   * added privacy considerations regarding time zone data, enhanced syntax definition of time and date-time fields in spec and response schema
   * fixed typos

   -08

   * added `uripp` verification method
   * small fixes to examples

   -07

   * fixed typos
   * changed `nationality` String Claim to `nationalities` String array Claim
   * replaced `agent` in id_document verifier element by `txn` element
   * qes method: fixed error in description of `issuer`
   * qes method: changed `issued_at` to `created_at` since this field applies to the signature (that is created and not issued)
   * Changed format of `nationalities` and issuing `country` to ICAO codes
   * Changed `date` in verification element to `time`
   * Added Japanese trust frameworks to pre-defined values
   * Added Japanese id documents to pre-defined values
   * adapted JSON schema and examples

   -06

   * Incorporated review feedback by Marcos Sanz and Adam Cooper
   * Added text on integrity, authenticity, and confidentiality for data passed between OP and RP to Security Considerations section
   * added `purpose` field to `claims` parameter
   * added feature to let the RP explicitly requested certain `verification` data

   -05

   * incorporated review feedback by Mike Jones
   * Added OIDF Copyright Notices
   * Moved Acknowledgements to Appendix A
   * Removed RFC 2119 keywords from scope & requirements section and rephrased section
   * rephrased introduction
   * replaced `birth_name` with `birth_family_name`, `birth_given_name`, and `birth_middle_name`
   * replaced `transaction_id` with `txn` from RFC 8417
   * added references to eIDAS, ISO 3166-1, ISO 3166-3, and ISO 8601-2004
   * added note on `purpose` and locales
   * changed file name and document title to include 1.0 version id
   * corrected evidence plural
   * lots of editorial fixes
   * Alignment with OpenID Connect Core wording
   * Renamed `id` to `verification_process`
   * Renamed `verified_person_data` to `verified_claims`

   -04
   
   * incorporated review feedback by Marcos Sanz
   
   -03

   * enhanced draft to support multiple evidence
   * added a JSON Schema for assertions containing the `verified_person_data` Claim
   * added more identity document definitions
   * added `region` field to `place_of_birth` Claim
   * changed `eidas_loa_substantial/high` to `eidas_ial_substantial/high`
   * fixed typos in examples
   * uppercased all editorial occurences of the term `claims` to align with OpenID Connect Core

   -02

   * added new request parameter `purpose`
   * simplified/reduced number of verification methods
   * simplfied identifiers
   * added `identity_documents_supported` to metadata section
   * improved examples

   -01

   *  fixed some typos
   *  remove organization element (redundant) (issue 1080)
   *  allow other Claims about the End-User in the `claims` sub element (issue 1079)
   *  changed `legal_context` to `trust_framework`
   *  added explanation how the content of the verification element is determined by the trust framework
   *  added URI-based identifiers for `trust_framework`, `identity_document` and (verification) `method`
   *  added example attestation for notified/regulated eID system
   *  adopted OP metadata section accordingly
   *  changed error behavior for `max_age` member to alig with OpenID Core
   *  Added feature to let the RP express requirements for verification data (trust framework, identity documents, verification method)
   *  Added privacy consideration section and added text on legal basis for data exchange
   *  Added explanation about regulated and un-regulated eID systems

   -00 (WG document)

   *  turned the proposal into a WG document
   *  changed name
   *  added terminology section and reworked introduction
   *  added several examples (ID Token vs UserInfo, unverified & Verified Claims, aggregated & distributed Claims)
   *  incorporated text proposal of Marcos Sanz regarding max_age
   *  added IANA registration for new error code `unable_to_meet_requirement`

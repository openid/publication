%%%
title = "OpenID Connect for Identity Assurance 1.0"
abbrev = "openid-connect-4-identity-assurance-1_0"
ipr = "none"
workgroup = "eKYC-IDA"
keyword = ["security", "openid", "identity assurance", "ekyc"]

[seriesInfo]
name = "Internet-Draft"

value = "openid-connect-4-identity-assurance-1_0-16"

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

This document defines an extension of OpenID Connect protocol for providing relying parties with claims about end-users that have a certain level of verification and/or additional metadata about the claim or the process of verification for access control, entitlement decisions or input to further verification processes.

.# Foreword

The OpenID Foundation (OIDF) promotes, protects, and nurtures the OpenID community and technologies. As a non-profit international standardizing body, it is comprised by over 160 participating entities (workgroup participant). The work of preparing implementer drafts and final international standards is carried out through OIDF workgroups in accordance with the OpenID Process. Participants interested in a subject for which a workgroup has been established have the right to be represented in that workgroup. International organizations, governmental and non-governmental, in liaison with OIDF, also take part in the work. OIDF collaborates closely with other standardizing bodies in the related fields.

Final drafts adopted by the Workgroup through consensus are circulated publicly for the public review for 60 days and for the OIDF members for voting. Publication as an OIDF Standard requires approval by at least 50% of the members casting a vote. There is a possibility that some of the elements of this document may be subject to patent rights. OIDF shall not be held responsible for identifying any or all such patent rights.

.# Introduction {#Introduction}

This extension to OpenID Connect standardizes how relying parties request and receive identity information with additional assurance metadata. This document is aimed at enabling use cases requiring strong assurance, for example, to comply with regulatory requirements such as anti-money laundering laws or access to health data, risk mitigation, or fraud prevention.

In such use cases, the relying party (RP) needs to understand the trustworthiness or assurance level of the  claims about the end-user that the OpenID provider (OP) is willing to communicate, along with process-related information and evidence used to verify the end-user claims.

The `acr` claim, as defined in section 2 of the OpenID Connect specification [@!OpenID], is suited to assure information about the authentication performed in an OpenID Connect transaction. Identity assurance, however, requires a different representation. While authentication is an aspect of an OpenID Connect transaction, assurance and associated verification and validation details, are properties of a certain claim or a group of claims. Several of them will typically be conveyed to the RP as the result of an OpenID Connect transaction.

For example, the assurance an OP typically will be able to give for an e-mail address will be “self-asserted” or "verified". The family name of an end-user, in contrast, might have been verified in accordance with the respective anti-money laundering law by showing an ID card to a trained employee of the OP operator.

Identity assurance requires a way to convey assurance data along with and coupled to the respective claims about the end-user. This document defines a suitable representation and mechanisms the RP will utilize to request verified claims about an end-user along with assurance data and for the OP to represent these verified claims and accompanying assurance data.

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

This document is a definition of the technical mechanism to allow a relying party to request one or more verified claim about the end-user and to enable an OpenID provider to provide a relying party with a verified claim ("the tools").

Additional facets needed to deploy a complete solution for identity assurance, such as legal aspects (including liability), trust frameworks, or commercial agreements are out of scope. It is up to the particular deployment to complement the technical solution based on this document with the respective definitions ("the rules").

Note: Although such aspects are out of scope, the aim of the specification is to enable implementations of the technical mechanism to be flexible enough to fulfill different legal and commercial requirements in jurisdictions around the world. Consequently, such requirements will be discussed in this document as examples.

# Normative references

See section 13 for normative references.

# Terms and definitions
For the purposes of this document, the following terms and definitions apply.

## claim
piece of information asserted about an entity

## identity proofing
process in which an end-user provides evidence to an OpenID Connect provider (OP) or claim provider reliably identifying themselves, thereby allowing the OP or claim provider to assert that identification at a useful assurance level

## identity verification
process conducted by the OP or a claim provider to verify the end-user's identity

## identity assurance
process in which the OP or a claim provider asserts identity data of a certain end-user with a certain assurance towards an RP, typically expressed by way of an assurance level. Depending on legal requirements, the OP can be required to provide evidence of the identity verification process to the RP

## verified claim
claim about an end-user, typically a natural person, whose binding to a particular end-user account was verified in the course of an identity verification process

## claim provider
server that can provide claim information about a entity; synonomous with "claims provider" in OpenID Connect core

# Requirements

The RP will be able to request the minimal data set it needs (data minimization) and to express requirements regarding this data, the evidence and the identity verification processes employed by the OP.

This extension will be usable by OPs operating under a certain regulation related to identity assurance, such as eIDAS, as well as other OPs operating without such a regulation.

It is assumed that OPs operating under a suitable regulation can assure identity data without the need to provide further evidence since they are approved to operate according to well-defined rules with clearly defined liability. For example in the case of eIDAS, the peer review ensures eIDAS compliance and the respective member state assumes the liability for the identities asserted by its notified eID system.

Every other OP not operating under such well-defined conditions could receive a request to provide the RP data about the identity verification process along with identity evidence to allow the RP to conduct their own risk assessment and to map the data obtained from the OP to other laws. For example, if an OP verifies and maintains identity data in accordance with an anti-money laundering law, an RP might choose to use the identity attributes in a different regulatory context, such as eHealth or the previously mentioned eIDAS.

The concept of this document is that the OP can provide identity data along with metadata about the identity assurance process. It is the responsibility of the RP to assess this data and map it into its own legal context.

From a technical perspective, this means this document allows the OP to provide verified claims along with information about the respective trust framework, but also supports the externalization of information about the identity verification process.

The representation defined in this document can be used to provide RPs with verified claims about the end-user via any appropriate channel. In the context of OpenID Connect, verified claims can be provided in ID Tokens or as part of the UserInfo response. It is also possible to utilize the format described here in OAuth access tokens or token introspection responses to provide resource servers with verified claims.

This extension is intended to be truly international and support identity assurance across different jurisdictions. The extension is therefore extensible to support various trust frameworks, identity evidence and assurance processes.

In order to give implementers as much flexibility as possible, this extension can be used in conjunction with existing OpenID Connect claims and other extensions within the same OpenID Connect assertion (e.g., ID Token or UserInfo response) utilized to convey claims about end-users.

For example, OpenID Connect [@!OpenID] defines claims for representing family name and given name of an end-user without a verification status. These claims can be used in the same OpenID Connect assertion beside verified claims represented according to this extension.

In the same way, existing claims to inform the RP of the verification status of the `phone_number` and `email` claims can be used together with this extension.

Even for representing verified claims, this extension utilizes existing OpenID Connect claims if possible and reasonable. The extension will, however, ensure RPs cannot (accidentally) interpret unverified claims as verified claims.

In order to fulfill the requirements of some jurisdictions on identity assurance, the OpenID Connect for IDA claims [@OpenID4IDAClaims] specification defines a number of claims for conveying end-user data in addition to the claims defined in the OpenID Connect specification [@!OpenID].

# Verified claims {#verified_claims}

## Verified claims schema

The basic idea is to use a container element, called `verified_claims`, to provide the RP with a set of claims along with the respective metadata and verification evidence related to the verification of these claims. This way, it is explicit which claims are verified, reducing the risk of RPs accidentally processing unverified claims as verified claims.

This document uses the [@!IDA-verified-claims] document as the definition of the schema for representation of assured digital identity attributes and identity assurance metadata.

The following example would assert to the RP that the OP has verified the claims provided (`given_name` and `family_name`) according to an example trust framework `trust_framework_example`:

<{{examples/response/verified_claims_simple.json}}

This document requires that RPs use the schema defined in [@!IDA-verified-claims]. There are places in the JSON structure where that schema can be extended by implementers but deviation from the schema as defined would not be correct use of this document.

## Verified claims delivery {#verified_claims_delivery}

A `verified_claims` element can be added to an OpenID Connect UserInfo response and/or an ID Token.

Here is an example of the payload of an ID token including verified claims:

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

An OP or Authorization Server (AS) can also include aggregated or distributed `verified_claims` in the above assertions (see (#aggregated_distributed_claims) for more details).

## Requesting end-user claims {#req_claims}

Verified claims can be requested on the level of individual claims about the end-user by utilizing the `claims` parameter as defined in section 5.5 of the OpenID Connect specification [@!OpenID].

Note: A machine-readable definition of the syntax to be used to request `verified_claims` is given as JSON schema in [@verified_claims_request.json], which can be used to automatically validate `claims` request parameters. The provided JSON schema files are a non-normative implementation of this document and any discrepancies that exist are either implementation bugs or interpretations.

To request verified claims, the `verified_claims` element is added to the `userinfo` or the `id_token` element of the `claims` parameter.

Since `verified_claims` contains the effective claims about the end-user in a nested `claims` element, the syntax is extended to include expressions on nested elements as follows. The `verified_claims` element includes a `claims` element, which in turn includes the desired claims as keys. For each claim, the value is either `null` (default), or an object. The object may contain restrictions using `value` or `values` as defined in [@!OpenID] and/or the `essential` key as described below. An example is shown in the following:

<{{examples/request/claims.json}}

Use of the `claims` parameter allows the RP to request specified claims about the end-user needed for its use case. This allows RPs to fulfill the requirements for data minimization by requesting only claims needed for its use case.

Note: it is not possible to request sub-claims (for example the `country` subclaim of the `address` claim) using mechanisms from OpenID Connect Core or this document.

RPs can use the `essential` field as defined in section 5.5.1 of the OpenID Connect specification [@!OpenID]. The following example shows this for the family and given names.

<{{examples/request/essential.json}}

## Requesting verification data {#req_verification}

RPs request verification data in the same way they request claims about the end-user. When the claims request parameter is being used, the syntax is based on the rules given in (#req_claims) and extends them for navigation into the structure of the `verification` element.

Elements within `verification` are requested by adding the respective element as shown in the following example:

<{{examples/request/verification.json}}

It requests the trust framework the OP complies with and the date of the verification of the end-user claims.

The RP shall explicitly request any data it wants the OP to add to the `verification` element.

Therefore, the RP shall set fields one step deeper into the structure if it wants to obtain evidence. One or more entries in the `evidence` array are used as filter criteria and templates for all entries in the result array. The following example shows a request asking for evidence of type `document` only.

<{{examples/request/verification_deeper.json}}

The example also requests the OP to add the respective `method` and the `document` elements (including data about the document type), for every evidence array member, to the resulting `verified_claims` claim.

A single entry in the `evidence` array represents a filter over elements of a certain evidence type. The RP therefore shall specify this type by including the `type` field including a suitable `value` sub-element value. The `values` sub-element shall not be used for the `evidence/type` field.

If multiple entries are present in `evidence`, these filters are linked by a logical OR.

`check_details` is an array of the processes that have been applied to the `evidence`. An RP can filter `check_details` by requesting a particular value for one or more of its sub-elements. If multiple entries for the same sub-element are present this acts as a logical OR between them.

`assurance_details` is an array representing how the `evidence` and `check_details` fulfill the requirements of the `trust_framework`. RP should only request this where they need to know this information. Where `assurance_details` has been requested by an RP the OP shall return the `assurance_details` element along with all sub-elements that it has. If an RP wants to filter what types of `evidence` and `check_methods` they shall use those methods to do so, e.g. requesting an `assurance_type` should have no filtering effect.

The RP can also request certain data within the `document` element to be present. This again follows the syntax rules used above:

<{{examples/request/verification_document.json}}

## Defining further constraints on verification data {#constraintedclaims}

### Value/values

The RP can limit the possible values of the elements `trust_framework`, `evidence/method`, `evidence/check_details`, and `evidence/document/type` by utilizing the `value` or `values` fields and the element `evidence/type` by utilizing the `value` field.

Note: Examples on the usage of a restriction on `evidence/type` were given in the previous section.

The following example shows how an RP requests claims either complying with trust framework `gold` or `silver`.

<{{examples/request/verification_claims_different_trust_frameworks.json}}

The following example shows that the RP wants to obtain an attestation based on the German anti-money laundering law (trust framework `de_aml`) and limited to end-users who were identified in a bank branch in person (physical in person proofing - method `pipp`) using either an `idcard` or a `passport`.

<{{examples/request/verification_aml.json}}

The OP shall not ignore some or all of the query restrictions on possible values and shall not deliver available verified/verification data that does not match these constraints.

### Max_age

The RP can also express a requirement regarding the age of certain data, like the time elapsed since the issuance/expiry of certain evidence types or since the verification process asserted in the `verification` element took place. Section 5.5.1 of the OpenID Connect specification [@!OpenID] defines a query syntax that allows for new special query members to be defined. This document introduces a new such member `max_age`, which is applicable to the possible values of any elements containing dates or timestamps (e.g., `time`, `date_of_issuance` and `date_of_expiry` elements of evidence of type `document`).

`max_age`: Optional. JSON number value only applicable to claims that contain dates or timestamps. It defines the maximum time (in seconds) to be allowed to elapse since the value of the date/timestamp up to the point in time of the request. The OP should make the calculation of elapsed time starting from the last valid second of the date value.

The following is an example of a request for claims where the verification process of the data is not allowed to be older than 63113852 seconds:

<{{examples/request/verification_max_age.json}}

The OP should try to fulfill this requirement. If the verification data of the end-user is older than the requested `max_age`, the OP can attempt to refresh the end-user’s verification by sending them through an online identity verification process, e.g., by utilizing an electronic ID card or a video identification approach.

## Requesting claims sets with different verification requirements

It is also possible to request different trust frameworks, assurance levels, and methods for different claim sets. This requires the RP to send an array of `verified_claims` objects instead of passing a single object.

The following example illustrates this functionality.

<{{examples/request/verification_claims_by_trust_frameworks.json}}

When the RP requests multiple verifications as described above, the OP will process each element in the array independently. The OP will provide `verified_claims` response elements for every `verified_claims` request element whose requirements it is able to fulfill. This also means if multiple `verified_claims` elements contain the same end-user claim(s), the OP delivers the claim in as many verified claims response objects it can fulfill. For example, if the trust framework the OP uses is compatible with multiple of the requested trust frameworks, it provides a `verified_claims` element for each of them.

The RP can combine multiple `verified_claims` claims in the request with multiple `trust_framework` and/or `assurance_level` values using the `values` element. In that case, the rules given above for processing `values` are applied for the particular `verified_claims` request object.

<{{examples/request/verification_claims_by_trust_frameworks_same_claims.json}}

In the above example, the RP asks for family and given name either under trust framework `gold` with an evidence of type `document` or under trust framework `silver` or `bronze` but with an evidence `electronic_record`.

## Returning less data than requested

### General requirements

As stated in section 3.3.3.6 of [@!OpenID], "the OP may choose to return fewer claims about the end-user from the authorization endpoint".  This document makes no change to that provision.  The OP may also choose to return a subset of the `verification` element of any `verified_claims` providing it remains compliant with the `verified_claims` JSON schema defined in [@!OpenID4IDAClaims].

In some cases, OPs cannot deliver the requested data to an RP, for example, because the data is not available or does not match the RP's requirements. The rules for handling these cases are described in the following.

Extensions of this document can define additional rules or override these rules, for example

* to allow or disallow the use of claims depending on scheme-specific checks,
* to enable a finer-grained control of the RP over the behavior of the OP when data is unavailable or does not match the criteria, or
* to abort transactions (return error codes) in cases where requests cannot be fulfilled.

Important: The behavior described below is independent from the use of `essential` (as defined in section 5.5.1 of [@!OpenID]).

### Unavailable data

If the OP does not have data about a certain claim, does not understand/support the respective claim, OPs shall omit the respective claim from any corresponding ID Token or UserInfo response.

### Non-consented data

When relying on end-user consent to determine the specific data to be shared the end-user may make a choice to release only a subset of the data requested. In this case the OP shall omit from any corresponding ID Token or UserInfo response data that has not had end-user consent for sharing.

Alternatively, when relying on end-user consent to determine the specific data to be shared the end-user may choose to release none of the data requested.  In this case standard OpenID Connect authentication error response logic applies, as defined in section 3.1.2.6 of [@!OpenID].

### Data not matching requirements
When the available data does not fulfill the requirements of the RP expressed through `value`, `values`, or `max_age`, the following logic applies:

 * If the respective requirement was expressed for a claim within `verified_claims/verification`, the OP shall omit the whole `verified_claims` element.
 * Otherwise, the OP shall omit the respective claim from the response.

In both cases, the OP shall not return an error to the RP.

### Omitting elements

If an element is to be omitted according to the rules above, but is a requirement for a valid response, the OP shall omit its parent element as well. This OP shall repeat this process until the response is valid.

### Error handling

If the OP encounters an error, standard OpenID Connect authentication error response logic applies, as defined in section 3.1.2.6 of [@!OpenID].

## Requesting sets of claims by scope {#req_scope}

Verified claims about the end-user can be requested as part of a pre-defined set by utilizing the `scope` parameter as defined in section 5.4 of the OpenID Connect specification [@!OpenID].

When using this approach the claims associated with a `scope` value are administratively defined at the OP.  The OP configuration and RP request parameters will determine whether the claims are returned via the ID Token or UserInfo endpoint as defined in section 5.3.2 of the OpenID Connect specification [@!OpenID].

# Aggregated and distributed claims {#aggregated_distributed_claims}
## Aggregated and distributed claims assertions

When distributed claims are used the URL that is the value of the `endpoint` element in any distributed `_claim_source` sub-element shall use the https URI scheme and the JWT returned should not be accessible via any other URI scheme.

For aggregated or distributed claims, every assertion provided by the external claims source shall contain:

* a `typ` header parameter with the value `provided-claims+jwt`,
* an `iss` claim identifying the claims source,
* a `sub` claim identifying the end-user in the context of the claim source, and
* a `verified_claims` element containing one or more `verified_claims` objects.

To ensure that assertions cannot be confused with OpenID Connect ID Tokens, assertions shall not contain:

 * an `exp` claim, or
 * an `aud` claim.

The `verified_claims` element in an aggregated or distributed claims object shall have one of the following forms:

* a JSON string referring to a certain claim source (as defined in [@!OpenID])
* a JSON array of strings referring to the different claim sources
* a JSON object composed of sub-elements formatted with the syntax as defined for requesting `verified_claims` where the name of each object is a name for the respective claim source. Every such named object contains sub-objects called  `claims` and `verification` expressing data provided by the respective claims source. This allows the RP to look ahead before it actually requests distributed claims in order to prevent extra time, cost, data collisions, etc. caused by these requests.

Note: The two later forms extend the syntax as defined in section 5.6.2 of the OpenID Connect specification [@!OpenID]) in order to accommodate the specific use cases for `verified_claims`.

The following are examples of assertions including verified claims as aggregated claims

<{{examples/response/aggregated_claims_simple.json}}

and distributed claims.

<{{examples/response/distributed_claims.json}}

The following example shows an ID Token containing `verified_claims` from two different external claim sources, one as aggregated and the other as distributed claims.

<{{examples/response/multiple_external_claims_sources.json}}

The next example shows an ID Token containing `verified_claims` from two different external claim sources along with additional data about the content of the verified claims (look ahead).

<{{examples/response/multiple_external_claims_sources_with_lookahead.json}}

Claim sources should sign the assertions containing `verified_claims` in order to demonstrate authenticity and provide for non-repudiation.
RP should determine the key material used for validation of the signed assertions is via the claim source's public keys. These keys should be available in the JSON web key set available in the `jwks_uri` metadata value in the `openid-configuration` metadata document. This document can be discovered using the `iss` claim of the particular JWT.

The OP can combine aggregated and distributed claims with `verified_claims` provided by itself (see (#op_attested_and_external_claims)).

If `verified_claims` elements are contained in multiple places of a response, e.g., in the ID Token and an embedded aggregated claim, the RP shall preserve the claims source as context of the particular `verified_claims` element.

Note: Any assertion provided by an OP or AS including aggregated or distributed claims can contain multiple instances of the same end-user claim. It is up to the RP to decide how to process these different instances.

## Aggregated and distributed claims validation

Clients shall validate any aggregated and distributed `verified_claims` they wish to rely on in the following manner:

1. Ensure that both the `_claim_names` and `_claim_sources` are present in the response.
2. Ensure that there is a `verified_claims` element present in the `_claim_names` member of the response.
3. Ensure that the `verified_claims` element contains a value that is one of the following:
    a. a string that exists as a key name in the `_claim_sources` element of the response.
    b. a JSON array containing members that all exist as key names in the `_claim_sources` element of the response.
    c. a JSON object containing elements that all exist as key names in the `_claim_sources` element of the response and each element is formatted with the syntax as defined for requesting `verified_claims`.
4. Ensure that the `_claim_sources` element is a JSON structured object that has one or more sub-elements.
5. Ensure that the sub-elements of the `_claim_sources` element have matching values in the `_claim_names` element of the response.

When `verified_claims` are delivered as distributed claims, i.e., when a sub-element of the `_claim_sources` contains the `endpoint` claim, clients shall also:

1. Ensure that the `endpoint` element defined in any distributed `_claim_sources` uses the https URI scheme.
2. Retrieve the distributed claims object from the `endpoint` element defined in any distributed `_claim_sources`.
3. Ensure that the object returned from the `endpoint` is a JWT as per [@RFC7519].

When `verified_claims` are delivered as aggregated claims, i.e., when a sub-element of the `_claim_sources` contains the `JWT` claim, clients shall also:

1. Ensure that the value in the `JWT` claim is a valid JWT as per [@RFC7519].

Once the JWT has been delivered either via distributed or aggregated mechanism the client shall:

1. Verify the signature of the returned JWT.
2. Ensure that the JWT includes the `typ`, `iss`, `sub`, and `verified_claims` elements; and that their values are not null or empty.
3. Ensure that the JWT does not contain either an `exp` claim or an `aud` claim.
4. Ensure that the value of the `typ` header parameter in the JWT is `provided-claims+jwt`.

# Requesting verified claims

Making a request for verified claims and related verification data can be explicitly requested on the level of individual data elements by utilizing the `claims` parameter as defined in section 5.5 of the OpenID Connect specification [@!OpenID].

It is also possible to use the `scope` parameter to request one or more specific pre-defined claim sets as defined in section 5.4 of the OpenID Connect specification [@!OpenID].

Note: The OP shall not provide the RP with any data it did not request. However, the OP may at its discretion omit claims from the response.

The example authorize call in this section will use the following unencoded example claims request parameter:

<{{examples/request/simple_id_token.json}}

The following is the non-normative example request that would be sent by the user agent to the authorization server in response to the HTTP 302 redirect from the client initiating the authorization code flow (with line wraps within values for display purposes only):

```
  GET /authorize?
     response_type=code
     &scope=openid%20email
     &client_id=s6BhdRkqt3
     &state=af0ifjsldkj
     &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
     &claims=%7B%22id_token%22%3A%20%7B%22
     given_name%22%3A%20null%2C%22
     verified_claims%22%3A%20%7B%22
     verification%22%3A%20%7B%22
     trust_framework%22%3A%20null%7D%2C%22
     claims%22%3A%20%7B%22
     family_name%22%3A%20null%7D%7D%7D%7D HTTP/1.1
  Host: server.example.com
```

# OP metadata {#opmetadata}

The OP advertises its capabilities with respect to verified claims in its openid-configuration (see [@!OpenID-Discovery]) using the following new elements:

`trust_frameworks_supported`: Required. JSON array containing all supported trust frameworks. This array shall have at least one member.

`claims_in_verified_claims_supported`: Required. JSON array containing all claims supported within `verified_claims`. claims that are not present in this array shall not be returned within the `verified_claims` object. This array shall have at least one member.

`evidence_supported`: Required when one or more type of evidence is supported. JSON array containing all types of identity evidence the OP uses. This array shall have at least one member. Members of this array should only be the types of evidence supported by the OP in the `evidence` element (see section 5.4.4 of [@!IDA-verified-claims]).

`documents_supported`: Required when `evidence_supported` contains "document". JSON array containing all identity document types utilized by the OP for identity verification. This array shall have at least one member.

`documents_methods_supported`: Optional. JSON array containing the verification methods the OP supports for evidences of type "document" (see [@!predefined_values_page]). When present this array shall have at least one member.

`documents_check_methods_supported`: Optional. JSON array containing the check methods the OP supports for evidences of type "document" (see [@!predefined_values_page]). When present this array shall have at least one member.

`electronic_records_supported`: Required when `evidence_supported` contains "electronic\_record". JSON array containing all electronic record types the OP supports (see [@!predefined_values_page]). When present this array shall have at least one member.

This is an example openid-configuration snippet:

```json
{
...
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
...
}
```

If the OP supports the `claims` parameter as defined in section 5.5 of the OpenID Connect specification [@!OpenID], the OP shall advertise this in its OP metadata using the `claims_parameter_supported` element.

If the OP supports distributed and/or aggregated claim types, as defined in section 5.6.2 of the OpenID Connect specification [@!OpenID], in `verified_claims`, the OP shall advertise this in its metadata using the `claim_types_supported` element.

# Privacy consideration {#Privacy}

The use of scopes is a potential shortcut to request a pre-defined set of claims, however, the use of scopes might result in more data being returned to the RP than is strictly necessary and not achieving the goal of data minimization. The RP should only request end-user claims and metadata it requires.

Timestamps with a time zone component can potentially reveal the person’s location. To preserve the person’s privacy, timestamps within the verification element and verified claims that represent times should be represented in Coordinated Universal Time (UTC), unless there is a specific reason to include the time zone, such as the time zone being an essential part of a consented time related claim in verified data.

# Security considerations {#Security}

## Security profile

This document focuses on mechanisms to carry end-user claims and accompanying metadata in JSON objects and JSON Web Tokens, typically as part of an OpenID Connect protocol exchange. Since such an exchange is supposed to take place in security sensitive use cases, implementers shall:

* combine this document with an appropriate security profile for OpenID Connect, and
* ensure end-users are authenticated using appropriately strong authentication methods.

This document does not define or require a particular security profile since there are several security
profiles and new security profiles under development.  Implementers have the flexibility to select the security profile that best suits
their needs. Implementers might consider [@FAPI-1-SP] or [@FAPI-2-SP].

Implementers should select a security profile that has a certification program or other resources that allow both OpenID providers and relying parties to ensure they have complied with the profile’s security and interoperability requirements, such as the OpenID Foundation Certification Program, https://openid.net/certification/.

Receiving parties shall ensure the integrity and authenticity of the issued assertions in order to prevent identity spoofing.

Receiving parties shall ensure the confidentiality of all end-user data exchanged between the protocol parties using suitable methods at transport or application layer.

## End-user authentication

Secure identification of end-users not only depends on the identity verification at the OP but also on the strength of the user authentication at the OP. Combining a strong identification with weak authentication creates a false impression of security while being open to attacks. For example if an OP uses a simple PIN login, an attacker could guess the PIN of another user and identify himself as the other user at an RP with a high identity assurance level. To prevent this kind of attack, RPs should request the OP to authenticate the user at a reasonable level, typically using multi-factor authentication, when requesting verified end-user claims. OpenID Connect supports this by way of the `acr_values` request parameter.

# Implementation and interoperability {#Interoperability}

To achieve the full security and interoperability benefits, it is important the implementation of this document, and the underlying OpenID Connect and OAuth specifications, and selected security profile, are complete and correct. The OpenID Foundation provides tools that should be used to confirm that deployments behave as described in the specifications, with information available at: https://openid.net/certification/.

# Predefined values {#predefined_values}

This document focuses on the technical mechanisms to convey verified claims and thus does not define any identifiers for trust frameworks, documents, methods, check methods. This is left to adopters of the technical specification, e.g., implementers, identity schemes, or jurisdictions.

Each party defining such identifiers shall ensure the collision resistance of these identifiers. This is achieved by including a domain name under the control of this party into the identifier name, e.g., `https://mycompany.com/identifiers/cool_check_method`.

The eKYC and Identity Assurance Working Group maintains a wiki page [@!predefined_values_page] that can be utilized to share predefined values with other parties.

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
    <title>OpenID Connect Core 1.0 incorporating errata set 2</title>
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
    <title>OpenID Connect Discovery 1.0 incorporating errata set 2</title>
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

<reference anchor="FAPI-1-SP" target="https://openid.net/specs/openid-financial-api-part-2-1_0.html">
  <front>
    <title>Financial-grade API (FAPI) Security Profile 1.0 - Part 2: Advanced</title>
    <author initials="N." surname="Sakimura" fullname="Nat Sakimura">
      <organization>Nat.Consulting</organization>
   </author>
    <author initials="J." surname="Bradley" fullname="John Bradley">
      <organization>Yubico</organization>
    </author>
    <author initials="E." surname="Jay" fullname="Edmund Jay">
      <organization>Illumila</organization>
    </author>
   <date day="12" month="Mar" year="2021"/>
  </front>
</reference>

<reference anchor="FAPI-2-SP" target="https://openid.bitbucket.io/fapi/fapi-2_0-security-profile.html">
  <front>
    <title>FAPI 2.0 Security Profile - draft</title>
    <author initials="D." surname="Fett" fullname="Daniel Fett">
      <organization>Authlete</organization>
    </author>
    <author initials="D." surname="Tonge" fullname="Dave Tonge">
      <organization>Moneyhub Financial Technology</organization>
    </author>
    <author initials="J." surname="Heenan" fullname="Joseph Heenan">
      <organization>Authlete</organization>
    </author>
   <date day="3" month="Apr" year="2024"/>
  </front>
</reference>

<reference anchor="OpenID4IDAClaims" target="https://openid.net/specs/openid-connect-4-ida-claims-1_0.html">
  <front>
    <title>OpenID Connect for Identity Assurance Claims Registration 1.0</title>
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

<reference anchor="IDA-verified-claims" target="https://openid.net/specs/openid-ida-verified-claims-1_0.html">
  <front>
    <title>OpenID Identity Assurance Schema Definition</title>
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
   <date day="9" month="Aug" year="2023"/>
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

<reference anchor="IANA.MediaTypes" target="https://www.iana.org/assignments/media-types">
 <front>
   <title>Media Types</title>
   <author><organization>IANA</organization></author>
 </front>
</reference>

# IANA considerations

## Media type registration

This section registers the `application/provided-claims+jwt` media type [@RFC2046]
in the IANA "Media Types" registry [@IANA.MediaTypes] in the manner described in [@RFC6838],
which is used to indicate that the content is a JWT describing aggregated claims.

  * Type name: application
  * Subtype name: provided-claims+jwt
  * Required parameters: n/a
  * Optional parameters: n/a
  * Encoding considerations: binary; An external claims JWT is a JWT; JWT values are encoded as a series of base64url-encoded values (some of which may be the empty string) separated by period ('.') characters.
  * Security considerations: See https://openid.net/specs/openid-connect-4-identity-assurance-1_0.html#name-representing-verified-claim
  * Interoperability considerations: n/a
  * Published specification: (#verified_claims_delivery) of [[ this specification ]]
  * Applications that use this media type: When using [[ this specification ]], this media type is used in the `typ` header of assertions provided as aggregated or distributed claims (see section 5.6.2 of the OpenID Connect specification [@!OpenID]).
  * Fragment identifier considerations: n/a
  * Additional information:
    * File extension(s): n/a
    * Macintosh file type code(s): n/a
  * Person &amp; email address to contact for further information: Daniel Fett, mail@danielfett.de
  * Intended usage: COMMON
  * Restrictions on usage: none
  * Author: Daniel Fett, mail@danielfett.de
  * Change controller: IETF
  * Provisional registration? No


# Example requests
This section shows examples of requests for `verified_claims`.

## Verification of claims by a document

<{{examples/request/verification_deeper.json}}

Note that, as shown in the above example, this document requires that implementations receiving requests are able to distinguish between JSON objects where a key is not present versus where a key is present with a null value.

Support for these null value requests is mandatory for identity providers, so implementers are encouraged to test this behaviour early in their development process. In some programming languages many JSON libraries or HTTP frameworks will, at least by default, ignore null values and omit the relevant key when parsing the JSON.

## Verification of claims by trust framework and evidence types

<{{examples/request/verification_claims_trust_frameworks_evidence.json}}

## Verification of claims by trust framework and check method

<{{examples/request/verification_spid_document_biometric.json}}

## Verification of claims by electronic signature

<{{examples/request/verification_electronic_signature.json}}

# Example responses

This section shows examples of responses containing `verified_claims`.

The first and second subsections show JSON snippets of the general identity assurance case, where the RP is provided with verification evidence for different methods along with the actual claims about the end-user.

The third subsection illustrates the possible contents of this object in case of a notified eID system under eIDAS, where the OP does not need to provide evidence of the identity verification process to the RP.

Subsequent subsections contain examples for using the `verified_claims` claim on different channels and in combination with other (unverified) claims.

## Document

<{{examples/response/document_800_63A.json}}

Same document under a different `trust_framework`

<{{examples/response/document_UK_DIATF.json}}

## Document and verifier details

<{{examples/response/document_verifier.json}}

## Evidence with all assurance details

<{{examples/response/evidence_with_assurance_details.json}}

## Notified eID system (eIDAS)

<{{examples/response/eidas.json}}

## Electronic_record

<{{examples/response/electronic_record.json}}

## Vouch

<{{examples/response/vouch.json}}

## Multiple verified claims

<{{examples/response/multiple_verified_claims.json}}

## Claims provided by the OP and external sources {#op_attested_and_external_claims}

This example shows how an OP can mix own claims and claims provided by
external sources in a single ID Token.

<{{examples/response/all_in_one.json}}

## Self-Issued OpenID provider and external claims

This example shows how a Self-Issued OpenID provider (SIOP)
may include verified claims obtained from different external claim
sources into an ID Token.

<{{examples/response/siop_aggregated_and_distributed_claims.json}}

# Example requests and responses

This section shows examples of pairs of requests and responses containing `verified_claims`.

## verified claims in UserInfo response

### Request

In this example we assume the RP uses the `scope` parameter to request the email address and, additionally, the `claims` parameter, to request verified claims.

The scope value is: `scope=openid email`

The value of the `claims` parameter is:

<{{examples/request/userinfo.json}}

### Response

The respective UserInfo response would be

<{{examples/response/userinfo.json}}

## verified claims in ID Tokens

### Request

In this case, the RP requests verified claims along with other claims about the end-user in the `claims` parameter and allocates the response to the ID Token (delivered from the token endpoint in case of grant type `authorization_code`).

The `claims` parameter value is

<{{examples/request/id_token.json}}

### Response

The decoded body of the respective ID Token could be

<{{examples/response/userinfo.id_token.json}}

# Acknowledgements {#Acknowledgements}

The following people at yes.com and partner companies contributed to the concept described in the initial contribution to this document: Karsten Buch, Lukas Stiebig, Sven Manz, Waldemar Zimpfer, Willi Wiedergold, Fabian Hoffmann, Daniel Keijsers, Ralf Wagner, Sebastian Ebling, Peter Eisenhofer.

We would like to thank Julian White, Bjorn Hjelm, Stephane Mouy, Alberto Pulido, Joseph Heenan, Vladimir Dzhuvinov, Azusa Kikuchi, Naohiro Fujie, Takahiko Kawasaki, Sebastian Ebling, Marcos Sanz, Tom Jones, Mike Pegman, Michael B. Jones, Jeff Lombardo, Taylor Ongaro, Peter Bainbridge-Clayton, Adrian Field, George Fletcher, Tim Cappalli, Michael Palage, Sascha Preibisch, Giuseppe De Marco, Nick Mothershaw, Hodari McClain, Dima Postnikov and Nat Sakimura for their valuable feedback and contributions that helped to evolve this document.

# Notices

Copyright (c) 2024 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this document was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this document or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this document make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this document to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this document.
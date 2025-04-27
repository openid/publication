%%%
title = "OpenID Federation Extended Subordinate Listing 1.0 - draft 02"
abbrev = "openid-federation-extended-listing"
ipr = "none"
workgroup = "OpenID Connect A/B"
keyword = ["security", "openid"]

[seriesInfo]
name = "Internet-Draft"
value = "openid-federation-extended-listing"
status = "standard"

[[author]]
initials="G."
surname="De Marco"
fullname="Giuseppe De Marco"
organization="Dipartimento per la trasformazione digitale"
[author.address]
email = "gi.demarco@innovazione.gov.it"

[[author]]
initials="M."
surname="Fraser"
fullname="Michael Fraser"
organization="Raidiam"
[author.address]
email = "michael.fraser@raidiam.com"

[[author]]
initials="Ł."
surname="Jaromin"
fullname="Łukasz Jaromin"
organization="Raidiam"
[author.address]
email = "lukasz.jaromin@raidiam.com"

[[author]]
initials="M.B."
surname="Jones"
fullname="Michael B. Jones"
organization="Self-Issued Consulting"
[author.address]
email = "michael_b_jones@hotmail.com"
uri = "https://self-issued.info/"

%%%

.# Abstract

This specification acts as an extension to the [@!OpenID.Federation]. It defines a mechanism to interact with a given
Federation with a potentially large number of registered Entities, as well as mechanisms to retrieve multiple
Subordinate Statements along with associated details in a single request.

{mainmatter}

# Introduction

The Federation Extended Subordinate Listing endpoint has been created to address two outstanding issues identified
in [@!OpenID.Federation].

## Response Size

The `federation_list_endpoint` as defined in [@!OpenID.Federation] has limitations when an Entity has a large number of
configured Subordinate Entities. In this scenario, practical limitations can be encountered both for consumers
attempting to process such large response sets and more technical limitations with infrastructure limits when returning
exceptionally large datasets. This document defines a form of pagination to address this.

## Bulk Retrieval

For certain use cases, such as mass registration, consumers may encounter challenges when attempting to retrieve
information about multiple Entities. A flow with the standard `federation_list_endpoint` may involve a request to the
list endpoint followed by a series of subsequent requests to retrieve a Subordinate Statement for each listed Entity
resulting in an N+1 operation. The Federation Extended Subordinate Listing endpoint seeks to solve this by providing a
mechanism to include additional metadata for Entities in the provided list.

## Requirements Notation and Conventions

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT
RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP
14 [@!RFC2119] [@!RFC8174] when, and only when, they appear in all capitals, as shown here.

# Terminology

This specification uses the terms "Entity Identifier", "Subordinate Statement", "Trust Anchor", "Intermediate", "
Federation Entity", "Entity", "federation_list_endpoint", and "Immediate Subordinate Entity" as defined
in [@!OpenID.Federation], "NumericDate" as defined in [@!RFC7591].

# Extended Subordinate Listing Endpoint

The Federation Extended Subordinate Listing endpoint is exposed by Federation Entities acting as a Trust Anchor or
Intermediate. The endpoint lists the Immediate Subordinate Entities about which the Issuing Entity can issue Subordinate
Statements.

While similar to the `federation_list_endpoint`, the `Federation Extended Subordinate Listing Endpoint` provides both
pagination of the result, optionally extensive details about subject Immediate Subordinate Entities, and flexibility in
the definition of custom filters.

This endpoint is particularly valuable in scenarios where a federation contains one or more Intermediates that manage a
large number of Immediate Subordinate Entities. To efficiently handle potentially large datasets, the endpoint
incorporates a pagination capability. This allows clients to retrieve the data in manageable chunks.

## Pagination

By segmenting the data into pages, the endpoint facilitates the efficient transmission and processing of data and also
adds to the client's ability to navigate through the information.

The selected method of pagination offers a mix of consistency and performance characteristics appropriate for the
intended use of the endpoint. Primarily, the size of the dataset does not impact performance. Additionally any changes
made to previously retrieved pages do not affect the overall result consistency, while any changes in pages yet to be
fetched will be reflected in the overall result list.

### Ordering

As pagination enables consumers of this endpoint to
retrieve a subset of the full dataset, the issuing Entity MUST ensure consistent ordering is implemented across all
returned responses. No recommendation is made on which key the ordering is based upon and is left up to the choice of
implementing Entities.

The endpoint is accessible via the `federation_extended_list_endpoint` URL, which is published in the issuing Entity's
`federation_metadata`.

### Response Limits

This endpoint defines the `limit` query parameter, allowing consumers to specify a desired maximum number of Entities
returned in a given response set. However, this number may, in some cases, be impractical or not feasible for the
issuing Entity to return. To address this, it is RECOMMENDED that implementations define a practical upper limit for the
response size that can be served. This defined limit MUST be set to a value that ensures if no limit is specified in a
request, or if the implementation deems the requested limit impractical, the response can be returned successfully with
all requested additional parameters.

## Extended Subordinate Listing Request

This endpoint follows the same rules that are defined in the `federation_list_endpoint` regarding client authentication,
HTTP methods used, and the way parameters are passed.

The endpoint accepts all parameters defined in the `federation_list_endpoint` in addition to the parameters defined in
the table below.

| **Parameter**    | **Availability** | **Type**          | **Value**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|------------------|------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| from_entity_id   | OPTIONAL         | Entity Identifier | If this parameter is present, the resulting list MUST be the subset of the overall ordered response starting from the index of the Entity referenced with this parameter inclusive. The list's size MUST NOT exceed the server's chosen upper limit.<br><br>If the Entity Identifier that equals value of this parameter does not exist, the HTTP status code 400 MUST be used with the content type `application/json` with the error code `entity_id_not_found`. Implementations MUST understand this parameter. TBD: Recommend client behavior on error.                                 |
| limit            | OPTIONAL         | Positive Integer  | Requested maximum number of results to be included in the response.<br><br> If this parameter is present, the number of results in the returned list SHOULD NOT be greater than the value of this parameter. Implementations MUST understand this parameter.                                                                                                                                                                                                                                                                                                                                |
| updated_after    | OPTIONAL         | NumericDate       | Epoch time constraining the response to include only Immediate Subordinates that are the subject of Subordinate Statements with updates at or after this time. <br><br>When this parameter is present, it is RECOMMENDED that the `registered` and `updated` parameters be included in the response. If the responder does not support this feature, it MUST use the HTTP status code 400 and set the content type to `application/json`, with the error value set to `unsupported_parameter`.                                                                                                          ||
| updated_before   | OPTIONAL         | NumericDate       | Epoch time constraining the response to include only Immediate Subordinates that are the subject of Subordinate Statements with updates at or before this time.<br><br>When this parameter is present, it is RECOMMENDED that the `registered` and `updated` parameters be included in the response. If the responder does not support this feature, it MUST use the HTTP status code 400 and set the content type to `application/json`, with the error value set with `unsupported_parameter`.                                                                                                          ||
| audit_timestamps | OPTIONAL         | Boolean           | Request parameter to control presence of the `registered` and `updated` audit timestamps attributes for all returned Immediate Subordinates.<br><br>If this parameter is present and set to `true` the response MUST include the above mentioned audit timestamp attributes for each Immediate Subordinate Entity included in the response. If the responder does not support this feature, it MUST use the HTTP status code 400 and set the content type to `application/json`, with the error code `unsupported_parameter`.                                                                   |
| claims           | OPTIONAL         | Array             | List of any additional claims beyond those defined in this table to be included in the response for each returned Immediate Subordinate Entity.<br><br>If this parameter is present and it is NOT an empty array, each returned Immediate Subordinate Entity MUST include the requested claims for a Subordinate Statement, if available.<br><br>Supported options for this parameter SHOULD be all top level `Entity Statement` claims defined in [@!OpenID.Federation] and MAY include any additionally defined claims. TBD: Support of requests for discrete Entity metadata attributes. ||

*Table 1: Additional request parameters accepted by the Federation Extended Subordinate Listing endpoint in addition to
the those specified by the `federation_list_endpoint`*

Below are non-normative examples of an HTTP GET request to the Federation Extended Subordinate Listing endpoint:

```
GET /list_extended HTTP/1.1
Host: trust-anchor.star-federation.example.net
```

*Figure 1: Initial request without parameters to list Immediate Subordinates. Typically an initial request.*

```
GET /list_extended?from_entity_id=https://rp0.example.net/oidc/rp HTTP/1.1
Host: trust-anchor.star-federation.example.net
```

*Figure 2: Request with `from_entity_id` parameter to list Immediate Subordinate contained in a subsequent page.*

```
GET /list_extended?updated_after=946681201&entity_type=openid_relying_party HTTP/1.1
Host: trust-anchor.star-federation.example.net
```

*Figure 3: Request to list Entities of a certain type and updated since certain point in time.*

```
GET /list_extended?claims=trust_marks HTTP/1.1
Host: trust-anchor.star-federation.example.net
```

*Figure 4: Request to list all Entities and only include Trust Marks in the response.*

## Extended Subordinate Listing Response

A successful response MUST use an HTTP status code 200 with the content type `application/json`. The response body is a
JSON object containing the claims specified in the table below.

| **Claim**                      | **Availability** | **Type**          | **Value**                                                                                                                                                                                                                             |
|--------------------------------|------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| immediate_subordinate_entities | REQUIRED         | Array             | Array of JSON objects, each describing an Immediate Subordinate Entity using the structure defined in the table below                                                                                                                 |
| next_entity_id                 | OPTIONAL         | Entity Identifier | Entity Identifier for the next element in the result list where the next page begins. This attribute is mandatory when additional results are available beyond those included in the returned `immediate_subordinate_entities` array. |

*Table 2: Top-level attributes included in the Subordinate Entity JSON object returned in the response body*

Deployments MAY define and use additional claims.

Each JSON object in the returned `immediate_subordinate_entities` array MAY contain claims from the sets defined for
Entity Statements and metadata in [@!OpenID.Federation] as well as those defined in the table below. Deployments MAY
additionally choose to define additional claims that can be returned here.

| **Claim**                                                     | **Availability** | **Type**          | **Value**                                                                                                                                                                                                                                                                                                                                                                                                            |
|---------------------------------------------------------------|------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                                                            | REQUIRED         | Entity Identifier | Entity Identifier for the subject entity of the current record                                                                                                                                                                                                                                                                                                                                                      |
| subordinate_statement                                         | OPTIONAL         | String            | Subordinate Statement for the Immediate Subordinate Entity as issued by the Entity that exposes the Federation Extended Subordinate Listing endpoint.<br><br>This `subordinate_statement` attribute MUST be returned if the `claims` parameter is present and contains `subordinate_statement`. It MUST NOT be returned if the `claims` parameter is present but the array does not contain `subordinate_statement`. |
| registered                                                    | OPTIONAL         | Number            | Time when the Entity was registered with the issuing party using NumericDate format.                                                                                                                                                                                                                                                                                                                                 |
| updated                                                       | OPTIONAL         | Number            | Time when the Entity was updated using the time format defined for the `iat` claim in [@!RFC7519]. This parameter MAY indicate that the Federation Entity Keys or metadata policies or constraints about this Entity was updated.                                                                                                                                                                                    |
| trust_marks, metadata, and/or other selected statement claims | OPTIONAL         | N/A               | Selected Immediate Subordinate claims as requested with the `claims` request attribute.                                                                                                                                                                                                                                                                                                                              |

*Table 3: Structure of the Immediate Entity JSON object in the `immediate_subordinate_entities` array*

The following are non-normative examples of a JSON response from the Federation Extended Subordinate Listing endpoint:

```
GET /list_extended HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://rp0.example.net/oidc/rp",
      "subordinate_statement": "eyJ0eXAiOiJlbnRpdHktc3RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiQlh2ZnJ..."
    },
    {
      "id": "https://rp0.example.net/oidc/rp",
      "subordinate_statement": "eyH1eZUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    }
  ]
}
```

*Figure 5: Example Federation Extended Subordinate Listing endpoint response that includes Subordinate Statements.*

```
GET /list_extended?audit_timestamps=true&claims=subordinate_statement HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://rp0.example.net/oidc/rp",
      "subordinate_statement": "eyH1eZUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ...",
      "registered":1704217689,
      "updated":1704217789
    },
  ]
}
```

*Figure 6: Example Federation Extended Subordinate Listing endpoint response that includes a Subordinate Statement and
audit timestamps*

```
GET /list_extended?claims=subordinate_statement,trust_marks HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://rp1.example.net/oidc/rp",
      "trust_marks": [
        {
          "id": "https://www.spid.gov.it/certification/rp",
          "trust_mark": "eyJraWQiOiJmdWtDdUtTS3hwWWJjN09lZUk3Ynlya3N5a0E1bDhP..."
        }
      ],
      "subordinate_statement": "eyH1eZUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ...",
    }
  ]
}
```

*Figure 7: Example Federation Extended Subordinate Listing endpoint response that includes Subordinate Statements and
Trust Marks*

# Federation Entity Property

In order for Entities to advertise the Federation Extended Subordinate Listing, a new property has been defined adding
to the existing set of Federation Entity Metadata as defined in [@!OpenID.Federation].

| **Metadata**                      | **Availability** | **Description**                                                                                                                                                                                                                                |
|-----------------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| federation_extended_list_endpoint | OPTIONAL         | The Federation Extended Subordinate Listing endpoint as described above. All constraints and restrictions on the listing of this endpoint are identical to that defined for the `federation_list_endpoint` as defined in OpenID Federation 1.0 |

# Examples

This section contains non-normative examples that demonstrate how to use the Federation Extended Subordinate Listing
endpoint to retrieve subsets of Subordinates.

```
GET /list_extended HTTP/1.1

200 OK
Content-Type: application/json
{
  "immediate_subordinate_entities": [
    {
      "id": "https://0.example.net",
      "subordinate_statement": "eyJ0eXAiOiJlbnRpdHktc3RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiQlh2ZnJ..."
    },
    {
      "id": "https://1.example.net",
      "subordinate_statement": "eyH1eZUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    },
    ...
    {
      "id": "https://99.example.net",
      "subordinate_statement": "eyK2aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    }
  ],
  "next_entity_id": "https://100.example.net"
}
```

*Figure 8: A Trust Anchor returns the results list consisting of a large number of Immediate Subordinate Entities, along
with the subsequent Entity Identifier used to retrieve the next page. This request specified no `limit` however the
Issuing Entity chose to limit the response size according to it's defined upper limit.*

```
GET /list_extended?from_entity_id=https://100.example.net HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://100.example.net",
      "subordinate_statement": "eyK2aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    },
    {
      "id": "https://101.example.net",
      "subordinate_statement": "eyH4aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    },
    {
      "id": "https://102.example.net",
      "subordinate_statement": "eyW9aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    }
  ]
}
```

*Figure 9: A Trust Anchor returns all Entities starting from the Entity id provided as a parameter.*

```
GET /list_extended?updated_after=946681201&entity_type=openid_relying_party&audit_timestamps=true HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://123.example.net",
      "subordinate_statement": "eyJ0eXAiOiJlbnRpdHktc3RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiQlh2ZnJ...",
      "registered": 1704217689,
      "updated": 1704217789
    },
    {
      "id": "https://323.example.net",
      "subordinate_statement": "eyW9aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ...",
      "registered": 1704217689,
      "updated": 1704217789
    },
    ...
    {
      "id": "https://342.example.net",
      "subordinate_statement": "eyK2aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ...",
      "registered": 1704217689,
      "updated": 1704217789
    }
  ],
  "next_entity_id": "https://736.example.net"
}
```

*Figure 10: Get list of Immediate Subordinates updated after certain moment in time. The response contains more than one
page.*

# Security Considerations

The security considerations of OpenID Federation 1.0 [OpenID.Federation]
apply to this specification.

{backmatter}

<reference anchor="OpenID.Federation" target="https://openid.net/specs/openid-federation-1_0.html">
    <front>
        <title>OpenID Federation 1.0</title>
        <author fullname="R. Hedberg, Ed.">
            <organization>independent</organization>
        </author>
        <author fullname="Michael B. Jones">
            <organization>Self-Issued Consulting</organization>
        </author>
        <author fullname="A. Solberg">
            <organization>Sikt</organization>
        </author>
        <author fullname="John Bradley">
            <organization>Yubico</organization>
        </author>
        <author fullname="Giuseppe De Marco">
            <organization>independent</organization>
        </author>
        <author fullname="Vladimir Dzhuvinov">
            <organization>Connect2id</organization>
        </author>
        <date day="24" month="October" year="2024"/>
    </front>
</reference>

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

# Acknowledgements

We would like to thank the following individuals for their contributions to this specification:
Ralph Bragg,
Vladimir Dzhuvinov,
and
Roland Hedberg.

# Document History

[[ To be removed from the final specification ]]

-02

* Editorial pass on various typos and formatting issues.
* Corrected example incorrectly still using the `entity_statement` query parameter renamed in 01.
* Removed references to the `revoked` parameter.
* Updates to pass the OIDF specification content validation checks.

-01

* Corrected section hierarchy for Extended Subordinate Listing Response subsection.
* Made OpenID Federation reference normative.
* Renamed the claim name `entity_statement` to `subordinate_statement` in the response.
* `entity_statement` is not mandatory in the response if not explicitly requested.
* Terminology alignments.
* Added Acknowledgements.

-00

* Initial version

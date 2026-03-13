%%%
title = "OpenID Federation Extended Subordinate Listing 1.0 - draft 00"
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
initials="L."
surname="Jaromin"
fullname="Lukasz Jaromin"
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

%%%

.# Abstract

This specification acts as an extension to the [@OpenID.Federation]. It outlines methods to interact with a given Federation with a potentially large number of registered Entities, as well as mechanisms to retrieve multiple entity statements along with associated details in a single request.

{mainmatter}

# Introduction

The extending listing endpoint has been created to address two outstanding issues identified in [@OpenID.Federation].

## Response Size

The standard `federation_list_endpoint` has limitations when entities are able to issue entity statements for an exceptionally large number of entities. Limitations can be encountered both when attempting to process receiving such a large response as well as more technical limitations such as response sizes of infrastructure. Pagination has been proposed as a solution for this.

## Bulk Retrieval

For certain usecases, such as mass registration, consumers may encounter challenges when attempting to retrieve information on multiple entities. A flow with the standard `federation_list_endpoint` may involve a request to the list endpoint followed by a series of subsequent requests to retrieve an entity statement for each listed entity resulting in an N+1 operation. The extended listing endpoint seeks to solve this by providing a mechanism to include additional metadata for entities in the provided list.

## Requirements Notation and Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [@!RFC2119] [@!RFC8174] when, and only when, they appear in all capitals, as shown here.

# Terminology

This specification uses the terms "Entity Identifier", "Subordinate Statement", "Trust Anchor", "Intermediate", "Federation Entity", "Entity", "federation_list_endpoint", and "Immediate Subordinate Entity" as defined in [@OpenID.Federation], "NumericDate" as defined in [@!RFC7591].

# Extended Subordinate Listing Endpoint

The extended subordinate listing endpoint is exposed by Federation Entities acting as a Trust Anchor or Intermediate. The endpoint lists the Immediate Subordinate Entities about which the Trust Anchor or Intermediate issues Subordinate Statements.

While similar to the `federation_list_endpoint`, the extended list endpoint provides pagination of the result, extensive details about Immediate Subordinate Entities, and flexibility in the definition of custom filters.

This endpoint is particularly valuable in scenarios where a federation contains one or more Intermediates that manage a large number of Immediate Subordinate Entities. To efficiently handle potentially large datasets, the endpoint incorporates pagination functionality. This allows clients to retrieve the data in manageable chunks.

By segmenting the data into pages, the endpoint facilitates the efficient transmission and processing of data and also adds to the client's ability to navigate through the information. As pagination enables consumers of this endpoint to retrieve a section of the larger superset of data, some form of ordering on the response MUST be established by the issuing entity. No recommendation is made on which key the ordering is based upon and is left up to the choice of implementing entities.

The selected pagination type offers a mix of consistency and performance characteristics appropriate for the intended use of the endpoint. The size of the dataset does not impact performance. Changes made to previously fetched pages do not affect the overall result consistency, while any changes in pages yet to be fetched will be reflected in the overall result list.

The endpoint is accessible via the `federation_extended_list_endpoint` URL, which is published in the `federation_metadata`.

## Extended Subordinate Listing Request

This endpoint follows the same rules that are defined in the `federation_list_endpoint` regarding client authentication, HTTP methods used, and the way parameters are passed.

The endpoint accepts all parameters defined in the `federation_list_endpoint` in addition to the parameters defined in the table below.

| **Parameter**    | **Availability** | **Type**          | **Value**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|------------------|------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| from_entity_id   | OPTIONAL         | Entity Identifier | If this parameter is present, the resulting list MUST be the subset of the overall ordered response starting from the index of the entity referenced with this paramter. The list's size MUST NOT exceed the server's chosen upper limit.<br><br>If the Entity Identifier that equals value of this parameter does not exist the HTTP status code 400 is returned and the content type `application/json` with the error code `entity_id_not_found`. TBD: Recommend client behavior on error.                                                                                                                                                                                                                                                                                                                                                                                          |
| limit            | OPTIONAL         | Positive Integer  | Requested number of results included in the response.<br><br> If this parameter is present, the number of results in the returned list must not be greater than the minimum of the server's upper limit and the value of this parameter.<br><br>If this parameter is not present the server MUST fall back on the upper limit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| updated_after    | OPTIONAL         | NumericDate       | Epoch time constraining the response to include only Entity identifiers with updates at or after this time. <br><br>When absent, there is no cutoff for how long ago updates occurred to Entities being listed.<br><br>When present the `registered`, `updated`, `revoked` MUST be included in the response unless the `audit_timestamps` parameter is set to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ||
| updated_before   | OPTIONAL         | NumericDate       | Epoch time constraining the response to include only Entity identifiers with updates at or before this time.<br><br>When absent, there is no cutoff before which updates occurred to listed Entities.<br><br>When present the `registered`, `updated`, `revoked` MUST be included in the response unless the `audit_timestamps` parameter is set to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ||
| claims           | OPTIONAL         | Array             | List of claims to be included in the response for each returned Immediate Subordinate Entity.<br><br> If this parameter is NOT present or it is an empty array, the signed entity statement MUST be the only claim for each Immediate Subordinate Entity<br><br>If this parameter is present and it is NOT an empty array each JSON object that represents the Immediate Subordinate Entity MUST include the requested claims for a subordinate entity statement if available.<br><br>Entities that expose the extended subordinate listing endpoint MUST support all top level statement claims defined in [@OpenID.Federation]. TBD: Support of requests for discrete entity metdata attributes. ||
| audit_timestamps | OPTIONAL         | Boolean           | Request parameter to control presence of  the `registered`, `updated`, `revoked` audit timestamps attributes for all returned Immediate Subordiates.<br><br>If this parameter absent the audit timestamp attributes mentioned above MUST NOT be present unless `updated_after` and/or `updated_before` parameters are present.<br><br>If this parameter is present and set to `true` the response MUST include the above mentioned audit timestamp attributes for each Immediate Subordinate Entity included in the response.<br><br>If this parameter is present and set to `false` the response MUST NOT include the above mentioned audit timestamp attributes for each Immediate Subordinate Entity included in the response. even irrespective whether the `updated_after` and/or `updated_before` request parameters are pressent.<br><br>                                                     

*Table 1: Additional request parameters accepted by the extended subordinate listing endpoint in addition to the those speficied by the `federation_list_endpoint`*

Below are non-normative examples of an HTTP GET request to the federation extended list endpoint:

```
GET /list_extended HTTP/1.1
Host: trust-anchor.star-federation.example.net
```

*Figure 1: Initial request without parameters to list immediate subordinates. Typically an initial request.*

```
GET /list_extended?from_entity_id=https://rp0.example.net/oidc/rp HTTP/1.1
Host: trust-anchor.star-federation.example.net
```

*Figure 2: Request with `from_entity_id` parameter to list immediate subordinate contained in a subseqent page.*

```
GET /list_extended?updated_after=946681201&entity_type=openid_relying_party HTTP/1.1
Host: trust-anchor.star-federation.example.net
```

*Figure 3: Request to list entities of a certain type and updated since certain point in time.*

```
GET /list_extended?claims=trust_marks HTTP/1.1
Host: trust-anchor.star-federation.example.net
```

*Figure 4: Request to list all entities and only include trust marks in the response.*

# Extended Subordinate Listing Response

A successful response MUST use the HTTP status code 200 with the content type `application/json`. The response body is a JSON object containing data specified in the table below.

| **Attribute**                  | **Availability** | **Type**          | **Value**                                                                                                                                                                                                                             |
|--------------------------------|------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| immediate_subordinate_entities | REQUIRED         | Array             | Array of JSON objects, each describing an Immediate Subordinate Entity using the structure defined in the table below                                                                                                                        |
| next_entity_id                 | OPTIONAL         | Entity Identifier | Entity Identifier for the next element in the result list where the next page begins. This attribute is mandatory when additional results are available beyond those included in the returned `immediate_subordinate_entities` array. |

*Table 2: Top-level attributes included in the subordinate JSON object returned in the response body*

Each JSON object in the returned `immediate_subordinate_entities` array MAY contain attributes from the sets defined for Entity Statements and Metadata in [@OpenID.Federation] as well as those defined in the table below.

| **Attribute**                                                 | **Availability** | **Type**          | **Value**                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|---------------------------------------------------------------|------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                                                            | REQUIRED         | Entity Identifier | Entity Identifier for the subject entity of the current record.                                                                                                                                                                                                                                                                                                                                                                                |
| entity_statement                                                     | OPTIONAL         | String            | Signed entity statement for the subordinate entity as issued by the entity that exposes the extended subordinate listing endpoint.<br><br>This `entity_statement` attribute MUST be returned if the `claims` parameter is NOT present in the request or it is present but the array is empty.<br><br>This `entity_statement` attribute MUST NOT be returned if the `claims` parameter is NOT present in the request or it is present but the array is empty. |
| trust_marks, metadata, and/or other selected statement claims | OPTIONAL         | N/A               | Selected Immediate Subrodianate claims as requested with the `claims` request attribute. <br><br>These attributes MUST NOT be returned if the `claims` parameter is NOT present in the request or it is present but the array is empty.                                                                                                                                                                                                        |
| registered                                                    | OPTIONAL         | Number            | Time when the Entity was registered with the issuing party using NumericDate format.                                                                                                                                                                                                                                                                                                                                                           |
| updated                                                       | OPTIONAL         | Number            | Time when the Entity was updated using the time format defined for the `iat` claim in [@!RFC7519]. This parameter may indicate that the Federation Entity Keys or metadatapolicies or constraints about this Entity was updated.                                                                                                                                                   |
| revoked                                                       | OPTIONAL         | Number            | Time when the Entity was revoked using the time format defined for the `iat` claim in [@!RFC7519].                                                                                                                                                                                                                                                                                 |

*Table 3: Structure of the Immediate Entity JSON object in the `immediate_subordinate_entities` array*

The following are non-normative examples of a JSON response from the Federation Extended List Endpoint:

```
GET /list_extended HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://rp0.example.net/oidc/rp",
      "entity_statement": "eyJ0eXAiOiJlbnRpdHktc3RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiQlh2ZnJ..."
    },
    {
      "id": "https://rp0.example.net/oidc/rp",
      "entity_statement": "eyH1eZUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    }
  ]
}
```

*Figure 5: Example extended list endpoint response that includes entity statements.*

```
GET /list_extended?audit_timestamps=true&claims=entity_statement HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://rp0.example.net/oidc/rp",
      "entity_statement": "eyH1eZUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ...",
      "registered":1704217689,
      "updated":1704217789,
      "revoked":1704217800
    },
  ]
}
```

*Figure 6: Example extended list endpoint response that includes an entity statement and audit timestampts*

```
GET /list_extended?claims=entity_statement,trust_marks HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://rp1.example.net/oidc/rp",
      "trust_marks": [
        {
          "id": "https://www.spid.gov.it/certification/rp",
          "entity_statement": "eyH1eZUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ...",
          "trust_mark": "eyJraWQiOiJmdWtDdUtTS3hwWWJjN09lZUk3Ynlya3N5a0E1bDhP..."
        }
      ]
    }
  ]
}
```

*Figure 7: Example extended list endpoint response that includes entity statements and trust marks*

# Federation Entity Property

In order for entities to advertise the new endpoint, a new property has been defined adding to the existing set of Federation Entity Metadata as defined in [@OpenID.Federation].

| **Metadata**                      | **Availability** | **Description**                                                                                                                                                                                                                                                                         |
|-----------------------------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| federation_extended_list_endpoint | OPTIONAL         | The extended list endpoint as described above. All constraints and restrictions on the listing of this endpoint are identical to that defined for the `federation_list_endpoint` as defined in OpenID Federation 1.0 

# Examples

This section contains non-normative examples that demonstrate how to use the Extended Subordinates Listing Endpoint to retrieve subsets of subordinates.

```
GET /list_extended HTTP/1.1

200 OK
Content-Type: application/json
{
  "immediate_subordinate_entities": [
    {
      "id": "https://0.example.net/",
      "entity_statement": "eyJ0eXAiOiJlbnRpdHktc3RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiQlh2ZnJ..."
    },
    {
      "id": "https://1.example.net/",
      "entity_statement": "eyH1eZUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    },
    ...
    {
      "id": "https://999.example.net/",
      "entity_statement": "eyK2aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    }
  ],
  "next_entity_id": "https://1000.example.net/"
}
```

*Figure 8: A Trust Anchor returns the results list consisting of thousand immediate entities, along with the next entity id that the next page starts with, in response to the request to list all immediate subordinates.*

```
GET /list_extended?from_entity_id=https://1000.example.net/ HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://1000.example.net/",
      "entity_statement": "eyK2aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    },
    {
      "id": "https://1001.example.net/",
      "entity_statement": "eyH4aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    },
    {
      "id": "https://1003.example.net/",
      "entity_statement": "eyW9aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ..."
    }
  ]
}
```

*Figure 9: A Trust Anchor returns all entities starting from the entity provided as a parameter.*

```
GET /list_extended?updated_after=946681201&entity_type=openid_relying_party&audit_timestamps=true HTTP/1.1

200 OK
Content-Type: application/json

{
  "immediate_subordinate_entities": [
    {
      "id": "https://123.example.net/",
      "entity_statement": "eyJ0eXAiOiJlbnRpdHktc3RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiQlh2ZnJ...",
      "registered": 1704217689,
      "updated": 1704217789,
      "revoked": 1704217800
    },
    {
      "id": "https://323.example.net/",
      "entity_statement": "eyW9aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ...",
      "registered": 1704217689,
      "updated": 1704217789,
      "revoked": 1704217800
    },
    ...
    {
      "id": "https://342.example.net/",
      "entity_statement": "eyK2aKUkOgKlbnRpdHktc4RhdGVtZW50K2p3dCIsImFsZyI6IlJTMjU4Iiwia2lkIjoiQlh2ZnJ...",
      "registered": 1704217689,
      "updated": 1704217789,
      "revoked": 1704217800
    }
  ],
  "next_entity_id": "https://736.example.net/"
}
```

*Figure 10: Get list of immediate subordiates updated after certain moment in time. The response contains more than one page.*

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
        <date day="31" month="May" year="2024"/>
    </front>
</reference>

# Notices

Copyright (c) 2024 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that MAY cover technology that MAY be required to practice this specification.

# Document History

[[ To be removed from the final specification ]]

-00

*  Initial version
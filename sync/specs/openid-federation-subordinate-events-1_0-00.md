%%%
title = "OpenID Federation Subordinate Events Endpoint 1.0 - draft 00"
abbrev = "openid-federation-subordinate-events"
ipr = "none"
workgroup = "individual"
keyword = ["security", "openid", "federation"]

[seriesInfo]
name = "Internet-Draft"
value = "openid-federation-subordinate-events"
status = "standard"

[[author]]
initials="G."
surname="De Marco"
fullname="Giuseppe De Marco"
organization="Dipartimento per la trasformazione digitale"
    [author.address]
    email = "gi.demarco@innovazione.gov.it"

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

This specification defines the Federation Subordinate Events Endpoint for implementations using OpenID Federation 1.0. It provides a mechanism for Trust Anchors and Intermediates to publish historical events related to their Immediate Subordinates, such as registration, revocation, and updates of their Federation Entity Keys.

{mainmatter}

# Introduction

The Federation Subordinate Events Endpoint is introduced to allow Trust Anchors and Intermediates to maintain and publish a track of registration events about their Immediate Subordinates. This endpoint is useful for transparency and accountability within a federation, by providing a historical record of significant events.

## Requirements Notation and Conventions

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT
RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP
14 [@!RFC2119] [@!RFC8174] when, and only when, they appear in all capitals, as shown here.


# Terminology

This specification uses the terms
"Entity" as defined by OpenID Connect Core [@!OpenID.Core],
"Client" as defined by [@!RFC6749],
and "Trust Mark", "Federation Entity", "Federation Entity Key", "Trust Anchor",
"Intermediate", and "Subordinate Statement" defined in [@!OpenID.Federation].

## Endpoint Description

The Federation Subordinate Events Endpoint is an optional endpoint that MAY be published by Trust Anchors and Intermediates. It MUST use the `https` scheme and MAY include port, path, and query parameter components encoded in `application/x-www-form-urlencoded` format. It MUST NOT contain a fragment component.

### Endpoint Location

The location of the Federation Subordinate Events Endpoint is published in the `federation_entity` metadata, using the `federation_subordinate_events_endpoint` parameter.

The following is a non-normative example of an Entity Configuration payload, for an Immediate Superior that includes the `federation_subordinate_events_endpoint`:

```json
{
  "iss": "https://immediate-superior.example.org",
  "sub": "https://immediate-superior.example.org",
  "iat": 1590000000,
  "exp": 1590086400,
  "jwks": {
    "keys": [
      {
        "kty": "RSA",
        "kid": "key1",
        "use": "sig",
        "n": "n4EPtAOCc9AlkeQHPzHStgAbgs7bTZLwUBZdR8_KuKPEHLd4rHVTeT",
        "e": "AQAB"
      }
    ]
  },
  "metadata": {
    "federation_entity": {
      "federation_fetch_endpoint": "https://immediate-superior.example.org/fetch",
      "federation_list_endpoint": "https://immediate-superior.example.org/list",
      "federation_subordinate_events_endpoint": "https://immediate-superior.example.org/events",
      "federation_resolve_endpoint": "https://immediate-superior.example.org/resolve"
    }
  }
}
```

## Subordinate Events Request

### Request Format

The request to the `federation_subordinate_events_endpoint` MUST be an HTTP GET request with the following query parameters, encoded in `application/x-www-form-urlencoded` format:

- **sub**: (REQUIRED) The Entity Identifier of the subject for which the historical track is being requested.

When Client authentication is used, the request MUST be an HTTP POST request, with the parameters passed in the POST body.

#### Example Request

```http
GET /federation_subordinate_events_endpoint?sub=https%3A%2F%2Frp%2Eexample%2Eorg HTTP/1.1
Host: immediate-superior.example.org
```

## Subordinate Historical Events Response

### Response Format

A successful response MUST use the HTTP status code 200 and the content type `application/entity-events-statement+jwt`. The response includes relevant events from the federation's perspective of the Entity. If it is a negative response, it will be a JSON object and the content type MUST be `application/json` and use the errors defined in [@!OpenID.Federation].

The response is a signed JWT that is explicitly typed by setting the `typ` header parameter to `entity-events-statement+jwt` to prevent cross-JWT confusion. It is signed with a Federation Entity Key.

### JWT Claims

The claims in the Subordinate events statement response are:

- **iss**: (REQUIRED) String. Entity Identifier of the issuer of the response.
- **sub**: (REQUIRED) String. Entity Identifier of the subject of the response.
- **iat**: (REQUIRED) Number. Time when this response was issued, expressed as Seconds Since the Epoch.
- **exp**: (OPTIONAL) Number. Time when this resolution is no longer valid, expressed as Seconds Since the Epoch.
- **federation_registration_events**: (REQUIRED) Array of JSON objects, each representing an event of particular interest from the federation's perspective.

#### Event Object Parameters

- **iat**: (REQUIRED) Time when the event is related to, using the time format defined for the `iat` claim.
- **event**: (REQUIRED) String that identifies the event, such as `registration`, `jwks_update`, `metadata_policy_update`, `metadata_update`, or `revocation`.
- **event_description**: (OPTIONAL) String that may offer additional information about the event.

#### Example Response

```json
{
  "iss": "https://immediate-superior.example.org",
  "sub": "https://rp.example.org",
  "iat": 1590000000,
  "federation_registration_events": [
    {
      "iat": 1590000000,
      "event": "registration"
    },
    {
      "iat": 1590000000,
      "event": "jwks_updates"
    },
    {
      "iat": 1600000000,
      "event": "revocation",
      "event_description": "compromised node"
    },
    {
      "iat": 1610000000,
      "event": "registration"
    }
  ]
}
```

### Subordinate Event Types

The following event types are defined in this specification:

- **metadata_policy_update**: Indicates when an Entity's metadata policy was updated in the Subordinate Statement about that entity, using the `metadata_policy` parameter.
- **metadata_update**: Indicates when an Entity's metadata was updated in the Subordinate Statement about that entity, using the `metadata` parameter.
- **registration**: Indicates when an Entity was registered in the federation. When a registration event is present, `metadata_update`, `metadata_policy_update`, and `jwks_update` events MUST NOT be provided at the same time, since the Entity registration is assumed to configure the initial configuration about that Entity.
- **revocation**: Indicates when an Entity's registration was revoked.
- **suspension**: Indicates when an Entity's registration was suspended.
- **jwks_update**: Indicates when an Entity's Federation Entity Keys were updated.

Additional event types MAY be defined by trust frameworks or federation operators to meet specific requirements. Such custom event types SHOULD be documented in the respective trust framework or federation operator's documentation.

# Security Considerations

The security considerations of OpenID Federation 1.0 [OpenID.Federation]
apply to this specification.

{backmatter}


<reference anchor="OpenID.Core" target="http://openid.net/specs/openid-connect-core-1_0.html">
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
        <date day="4" month="December" year="2025"/>
    </front>
</reference>

# Notices

Copyright (c) 2026 The OpenID Foundation.

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
Vladimir Dzhuvinov,
Roland Hedberg,
and
Andres Olave.

# Document History

[[ To be removed from the final specification ]]

-00

* Initial version, fixing OpenID Federation issue #175.

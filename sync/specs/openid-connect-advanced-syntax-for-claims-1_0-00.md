%%%
title = "OpenID Connect Advanced Syntax for Claims (ASC) 1.0"
abbrev = "openid-connect-asc-1_0"
ipr = "none"
workgroup = "eKYC-IDA"
keyword = ["openid", "identity assurance", "ekyc", "asc", "data minimization"]

[seriesInfo]
name = "Internet-Draft"

value = "openid-connect-advanced-syntax-for-claims-1_0-00"

status = "standard"

[[author]]
initials="D."
surname="Fett"
fullname="Daniel Fett"
organization="Authlete"
    [author.address]
    email = "mail@danielfett.de"

%%%

.# Abstract

This specification defines an extension of OpenID Connect to enable new features for requesting and receiving Claims and meta-information about Claims.  There are two components that can be implemented independently or together, "Selective Abort and Omit" and "Transformed Claims".  These components enable additional data minimization requirements to be expressed between the Relying Party and the Identity Provider thus helping both parties comply with business requirements, policies and regulatory requirements relating to limiting data being transferred to that which is needed.

{mainmatter}

# Introduction {#Introduction}

When using OpenID Connect there are two existing mechanisms to limit the data returned.  These are through the use of the `scope` parameter (where a predefines set of claims may be described) or the `claims` parameter where individual claims can be requested explicitly. The OpenID Provider in these case may return some or all of the requested claims dependent on availability, end-user approval or some other policy.

With OpenID Connect Advanced Syntax for Claims (ASC) two further tools are made available to implementers.  The "Selective Abort and Omit" feature allows the Relying Party to express to the Identity Provider certain conditions when it might like some subset or perhaps all of the requested claims to be not returned. This is provided to allow for cases where when one or more key attributes are unavailable then the rest are insufficient to meet the business requirement and reduced return of data is better than incomplete data. With the "Transformed Claims" feature a general purpose way of taking an existing "base claim" and applying functions to it is provided.  This capability was inspired by the age verification use case where the full `birthdate` is not needed to satisfy the business requirement and would not meet the principle of data minimization. With Transformed Claims it is possible to transform `birthdate` to `age is greater than or equal to x` but also express `postcode contains "EH1"`  or `end-user nationality includes "USA"` meeting the business and policy requirements of Relying Parties much more effectively.

- resolves ambiguity, e.g., applying value/values to compound claims.

## Terminology

TBD

# Scope

This specification is based on OpenID Connect Core [@!OpenID] and defines the
technical mechanisms to allow Relying Parties present "Selective Abort and Omit" (SAO)
conditions and to request "Transformed Claims" (TC).  The specification also allows
implementers the choice to implement each feature in isolation or in conjunction
depending on their requirements, provides options for restricted
implementations, provides features for communication of these capabilities to
Relying Parties and includes examples of how both features may be used.

# Selective Abort/Omit

Using Selective Abort/Omit (SAO), an RP can define the expected behavior of an
OP when certain data is not available, when a user does not consent to the
release of the data, or when restrictions defined on claims using `value` or
`values` cannot be fulfilled. It supports a lightweight extension of existing
OpenID Connect features as well as more complex cases by allowing matching of
claims structures against JSON Schemas.

Note: SAO is in particular useful when some of the claims (e.g., verified
claims) are priced and the RP is only interested to pay for the respective
claims if certain conditions are met.

This feature is fully independent from the use of `essential` as defined in
Section 5.5 of [@!OpenID].

## Example

The following example illustrates the new syntax introduced by this
specification. It shows the contents of the `claims` request parameter.

Example 1:

```json
{
   "id_token": {
      "verified_claims": {
         "verification": {
            "trust_framework":null,
            "assurance_level": null
         },
         "claims": {
            "family_name": {
               "value":"nonexistent_family_name"
            },
            "given_name":null,
            "birthdate": null,
            "address":null
         }
      }
   },
   "userinfo": {
      "address":null
   },
   "_asc": {
      "sao": {
         "id_token":[
            {
              "loc":"/verified_claims/verification/assurance_level",
              "method": "simple",
              "value": "example_assurance_level",
              "else":"abort"
            },
            {
               "loc":"/verified_claims/claims",
               "method": "schema",
               "schema": {
                  "$schema":"http://json-schema.org/draft-07/schema#",
                  "type":"object",
                  "properties": {
                     "birthdate": {
                        "type":"string",
                        "const":"1900-01-01"
                     }
                  }
               },
               "else":"omit"
            },
            {
               "loc":"/verified_claims/claims/family_name",
               "method": "simple",
               "value": "nonexistent_family_name",
               "else":"omit",
               "what":[
                  "/verified_claims"
               ]
            }
         ],
         "userinfo":[
            {
               "loc":"/address/postal_code",
               "method": "exists",
               "else":"abort"
            }
         ]
      }
   }
}
```

Another example for using SAO together with TC is shown below.

## Syntax and Processing

To use Advanced Syntax for Claims, the RP adds a new subelement `_asc` to the
root level of the `claims` JSON structure in the authentication request. Within
`_asc`, the RP adds a new subelement `sao` that contains the SAO rules. The SAO
rules are grouped by delivery type, i.e., `id_token` and `userinfo`.

Within each delivery type, there is an array of SAO rules, each being an object
with the following fields:

 * `loc`: REQUIRED. A string containing a JSON Pointer [@!RFC6901] to the
   respective element in the ID Token or Userinfo response structure where the
   rule is to be applied.
 * `method`: OPTIONAL string. If provided, MUST be one of `simple`, `schema`, or
   `exists`. If omitted, defaults to `exists`. Support for `schema` is OPTIONAL
   for OPs and can be discovered using metadata, as described in
   (#sao-metadata).
 * `schema`: REQUIRED if `method` is `schema`, MUST NOT be present otherwise. A
   JSON schema object as defined in [@!I-D.bhutton-json-schema] that the respective element
   in the ID Token or Userinfo response structure must validate against.
 * `value` or `values`: Either `value` or `values` is REQUIRED if `method` is
   `simple`; MUST NOT be present otherwise; `value` and `values` MUST NOT be
   used together. For `value`, a valid claim value MUST be provided which is
   either a string, a number, or a boolean. For `values`, an array of such
   values MUST be provided.
 * `else`: REQUIRED. A string, either `abort` or `omit`, indicating the action
   to take if the rule is not fulfilled. If `abort` is used, the transaction
   MUST be aborted. If `omit` is used, one or more elements MUST be omitted from
   the response, as defined next.
 * `what`: OPTIONAL if the value of `else` is `omit`, MUST NOT be used
   otherwise. An array of one or more strings, each containing a JSON Pointer
   [@!RFC6901] to the respective element in the ID Token or Userinfo response
   structure that are to be omitted if the rule is not fulfilled. If `what` is
   not defined, the element specified in `loc` is omitted.

The `else` action MUST be triggered when

 * the element indicated by `loc` does not exist,
 * the element was removed by a previously executed `omit` rule, or
 * the user does not consent to the release of the claim.

Additionally, depending on the value of `method`, the following matches MUST be
performed:

 * `simple`: The value of the claim indicated by `loc` is matched against
   `value` or `values` provided in the SAO rule. If `value` is provided, the
   claim value will be matched to the provided value using exact matching. For
   `values`, the claim value must exactly match at least one of the values in
   the array. In the example above, the `assurance_level` would be matched
   against `example_assurance_level` and `family_name` would be matched against
   `nonexistent_family_name`. The `else` action MUST be triggered if the value
   of the claim does not match the requested value or values.
 * `schema`: The JSON Schema `schema` element MUST apply to the
   JSON structure under the element indicated by `loc`. In the example above,
   the schema would be applied to the whole `claims` object under
   `verified_claims`. The `else` action MUST be triggered if the schema does not
   apply.
 * `exists`: No additional matches are performed.

The SAO rules provided MUST be executed first for all `id_token` rules and then
for all `userinfo` rules.  Within each delivery type, the SAO rules MUST be
executed in the order they are provided in the request. If an `abort` action is
triggered, the transaction MUST be aborted and remaining SAO rules MUST NOT be
executed. If an `omit` action is triggered, the respective elements MUST be
omitted from the response; further SAO rules MUST be executed. Note that `omit`
is scoped to the respective delivery type, i.e., an element that was omitted
from the `id_token` response can still be present in the `userinfo` response if
it was requested for both delivery types.

In Example 1, data would be processed as follows:

 1. If the `assurance_level` is not available as a verified claim or it does not
    match the string `example_assurance_level`, the transaction is aborted.
 2. If the `birthdate` claim is not available or the birthdate is not a string
    with the value `1900-01-01`, the `verified_claims/claims` object is omitted
    from the response. Since the `verified_claims` element may not be used
    without the `claims` subelement, the whole `verified_claims` object is
    omitted.
 3. If the `family_name` is not available as a verified claim or it does not
    match the string `nonexistent_family_name`, the `verified_claims` object is
    omitted from the response.
 4. If the `postal_code` is not available in the `address` object, the
    transaction is aborted.

### Interoperability with OIDC Rules
Any restrictions defined using `value` or `values` in the `claims` parameter
outside of `_asc`/`sao` MUST be ignored when `_asc`/`sao` is present. This means
that RPs that define `_asc`/`sao` MUST define all restrictions explicitly as SAO
rules.

Relying parties MAY still use `value`/`values` outside of `_asc`/`sao` to
provide a fallback in case the OP does not support SAO. In this case, there is
no requirement for the rules outside of `_asc`/`sao` to be consistent with the
SAO rules.

## OP Metadata {#sao-metadata}

The OP advertises its capabilities with respect to Selective Abort/Omit in its openid-configuration (see [@!OpenID-Discovery]) using the following new elements:

 * `selective_abort_omit_supported`: OPTIONAL. Boolean value indicating OP support for "Selective Abort/Omit". Defaults to `false`.
 * `selective_abort_omit_schema_supported`: OPTIONAL. Boolean value indicating
   OP support for the `method` value `schema`. Defaults to `true`. If `false`,
   the OP MUST abort the transaction with an `invalid_request` error if a JSON
   Schema is used in an SAO rule.

## Privacy Considerations {#privacy}

Using Selective Abort/Omit can in general lead to more privacy preserving
systems, as an RP can instruct an OP not to send incomplete datasets that are
not useful to the RP.

An RP might be able to derive information from a response even if the response
is an error response or claims are omitted. For example, the following request
can be used to derive whether or not the user is named `Max`:

```json
{
  "id_token": {
    "given_name": {
      "value": "Max"
    }
  },
  "_asc": {
    "sao": {
      "id_token": [
        {
          "loc": "/given_name",
          "method": "simple",
          "else": "abort"
        }
      ]
    }
  }
}
```

When the request is aborted, the user is not called Max. In a naive
implementation, the abort of the request might happen before the user has
consented to the release of the data. In this case, using a series of carefully
crafted requests, an RP might be able to derive substantial information about a
user even if the user's name is never transferred from the OP to the RP
directly. A malicious RP can use this to derive user information without the
user's consent or without paying for the data. Note that `omit` can leak
information in a similar way.

To avoid leakage of user information through this mechanism without the user's
consent, implementations SHOULD in general avoid returning a result before a
user has consented to the release of the base data if privacy is a concern in
the respective application. In the example above, the user would be asked to
confirm the release of the given name data field before the OP aborts the
transaction or omits the claim. OPs MAY make exceptions for RPs when a
contractual or trust relationship with this RP was established beforehand or
there are other mechanisms in place to ensure that misuse is prevented.

To the same end, and to avoid relying parties not paying for data, OPs SHOULD
additionally consider rate-limiting requests and monitoring requests for
anomalies (frequent dynamic changes in request structure, frequent aborts).

## Compatibility Considerations

An OP not supporting ASC will ignore the additional `_asc` key as defined in
Section 5.5.1 of [@!OpenID]. An OP supporting ASC but not SAO MUST ignore the
`sao` key.

An RP may receive data from an OP that does not support SAO when aborting the
transaction or not delivering the data was requested instead. RPs can avoid this
by checking for SAO support in the metadata of the OP before sending the
request.


# Transformed Claims

Using Transformed Claims (TC), a claim value can be transformed using a limited set of functions before any further evaluation on the claim value is performed and before the claim value is returned to the RP.

Each Transformed Claim is based off exactly one Claim provided by the OP. For example, the Claim `birthdate` can be used to derive a Transformed Claim for age verification (End-User is above a certain age) by applying a suitable chain of functions.  The number of functions in the chain MAY be limited by use of the OPTIONAL OP Metadata element `transformed_claims_max_depth`.

Each function takes one input value (the original Claim's value or the output of the previous function) and produces one output value. Besides the input value, functions can only have static function arguments, typically zero or one.

## Example: Age Verification

The Claim `birthdate`, a date, can be transformed into an integer using the function `years_ago`. This function outputs the number of years between the current date and the input date, rounded down. The resulting integer can be transformed using the function `gte` with the argument `18`. This function evaluates whether the input value is greater than or equal to the given argument. Its output is either `true` or `false`. The resulting Transformed Claim, representing whether the End-User is above 18 or not, can be aliased, for example `age_18_or_over`. This Claim can be used within the OpenID Connect `claims` parameter instead of or together with the original Claim, `birthdate`.

If data for the original Claim `birthdate` is unavailable, the new Claim `age_18_or_over` shall be treated like an unavailable Claim as well.

## Defining Transformed Claims

Transformed Claims are defined by the RP in the `claims` parameter of the Authentication Request. The RP adds a new subelement `transformed_claims` within the `_asc` element in the root of the `claims` JSON structure.

`transformed_claims` is a JSON object in which each key represents a definition for a new Transformed Claim. Each definition consists of an object with the following keys:

 * `claim` defines the Claim on which the Transformed Claim is based
 * `fn` is the array of functions to apply to the base Claim, in order of application. Each function is either a string, like `year_ago` to apply the function without further arguments, or an array, like `["gte", 18]`, to apply the function with arguments.

For example, the Transformed Claim for age verification from above could be defined as follows:

```json
{
  "_asc": {
    "transformed_claims": {
      "age_18_or_over": {
        "claim": "birthdate",
        "fn": [
          "years_ago",
          [
            "gte",
            18
          ]
        ]
      }
    }
  },
  "id_token": {
    ...
  }
}

```

Note: There can be multiple Transformed Claims defined on the same base Claim.

TODO: Define charset for transformed claim names, shall not start with ':'.

### Requesting Transformed Claims

To request a Transformed Claim, the RP uses the name of the Transformed Claim where it would normally use the base Claim. A colon (`:`) is prepended to avoid confusion with potentially existing normal Claims.

Example:
```json
{
  "_asc": {
    "transformed_claims": {
      "age_18_or_over": {
        "claim": "birthdate",
        "fn": [
          "years_ago",
          [
            "gte",
            18
          ]
        ]
      }
    }
  },
  "id_token": {
    "given_name": null,
    "family_name": null,
    ":age_18_or_over": null
  }
}

```

In some circumstances, the same Claim name can appear in different locations within the `claims` parameter with different meanings. For example, in [@!IDA], `birthdate` can also be used within `verified_claims/claims`. Therefore, the reference to the base Claim shall be evaluated relative to the location where the Transformed Claim is used.

Example: In [@!IDA], the same `age_18_or_over` Claim defined above can be evaluated based on the 'Verified Claim' `birthdate` when used like this:

```json
{
  ...
  "id_token": {
    "verified_claims": {
      "claims": {
        "given_name": null,
        "family_name": null,
        ":age_18_or_over": null
      },
      ...
    }
  }
}

```
It is therefore theoretically possible to use the same Transformed Claim in two
different locations in the request, yielding potentially different values.

Any option available for normal Claims can also be used with Transformed Claims. The evaluation of these options (e.g., a constraint defined using `value`) is always performed based on the transformed value.

```json
{
  ...
  "id_token": {
    "given_name": null,
    "family_name": null,
    ":age_18_or_over": {
      "value": true,
      "essential": true
    }
  }
}
```

There is no requirement to use all defined Transformed Claims within a request.

### Combination with Selective Abort/Omit

Transformed Claims can be used together with Selective Abort/Omit. In this case,
transformed claims are evaluated before the SAO rules are applied. The SAO rules
are applied to the transformed value.

Example:

```json
{
  "id_token": {
    "given_name": null,
    "family_name": null,
    ":age_18_or_over": {
      "value": true
    }
  },
  "_asc": {
    "transformed_claims": {
      "age_18_or_over": {
        "claim": "birthdate",
        "fn": [
          "years_ago",
          [
            "gte",
            18
          ]
        ]
      }
    },
    "sao": {
      "id_token": [
        {
          "loc": "/:age_18_or_over",
          "method": "simple",
          "value": true,
          "else": "abort"
        }
      ]
    }
  }
}
```

## Data Types

Claims defined in [@!OpenID] and [@!IDA] have one of the data types 'string', 'boolean', 'number', 'JSON object' or 'array'. For the purpose of this specification, these data types are used as well as the new data type 'date', which applies to Claims representing dates, and 'datetime', which applies to Claims representing date and time. Therefore, `birthdate` is both of type `string` and `date`, and `updated_at` is both of type `number` and `datetime`.

Todo: Define input formats for date and datetime.

## Transformation Functions

In the following, a base set of transformation functions is defined. OPs supporting Transformed Claims shall support at least one transformation function.

In the following, the first function argument `Input` refers to the value of the
base Claim, or, if multiple functions are to be applied, the output of the
previous function. For other arguments, the RP defines a constant value in each
request. Optional arguments may be omitted.

This specification defines the following functions:

### Counting Years

Function signature: `years_ago(date|datetime Input, optional date ReferenceDate) -> number`

If only an input date or datetime is provided, returns the number of years elapsed since the given `Input` day, rounded down. With a `ReferenceDate`, returns the number of years elapsed between the `Input` date and the `ReferenceDate`.

Note: If the year of the `Input` date is `0000`, the resulting Claim shall be unavailable.

Note: When applied to an array of valid input values, returns an array with the function applied to each input value in order.

### Equality

Function signatures:

 * `eq(string Input, string Compare) -> boolean`
 * `eq(number Input, number Compare) -> boolean`
 * `eq(boolean Input, boolean Compare) -> boolean`
 * `eq(date|datetime Input, date|datetime Compare) -> boolean`

Return `true` if and only if `Input` equals `Output`. Return `false` otherwise. For comparisons between `date` and `datetime` values, the time of day is ignored unless `Input` and `Compare` are both of type `datetime`.

Additionally, the following functions for partial string matching are defined:

  * `contains(string Input, string Compare) -> boolean`
  * `starts_with(string Input, string Compare) -> boolean`
  * `ends_with(string Input, string Compare) -> boolean`

Return `true` if and only if `Input` contains, starts with, or ends with `Compare`. Return `false` otherwise.

### Number/Date/Datetime Comparison

Function signatures:

 * `gt(number Input, number Compare): -> boolean`
 * `gt(date|datetime Input, date|datetime Compare): -> boolean`
 * `lt(number Input, number Compare): -> boolean`
 * `lt(date|datetime Input, date|datetime Compare): -> boolean`
 * `gte(number Input, number Compare): -> boolean`
 * `gte(date|datetime Input, date|datetime Compare): -> boolean`
 * `lte(number Input, number Compare): -> boolean`
 * `lte(date|datetime Input, date|datetime Compare): -> boolean`

Evaluate whether `Input` is greather/less than (or equal to) the given
`Compare`. For comparisons between `date` and `datetime` values, the time of day
is ignored unless `Input` and `Compare` are both of type `datetime`.

Note: When applied to an array of valid input values, returns an array with the function applied to each input value in order.

### Hashing

Function signature: `hash(string Input, string HashAlgorithm) -> string`

Returns the hash of the UTF-8 representation of the input string, encoded as a
lowercase hex string. `HashAlgorithm` refers to the hash algorithm to be used,
with valid values being `sha-256` and `sha-512`.

Example: `hash('Jörg', 'sha-256')` produces the string
`8e63741c42f7c08025339f1a380d98030a698aa04f1fa3c595dcb581632af452`.

This function can be used together with the `eq` operator or a restriction
expressed using `value` or `values` to have the OP match a string against a
value without revealing the clear-text value to the OP.

It is important to note that the privacy advantage is generally limited,
especially when the input strings can be enumerated easily, as is common for
names, numbers and date/datetime values. A malicious OP could try to calculate
the hashes of all possible clear-text values and match the hashes against the
hash provided by the RP in order to reveal the original clear-text value.

### Array Evaluation

Function signatures:

 * `any(array of booleans Input) -> boolean`
 * `all(array of booleans Input) -> boolean`
 * `none(array of booleans Input) -> boolean`

Return `true` if and only if any, all, or none of the boolean values in the `Input` array are `true`. Return `false` otherwise.

### JSON Object Access

Function signature: `get(JSON object Input, string Key) -> *`

From the JSON object `Input`, return the member with key `Key`. If the respective key is not available in the JSON object, the resulting Claim shall be unavailable.

### Matching

Function signature: `match(string Input, string RegEx) -> boolean`

Return `true` if and only if the `RegEx` matches the `Input` string. The match
can be at any location within `Input` unless further constrained by `RegEx`. Return `false` otherwise.

Important: OPs implementing this function shall take precautions against 'catastrophic backtracking', i.e., regular expressions that are designed to exhaust the computing power of the OP. To this end, a reasonably brief time limit on the execution time for the regular expression matching operation shall be imposed, e.g., a few milliseconds. If the execution takes longer, the resulting Claim shall be unavailable.

TODO: Define Regex dialect to use. PCRE, PCRE2?


### Extending the Transformation Functions

Extensions of this specification may define further Transformation Functions.
New Transformation Functions defined outside official standards shall use the
prefix `x-` to avoid naming collisions with standardized Transformation
Functions.

TODO: Registry? Prefixing considered harmful?

All Transformation Functions shall follow the following conventions:

 * To avoid information leakage to the RP, a Transformation Function shall be designed such that it does not open a side-channel to other information stored at the OP. To this end, a Transformation Function shall only make use of information that is either
   * directly provided via the static function arguments,
   * can be derived from the `Input`, or
   * is available to the RP from other sources, e.g., public information like time and date.
 * The application of Transformation Functions shall have no side effects on other Claim values.
 * Transformation Functions shall be safe to execute for the OP for all combinations of inputs and arguments, as the requests generally come from an untrusted source. This includes security against Denial-of-Service attacks.


## Predefined Transformed Claims (PTC)

An OP supporting Transformed Claims shall publish the key `transformed_claims_functions_supported` containing an array of supported functions (only the function names) in its OP Metadata.

Example:

```json
...
  "transformed_claims_functions_supported": ["eq", "match", "years_ago"],
...
```

An RP can use the presence of this key to determine general support for Transformed Claims at the OP.

An OP may predefine Transformed Claims. This avoids repetitions in requests and enables RPs to use Transformed Claims without requiring specific software support.

To predefine a Transformed Claim, the OP publishes the key `transformed_claims_predefined` in its OP metadata. Its contents follow the same syntax as `transformed_claims` in the `claims` object:

```json
...
  "transformed_claims_predefined": {
    "age_18_or_over": {
      "claim": "birthdate",
      "fn": [
        "years_ago",
        [
          "gte",
          18
        ]
      ]
    },
    "age_21_or_over": {
      "claim": "birthdate",
      "fn": [
        "years_ago",
        [
          "gte",
          21
        ]
      ]
    }
  }
...
```

RPs may use PTCs in a request to the OP as if the respective Transformed Claims
were defined in `transformed_claims` in the request. However, two colons (`::`) are prepended to distinguish predefined from custom Transformed Claims:

```json
{
  "id_token": {
    "given_name": null,
    "family_name": null,
    "::age_18_or_over": {
      "value": true,
      "essential": true
    }
  }
}
```

An OP may further set the key `transformed_claims_max_count` to `0` to
denote that only PTCs can be used and custom Transformed Claims are not
supported.

Example:

```json
...
  "transformed_claims_functions_supported": ["years_ago", "gte"],
  "transformed_claims_max_count": 0,
  "transformed_claims_predefined": {
    "age_18_or_over": {
      "claim": "birthdate",
      "fn": [
        "years_ago",
        [
          "gte",
          18
        ]
      ]
    }
  },
...
```

## OP Metadata

The OP advertises its capabilities with respect to Transformed Claims in its openid-configuration (see [@!OpenID-Discovery]) using the following new elements:

`transformed_claims_functions_supported`: OPTIONAL. JSON array indicating support for Transformed Claims, and containing an array of the supported function names. When present this array must have at least one member.

`transformed_claims_predefined`: OPTIONAL. JSON object containing the definitions of all supported Predefined Transformed Claims following the same syntax as `transformed_claims` in the `claims` object. When present this object must contain at least one definition of a Predefined Transformed Claim. If this metadata value is omitted, the OP does not support Predefined Transformed Claims.

`transformed_claims_max_depth`: OPTIONAL. Integer value indicating the maximum number of functions in a chain of functions used to define a transformed claim. If this metadata value is omitted, the OP MUST support chains of functions of any length.

`transformed_claims_max_count`: OPTIONAL. Integer value indicating the maximum number of transformed claims an RP can define, excluding any Predefined Transformed Claims. If this is set to `0`, the RP may only use Predefined Transformed Claims.  If this metadata value is omitted, the OP MUST support any number of transformed claims.

## Error Conditions
The following error conditions MUST be checked by an OP, in this order:

 1. If the definition of a transformed claim provided by an RP uses more than `transformed_claims_max_depth` function applications or the number of custom transformed claims exceeds `transformed_claims_max_count`, the OP MUST abort the transaction with an `invalid_request` error. The `error_description` provided by the OP SHOULD indicate the location and nature of the error.
 2. If an RP uses, in a definition for a transformed claim, a function not supported by the OP and therefore not listed in `transformed_claims_functions_supported`, or the wrong number of arguments, or a wrong type of argument, the OP MUST abort the transaction with an `invalid_request` error. The `error_description` provided by the OP SHOULD indicate the location and nature of the error.
 3. Each transformed claim is based on a single base claim, as expressed by the `claim` key in the definition of the transformed claim. In case this base claim is not known to the OP, or data is not available for this claim, or similar conditions, the transformed claim MUST be treated the same as the base claim. For example, if the base claim is unknown to the OP, the transformed claim is handled as if it were an unknown claim as well. If an End-User choses not to release the base claim, or the base claim is not released to the RP for some other reason, the transformed claim MUST NOT be released as well.

In general, if an RP references an undefined transformed claim in the `claims` parameter, the claim MUST be treated like a claim unknown to the OP.

## UX and Privacy Considerations

The consent of the End-User is typically required before data can be released by the OP to the RP. An OP cannot be expected to automatically parse and understand all potential combinations of transformation functions and their arguments in order to create a detailed consent prompt for the End-User.

OPs can use a number of strategies to ensure that End-User consent is always given in a meaningful way and to provide a good user experience (UX):

 * Simple cases, for example the combination of `years_ago` and `gte(x)` applied
   to `birthdate` shown above, can be translated into a statement like "The RP
   wants to know that you are above age `x`". OPs can prepare a number of
   patterns to match against the RP's request for common use cases in their
   ecosystem.
 * Since PTCs are predefined by the OP, the OP shall be able to provide a
   meaningful consent text for all its PTCs.
 * In all other cases, the OP can ask the End-User for
   their consent to release the full information of the base Claim, e.g., to ask
   for the consent to release the birthdate instead of verification of age. This is a safe overapproximation due to the guidelines for transformation functions described above.

## Compatibility Considerations

An OP not supporting Transformed Claims will ignore the additional element in the `claims` parameter as defined in Section 5.5 of [@!OpenID]. All Transformed Claims requested by RPs are therefore unknown to the OP and treated like other unknown claims, i.e., they will typically be ignored.

## Examples

The following example shows two custom Transformed Claims being defined and used. Note: Features from Selective Abort/Omit defined above are used as well.


<{{asc/examples/request/asc_tc_partial_matching.json}}


# Security Considerations {#Security}


## Integrity Protection of the Authentication Request
For a secure operation of the mechanisms defined in this specification, it is important to protect the `claims` parameter against modifications. Otherwise, a malicious End-User or attacker could create situations where the RP receives misleading data.

Moreover, some features in this specification are particularly suited for use cases of OpenID Connect where the RP pays for data received. In such use cases, integrity protection of the `claims` parameter can be advised to avoid having the RP pay for data not requested.

As an example for a malicious modification, when an RP defines a transformed claim `:age_18_or_over` as shown above, an End-User that is only 12 years old could modify the definition of the Claim from

```
    "age_18_or_over": {
      "claim": "birthdate",
      "fn": [
        "years_ago",
        [
          "gte",
          18
        ]
      ]
    }
```

to

```
    "age_18_or_over": {
      "claim": "birthdate",
      "fn": [
        "years_ago",
        [
          "gte",
          12
        ]
      ]
    }
```

and pass the age verification check. When using Selective Abort/Omit, a user could create situations where a flow continues instead of being aborted due to a mismatch in the End-User's data.

Therefore, the following rules apply:

 * Authentication requests using features from Selective Abort/Omit SHOULD only be accepted by an OP if they are integrity-protected and authenticated.
 * Authentication requests using Transformed Claims MUST only be accepted by an OP if they are integrity-protected, unless `transformed_claims_max_count` is set to `0` in which case the OP MAY accept authentication requests without integrity protection and authentication. Since Predefined Transformed Claims are defined by the OP, integrity protection and authentication is not required for their use.

Integrity protection and authentication of authentication requests can be achieved in particular by

 * using Pushed Authorization Requests [@RFC9126] to send requests server-to-server with authentication of the RP, or
 * using JWT-Secured Authorization Requests [@RFC9101] to sign the authentication request parameters.

Using a suitable security profile for OpenID Connect that includes authentication and integrity protection for the authentication request is RECOMMENDED, as this helps to ensure that the protection cannot be circumvented.

## Safe Execution of Transformation Functions
OPs MUST ensure that all possible combinations of transformation functions and their respective arguments can be executed securely and without undesired side effects. In particular, for any function supported by the OP, the OP MUST ensure that time and memory limits apply to avoid Denial-of-Service Attacks. For many functions, for example, comparison functions, this is usually inherent to the function itself. For other functions, execution time and complexity limits SHOULD be considered. For example, when applying regular expressions, Regular Expression DoS attacks (ReDoS) are a concern.

OPs therefore MAY limit the range of valid input arguments and valid combinations of functions to ensure a secure operation.

OPs SHOULD consider setting `transformed_claims_max_depth` and `transformed_claims_max_count` to reasonable values to avoid Denial-of-Service attacks.



{backmatter}

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

<reference anchor="IDA" target="https://openid.net/specs/openid-connect-4-identity-assurance-1_0.html">
  <front>
    <title>OpenID Connect for Identity Assurance 1.0</title>
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
  </front>
</reference>

# IANA Considerations

TBD

# Acknowledgements {#Acknowledgements}

TBD

# Notices

Copyright (c) 2020 The OpenID Foundation.

The OpenID Foundation (OIDF) grants to any Contributor, developer, implementer, or other interested party a non-exclusive, royalty free, worldwide copyright license to reproduce, prepare derivative works from, distribute, perform and display, this Implementers Draft or Final Specification solely for the purposes of (i) developing specifications, and (ii) implementing Implementers Drafts and Final Specifications based on such documents, provided that attribution be made to the OIDF as the source of the material, but that such attribution does not indicate an endorsement by the OIDF.

The technology described in this specification was made available from contributions from various sources, including members of the OpenID Foundation and others. Although the OpenID Foundation has taken steps to help ensure that the technology is available for distribution, it takes no position regarding the validity or scope of any intellectual property or other rights that might be claimed to pertain to the implementation or use of the technology described in this specification or the extent to which any license under such rights might or might not be available; neither does it represent that it has made any independent effort to identify any such rights. The OpenID Foundation and the contributors to this specification make no (and hereby expressly disclaim any) warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to this specification, and the entire risk as to implementing this specification is assumed by the implementer. The OpenID Intellectual Property Rights policy requires contributors to offer a patent promise not to assert certain patent claims against other contributors and against implementers. The OpenID Foundation invites any interested party to bring to its attention any copyrights, patents, patent applications, or other proprietary rights that may cover technology that may be required to practice this specification.

# Document History

   [[ To be removed from the final specification ]]

   -00

   *  first version


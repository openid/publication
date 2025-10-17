# Trust Anchor Discovery Extension for OIDC Clients

## Overview

This project proposes an OpenID Connect Discovery extension that enables clients to proactively retrieve and validate TLS server certificates—referred to as *trust anchors*—prior to initiating secure sessions. This is especially useful in environments with short-lived certificates, zero-trust architectures, and machine-to-machine communication.

## Motivation

As TLS certificate lifetimes shrink (e.g., 90-day validity becoming standard), clients must adapt to more frequent trust anchor rotations. This extension allows OpenID Connect clients to discover and prefetch server certificates during the discovery phase using the Client Credentials Grant, enabling proactive trust establishment for mTLS or HTTPS sessions.

## Key Features

- Adds a `trust_anchor_uri` field to the OIDC Discovery document.
- Enables clients to fetch and validate server certificates before TLS handshakes.
- Supports caching and rotation of trust anchors.
- Compatible with existing OIDC Discovery and JWKS mechanisms.

## Repository Structure


```
trust-anchor-discovery-oidc/
├── spec.md                # The full Markdown spec (from our previous draft)
├── README.md              # Project overview and motivation
├── LICENSE                # Choose an open license (e.g., Apache 2.0 or MIT)
├── .well-known/
│   └── openid-configuration.json  # Sample discovery doc with trust_anchor_uri
├── trust/
│   └── certs.json         # Example trust anchor document
└── examples/
    └── client-fetch.py    # Optional: sample client script to fetch and parse anchors
```

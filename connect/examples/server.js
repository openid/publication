const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { X509Certificate, createHash } = require("crypto");
const { execSync } = require("child_process");

const app = express();
const PORT = 3443;

// --- Paths for security assets ---
const securityPath = path.join(__dirname, "lib", "security");

// --- Load server TLS cert and key ---
const serverKey = fs.readFileSync(path.join(securityPath, "server.key"));
const serverCertPem = fs.readFileSync(path.join(securityPath, "server.crt"));

const options = {
  key: serverKey,
  cert: serverCertPem
};

// --- Helper: build bundle from a PEM cert ---
function buildBundleFromPem(pem) {
  const cert = new X509Certificate(pem);
  const fingerprint = createHash("sha256")
    .update(cert.raw)
    .digest("hex")
    .toUpperCase()
    .match(/.{1,2}/g)
    .join(":");

  return {
    certificates: [
      {
        subject: cert.subject,
        issuer: cert.issuer,
        valid_from: cert.validFrom,
        valid_to: cert.validTo,
        fingerprint: `SHA256:${fingerprint}`,
        usage: "tls_server",
        pem: pem.toString()
      }
    ]
  };
}

// --- Bundle V1: same as server.crt ---
const certBundleV1 = buildBundleFromPem(serverCertPem);

// --- Auto-generate a rotated cert under lib/security ---
function generateSelfSignedCert(filename) {
  const pemPath = path.join(securityPath, filename + ".pem");
  const keyPath = path.join(securityPath, filename + ".key");

  /*
  execSync(
    `openssl req -x509 -newkey rsa:2048 -nodes -keyout ${keyPath} -out ${pemPath} -days 30 -subj "/CN=localhost"`
  );
*/
  execSync(
  `openssl req -x509 -newkey rsa:2048 -nodes \
   -keyout ${keyPath} -out ${pemPath} -days 30 \
   -subj "/CN=localhost" \
   -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"`
);


  return fs.readFileSync(pemPath);
}

const certV2Pem = generateSelfSignedCert("cert-v2");
const certBundleV2 = buildBundleFromPem(certV2Pem);

// --- Function to update trust-bundle.pem ---
function updateTrustBundle() {
  const bundlePath = path.join(securityPath, "trust-bundle.pem");
  fs.writeFileSync(bundlePath, serverCertPem + "\n" + certV2Pem);
  console.log(`Updated trust bundle at ${bundlePath}`);
}

// --- Rotation logic ---
let currentBundle = certBundleV1;
setInterval(() => {
  currentBundle = currentBundle === certBundleV1 ? certBundleV2 : certBundleV1;
  console.log("Rotated trust anchor bundle");
  updateTrustBundle();
}, 60000);

// --- OIDC discovery endpoint ---
app.get("/.well-known/openid-configuration", (req, res) => {
  res.json({
    issuer: `https://localhost:${PORT}`,
    token_endpoint: `https://localhost:${PORT}/token`,
    jwks_uri: `https://localhost:${PORT}/.well-known/jwks.json`,
    trust_anchor_uri: `https://localhost:${PORT}/trust/certs`,
    grant_types_supported: ["client_credentials"],
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"]
  });
});




// --- Mock token endpoint ---
app.post("/token", (req, res) => {
  res.json({
    access_token: "mock-access-token",
    token_type: "Bearer",
    expires_in: 3600
  });
});

// --- Trust anchor endpoint (rotating) ---
app.get("/trust/certs", (req, res) => {
  res.json(currentBundle);
});

// --- JWKS endpoint (stub) ---
app.get("/.well-known/jwks.json", (req, res) => {
  res.json({ keys: [] });
});

// --- Start HTTPS server ---
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Trust Anchor Service running at https://localhost:${PORT}`);
  updateTrustBundle(); // initialize bundle on startup
});

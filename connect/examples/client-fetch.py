import requests
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.x509.verification import PolicyBuilder, Store
from cryptography.x509 import DNSName, load_pem_x509_certificates
from datetime import datetime
import certifi

# Config
DISCOVERY_URL = "https://server.example.com/.well-known/openid-configuration"
CLIENT_ID = "your-client-id"
CLIENT_SECRET = "your-client-secret"
TOKEN_URL = "https://server.example.com/token"

# Step 1: Fetch discovery metadata
discovery = requests.get(DISCOVERY_URL).json()
trust_anchor_uri = discovery.get("trust_anchor_uri")
if not trust_anchor_uri:
    raise ValueError("trust_anchor_uri not found")

# Step 2: Get access token
token_response = requests.post(
    TOKEN_URL,
    data={"grant_type": "client_credentials"},
    auth=(CLIENT_ID, CLIENT_SECRET),
)
access_token = token_response.json()["access_token"]

# Step 3: Fetch trust anchors
headers = {"Authorization": f"Bearer {access_token}"}
trust_response = requests.get(trust_anchor_uri, headers=headers)
trust_anchors = trust_response.json()

# Step 4: Load trusted root CAs
with open(certifi.where(), "rb") as f:
    trusted_certs = load_pem_x509_certificates(f.read(), default_backend())
store = Store(trusted_certs)

# Step 5: Validate each certificate
for cert_entry in trust_anchors.get("certificates", []):
    print(f"Validating: {cert_entry['subject']}")
    try:
        pem_data = cert_entry["pem"].encode()
        cert = x509.load_pem_x509_certificate(pem_data, default_backend())

        builder = PolicyBuilder().store(store).time(datetime.utcnow())
        verifier = builder.build_server_verifier(DNSName("server.example.com"))
        chain = verifier.verify(cert, [])

        print("✅ Certificate is valid and trusted.")
    except Exception as e:
        print(f"❌ Validation failed: {e}")
    print("-" * 40)

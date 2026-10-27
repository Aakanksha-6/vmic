const selfsigned = require("selfsigned");
const fs = require("fs");
const path = require("path");
const os = require("os");

/** Auto-detect all current LAN IPv4 addresses from network interfaces */
function detectLanIps() {
  const interfaces = os.networkInterfaces();
  const ips = new Set(["127.0.0.1", "0.0.0.0"]);

  for (const iface of Object.values(interfaces)) {
    for (const addr of iface) {
      if (addr.family === "IPv4") {
        ips.add(addr.address);
      }
    }
  }

  return [...ips];
}

async function generateCerts() {
  const certDir = path.join(__dirname, "../certificates");
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  const detectedIps = detectLanIps();
  console.log("Detected IPs for certificate:", detectedIps);

  const attrs = [{ name: "commonName", value: "VMIC Local Server" }];

  const options = {
    notAfterDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    extensions: [
      { name: "basicConstraints", cA: false, critical: true },
      {
        name: "keyUsage",
        digitalSignature: true,
        keyEncipherment: true,
        critical: true,
      },
      { name: "extKeyUsage", serverAuth: true, clientAuth: true },
      {
        name: "subjectAltName",
        altNames: [
          { type: 2, value: "localhost" },
          ...detectedIps.map((ip) => ({ type: 7, ip })),
        ],
      },
    ],
  };

  console.log("Generating VMIC self-signed SSL certificates...");
  const pkey = await selfsigned.generate(attrs, options);

  fs.writeFileSync(path.join(certDir, "server.key"), pkey.private);
  fs.writeFileSync(path.join(certDir, "server.crt"), pkey.cert);

  console.log(`SSL Certificates generated for ${detectedIps.length} IPs — saved to frontend/certificates/`);
}

generateCerts().catch(console.error);

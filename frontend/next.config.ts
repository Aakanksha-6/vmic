import type { NextConfig } from "next";
import os from "os";

/** Auto-detect all current LAN IPv4 addresses at server startup */
function detectAllowedOrigins(): string[] {
  const origins = new Set(["localhost", "127.0.0.1"]);
  const interfaces = os.networkInterfaces();

  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const addr of iface) {
      if (addr.family === "IPv4") {
        origins.add(addr.address);
      }
    }
  }

  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: detectAllowedOrigins(),
};

export default nextConfig;

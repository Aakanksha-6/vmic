import { NextResponse } from "next/server";
import os from "os";

/**
 * GET /api/local-ip
 * Returns the current machine's LAN IPv4 addresses detected at request time.
 * This ensures the QR code and join URL always reflect the active network.
 */
export function GET() {
  const interfaces = os.networkInterfaces();
  const lanIps: string[] = [];

  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const addr of iface) {
      if (
        addr.family === "IPv4" &&
        !addr.internal &&
        (addr.address.startsWith("10.") ||
          addr.address.startsWith("192.168.") ||
          addr.address.startsWith("172."))
      ) {
        lanIps.push(addr.address);
      }
    }
  }

  const primary = lanIps[0] ?? "127.0.0.1";

  return NextResponse.json({ primary, all: lanIps });
}


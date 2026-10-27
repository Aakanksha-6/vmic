/**
 * VMIC Network Configuration
 *
 * IPs are detected dynamically at runtime via /api/local-ip.
 * No hardcoded IPs needed — works on any Wi-Fi or hotspot.
 */

export const KNOWN_LAN_IPS: string[] = [];

let _cachedLanIp: string | null = null;

/** Fetches all available LAN IPs from the server-side API. */
export async function fetchAvailableLanIps(): Promise<string[]> {
  try {
    const res = await fetch("/api/local-ip");
    const data = await res.json();
    if (Array.isArray(data.all) && data.all.length > 0) {
      return data.all;
    }
    return [data.primary || "127.0.0.1"];
  } catch {
    return ["127.0.0.1"];
  }
}

/** Fetches the current machine's LAN IP from the server-side API. */
export async function fetchLanIp(): Promise<string> {
  if (_cachedLanIp) return _cachedLanIp;

  try {
    const res = await fetch("/api/local-ip");
    const data = await res.json();
    _cachedLanIp = data.primary as string;
    return _cachedLanIp;
  } catch {
    return "127.0.0.1";
  }
}

/** Clears the cached IP (call when network changes). */
export function clearIpCache(): void {
  _cachedLanIp = null;
}

export function getSelectedLanIp(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("vmic-selected-ip");
    if (saved) return saved;

    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return hostname;
    }
  }

  return _cachedLanIp ?? "127.0.0.1";
}

export function setSelectedLanIp(ip: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("vmic-selected-ip", ip);
    _cachedLanIp = ip;
  }
}

/**
 * The backend uses HTTPS so mobile browsers can call it from the secure frontend.
 */
export function getBackendUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return `https://${hostname}:8001`;
  }
  return `https://${getSelectedLanIp()}:8001`;
}

export function getFrontendUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const port = window.location.port || "3000";
    const protocol = window.location.protocol;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${getSelectedLanIp()}:${port}`;
    }

    return `${protocol}//${hostname}:${port}`;
  }
  return `https://${getSelectedLanIp()}:3000`;
}


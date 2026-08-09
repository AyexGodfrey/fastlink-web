"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const SESSION_KEY = "amg-analytics-session";

function sessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

function sendToGa(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params || {});
}

async function sendToAmgims(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  const payload = {
    eventName,
    path: window.location.pathname,
    locale: window.location.pathname.split("/")[1] || undefined,
    sessionId: sessionId(),
    referrer: document.referrer || undefined,
    props: params || undefined,
  };
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
      return;
    }
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Analytics must never break UX
  }
}

/** Fire a named interaction to GA4 and AMGIMS. */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  sendToGa(eventName, params);
  void sendToAmgims(eventName, params);
}

export function trackPageView(path: string) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
  void sendToAmgims("page_view", {
    page_path: path,
    page_title:
      typeof document !== "undefined" ? document.title : undefined,
  });
}

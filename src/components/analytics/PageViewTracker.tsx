'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const VISITOR_KEY = 'tnc_vid';
const SESSION_KEY = 'tnc_sess';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const PAGEVIEW_URL = '/api/track/pageview';
const ENGAGEMENT_URL = '/api/track/engagement';

interface SessionState {
  id: string;
  lastSeen: number;
}

// In-memory fallbacks for when localStorage is unavailable (private mode, blocked storage).
let memVisitorId: string | null = null;
let memSession: SessionState | null = null;

function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to the Math.random based generator
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable - the in-memory fallback is used
  }
}

/** Returns the visitor id and whether it was created just now. */
function getVisitor(): { id: string; isNew: boolean } {
  const stored = readStorage(VISITOR_KEY) || memVisitorId;
  if (stored) {
    memVisitorId = stored;
    return { id: stored, isNew: false };
  }
  const id = uuid();
  memVisitorId = id;
  writeStorage(VISITOR_KEY, id);
  return { id, isNew: true };
}

function readSession(): SessionState | null {
  try {
    const raw = readStorage(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SessionState> | null;
      if (parsed && typeof parsed.id === 'string' && typeof parsed.lastSeen === 'number') {
        return { id: parsed.id, lastSeen: parsed.lastSeen };
      }
    }
  } catch {
    // corrupted value - treat as missing
  }
  return memSession;
}

function touchSession(session: SessionState): void {
  session.lastSeen = Date.now();
  memSession = session;
  writeStorage(SESSION_KEY, JSON.stringify(session));
}

/** Returns the active session; starts a new one when missing or idle for more than 30 minutes. */
function getSession(): { session: SessionState; isNew: boolean } {
  const existing = readSession();
  if (existing && Date.now() - existing.lastSeen <= SESSION_TIMEOUT_MS) {
    return { session: existing, isNew: false };
  }
  return { session: { id: uuid(), lastSeen: Date.now() }, isNew: true };
}

function clean(value: string | null): string | null {
  if (!value) return null;
  const v = value.trim();
  return v ? v : null;
}

function trackingEnabled(): boolean {
  if (process.env.NODE_ENV !== 'production') return false;
  try {
    return !navigator.webdriver;
  } catch {
    return false;
  }
}

export default function PageViewTracker() {
  const pathname = usePathname();

  // Current page state lives in refs so the document-level listeners always see the latest values.
  const pageViewId = useRef<number | null>(null);
  const sessionId = useRef<string | null>(null);
  const visibleSince = useRef<number | null>(null);
  const accumulatedMs = useRef(0);
  // Incremented per page so a late pageview response never attaches to a newer page.
  const pageToken = useRef(0);
  // Set by the listener effect; lets the pathname effect flush the previous page on route change.
  const flushRef = useRef<(() => void) | null>(null);

  // Visibility / pagehide listeners: installed once for the lifetime of the component.
  useEffect(() => {
    if (!trackingEnabled()) return;

    const pauseTimer = () => {
      if (visibleSince.current !== null) {
        accumulatedMs.current += Date.now() - visibleSince.current;
        visibleSince.current = null;
      }
    };

    const flush = () => {
      try {
        const id = pageViewId.current;
        const sid = sessionId.current;
        if (id === null || !sid) return;
        const total =
          accumulatedMs.current + (visibleSince.current !== null ? Date.now() - visibleSince.current : 0);
        const durationMs = Math.round(total);
        if (durationMs <= 0) return;

        const sess = readSession();
        if (sess && sess.id === sid) touchSession(sess);

        const json = JSON.stringify({ id, sessionId: sid, durationMs });
        let sent = false;
        if (typeof navigator.sendBeacon === 'function') {
          sent = navigator.sendBeacon(ENGAGEMENT_URL, new Blob([json], { type: 'application/json' }));
        }
        if (!sent) {
          fetch(ENGAGEMENT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: json,
            keepalive: true,
          }).catch(() => undefined);
        }
      } catch {
        // tracking must never break the page
      }
    };

    const onVisibilityChange = () => {
      try {
        if (document.visibilityState === 'hidden') {
          pauseTimer();
          flush();
        } else if (visibleSince.current === null && pageViewId.current !== null) {
          visibleSince.current = Date.now();
        }
      } catch {
        // ignore
      }
    };

    const onPageHide = () => {
      try {
        pauseTimer();
        flush();
      } catch {
        // ignore
      }
    };

    flushRef.current = flush;

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      flushRef.current = null;
    };
  }, []);

  // One pageview per pathname change.
  useEffect(() => {
    if (!trackingEnabled()) return;
    if (!pathname || pathname.startsWith('/dashboard')) return;

    try {
      // Flush the previous page's engagement before starting a new page.
      if (pageViewId.current !== null && flushRef.current) flushRef.current();

      const token = ++pageToken.current;
      pageViewId.current = null;
      accumulatedMs.current = 0;
      visibleSince.current = document.visibilityState === 'hidden' ? null : Date.now();

      const visitor = getVisitor();
      const { session, isNew: isNewSession } = getSession();
      sessionId.current = session.id;
      touchSession(session);

      let referrer: string | null = null;
      let utmSource: string | null = null;
      let utmMedium: string | null = null;
      let utmCampaign: string | null = null;
      if (isNewSession) {
        referrer = clean(document.referrer);
        const params = new URLSearchParams(window.location.search);
        utmSource = clean(params.get('utm_source'));
        utmMedium = clean(params.get('utm_medium'));
        utmCampaign = clean(params.get('utm_campaign'));
      }

      let timezone: string | null = null;
      try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
      } catch {
        timezone = null;
      }

      const body = JSON.stringify({
        visitorId: visitor.id,
        sessionId: session.id,
        path: pathname,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        language: navigator.language || null,
        timezone,
        screenWidth: window.screen && window.screen.width ? Math.round(window.screen.width) : null,
        newVisitor: visitor.isNew,
        entry: isNewSession,
      });

      fetch(PAGEVIEW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      })
        .then((res) => (res.ok && res.status !== 204 ? res.json() : null))
        .then((data: { id?: number } | null) => {
          if (data && typeof data.id === 'number' && token === pageToken.current) {
            pageViewId.current = data.id;
          }
        })
        .catch(() => undefined);
    } catch {
      // tracking must never break the page
    }
  }, [pathname]);

  return null;
}

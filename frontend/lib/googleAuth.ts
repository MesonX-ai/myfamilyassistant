/**
 * Client-side Google Sign-In helpers (Google Identity Services – GIS).
 *
 * Fully client-side "Sign in with Google" flow that works on a static export
 * (no Next.js server routes / no backend token exchange). GIS returns an
 * identity credential (a JWT ID token) directly in the browser, so no
 * client_secret is ever required.
 *
 * Requirement: a Google OAuth 2.0 client ID configured with an "Authorized
 * JavaScript origin" matching the deployed origin, exposed via
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID.
 */

/** Decoded Google ID token payload (OpenID claims). */
export interface GoogleUser {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
  picture?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (r: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, opts: object) => void;
        };
      };
    };
  }
}

const GSI_SRC = "https://accounts.google.com/gsi/client";
let scriptPromise: Promise<boolean> | null = null;

/** Lazily injects the GIS script, resolving once it is available. */
function loadGsi(): Promise<boolean> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.google?.accounts) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function initGoogleClient(): Promise<boolean> {
  return loadGsi();
}
/**
 * Renders the Google-branded "Sign in with Google" button into `parent`.
 * On success the decoded user + raw credential are passed to `onSignedIn`.
 * Returns false immediately if GIS failed to load.
 */
export async function renderGoogleButton(opts: {
  parent: HTMLElement;
  clientId: string;
  onSignedIn: (user: GoogleUser, credential: string) => void;
  onError: (message: string) => void;
}): Promise<boolean> {
  const { parent, clientId, onSignedIn, onError } = opts;
  const loaded = await initGoogleClient();
  const accounts = window.google?.accounts;
  if (!loaded || !accounts) {
    onError("Google Identity Services could not be loaded.");
    return false;
  }

  accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      try {
        onSignedIn(decodeToken(response.credential), response.credential);
      } catch (err) {
        onError(
          err instanceof Error ? err.message : "Google sign-in returned an invalid response."
        );
      }
    },
  });

  accounts.id.renderButton(parent, {
    theme: "outline",
    size: "large",
    width: Math.max(parent.clientWidth || 0, 300),
  });
  return true;
}

/** Decodes a Google-signed JWT ID token's payload (browser-safe). */
function decodeToken(credential: string): GoogleUser {
  const parts = credential.split(".");
  if (parts.length !== 3) {
    throw new Error("Received an invalid Google credential.");
  }
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  const payload = JSON.parse(json) as GoogleUser & { email_verified?: string | boolean };
  if (!payload.sub || !payload.email) {
    throw new Error("Google credential is missing the expected identity claims.");
  }
  return {
    sub: payload.sub,
    name: payload.name,
    email: payload.email,
    email_verified:
      String(payload.email_verified) === "true" ||
      payload.email_verified === true,
    picture: payload.picture,
  };
}
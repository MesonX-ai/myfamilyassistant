"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { renderGoogleButton, type GoogleUser } from "@/lib/googleAuth";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const AUTH_KEY = "myfa-auth";

interface AuthSession {
  user: GoogleUser;
  provider: "google";
  signedInAt: number;
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current || session) return;

    let cancelled = false;
    setStatus("loading");

    renderGoogleButton({
      parent: googleButtonRef.current,
      clientId: GOOGLE_CLIENT_ID,
      onSignedIn: (user, credential) => {
        const next: AuthSession = {
          user,
          provider: "google",
          signedInAt: Date.now(),
        };
        try {
          localStorage.setItem(AUTH_KEY, JSON.stringify(next));
          // Keep the raw token for possible future server-side verification.
          localStorage.setItem(`${AUTH_KEY}:google:credential`, credential);
        } catch {
          // storage unavailable—still reflect the in-memory session
        }
        if (!cancelled) {
          setSession(next);
          setStatus("idle");
          setError(null);
        }
      },
      onError: (message) => {
        if (!cancelled) {
          setStatus("idle");
          setError(message);
        }
      },
    }).then((ok) => {
      if (!cancelled && ok) setStatus("idle");
    });

    return () => {
      cancelled = true;
    };
  }, [session]);

  const signOut = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(`${AUTH_KEY}:google:credential`);
    } catch {
      // ignore
    }
    setSession(null);
    setStatus("idle");
    setError(null);
return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "40px 32px",
          backdropFilter: "blur(14px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            {session ? "You're signed in" : "Welcome back"}
          </h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            {session
              ? "Your workflows stay connected to your account"
              : "Sign in to save and access your workflows"}
          </p>
        </div>

        {session ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 16,
                borderRadius: 14,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                marginBottom: 20,
              }}
            >
              {session.user.picture && (
                <img
                  src={session.user.picture}
                  alt=""
                  width={48}
                  height={48}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  {session.user.name || "Google user"}
                </div>
                <div
                  style={{
                    color: "var(--muted)",
                    fontSize: 14,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {session.user.email}
                </div>
              </div>
            </div>
            <button onClick={signOut} className="btn btn-ghost" style={{ width: "100%" }}>
              Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div ref={googleButtonRef} style={{ minHeight: 40 }} />
            {status === "loading" && GOOGLE_CLIENT_ID && (
              <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center" }}>
                Loading Google sign-in…
              </p>
            )}

            {!GOOGLE_CLIENT_ID && (
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Google sign-in is not configured yet. Add{" "}
                <code style={{ color: "var(--cyan)" }}>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>{" "}
                to your frontend environment variables and redeploy.
              </p>
            )}

            {error && (
              <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", margin: 0 }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--muted)" }}>
              <span style={{ height: 1, flex: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 12 }}>or</span>
              <span style={{ height: 1, flex: 1, background: "var(--border)" }} />
            </div>

            {/* GitHub omitted: OAuth Apps require a server-side client_secret at
                token-exchange time, which a static export cannot hold securely. */}
            <button
              type="button"
              className="btn btn-ghost"
              aria-disabled
              disabled
              style={{ width: "100%", opacity: 0.5, cursor: "not-allowed" }}
              title="GitHub sign-in requires a backend service and is not available on this static deployment."
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.15-.02-2.08-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.98 0 1.96.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.67.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
              Sign in with GitHub
            </button>
            <p style={{ color: "var(--muted)", fontSize: 12, textAlign: "center", margin: 0 }}>
              GitHub sign-in is coming soon — it needs a server-side OAuth provider.
            </p>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/" style={{ color: "var(--cyan)", fontSize: 14, fontWeight: 500 }}>
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
  };
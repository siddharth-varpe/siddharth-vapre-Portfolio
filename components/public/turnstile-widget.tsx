"use client";

import * as React from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          theme?: "dark" | "light" | "auto";
          callback?: (token: string) => void;
          "error-callback"?: (error: unknown) => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export function TurnstileWidget({
  siteKey,
  onVerify,
  onError,
  onExpire,
  className = "",
}: TurnstileWidgetProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!siteKey || siteKey.trim() === "") {
      setLoadError("Cloudflare Turnstile site key is not configured.");
      if (onError) onError();
      return;
    }

    let isMounted = true;

    function initWidget() {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup error
        }
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          callback: (token: string) => {
            if (isMounted) {
              setLoadError(null);
              onVerify(token);
            }
          },
          "error-callback": (err: unknown) => {
            console.warn("[Turnstile Widget Error]:", err);
            if (isMounted) {
              setLoadError("Verification challenge encountered an error. Please try again.");
              if (onError) onError();
            }
          },
          "expired-callback": () => {
            if (isMounted) {
              if (onExpire) onExpire();
            }
          },
        });
        widgetIdRef.current = id;
        setIsLoaded(true);
      } catch (e) {
        console.error("[Turnstile render error]:", e);
        if (isMounted) {
          setLoadError("Unable to render Cloudflare Turnstile widget.");
          if (onError) onError();
        }
      }
    }

    if (window.turnstile) {
      initWidget();
    } else {
      const existingScript = document.querySelector('script[src*="turnstile/v0/api.js"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) initWidget();
        };
        script.onerror = () => {
          console.warn("[Turnstile script error]: Could not load Cloudflare Turnstile script.");
          if (isMounted) {
            setLoadError("Failed to load Cloudflare security verification. Please check network/ad-blockers.");
            if (onError) onError();
          }
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", initWidget);
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey, onVerify, onError, onExpire]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-foreground-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        <span>ANTI-BOT VERIFICATION // CLOUDFLARE TURNSTILE</span>
      </div>

      {loadError ? (
        <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded px-3 py-2">
          {loadError}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="min-h-[65px] flex items-center justify-start rounded-md overflow-hidden"
        >
          {!isLoaded && (
            <div className="flex items-center gap-2 text-xs text-foreground-muted py-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
              <span>Initializing anti-bot challenge...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

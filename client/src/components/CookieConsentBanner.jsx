"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nkem_cookie_consent";

const CATEGORIES = [
  {
    key: "essential",
    label: "Essential",
    description: "Required for website security, session handling, and core functionality.",
    locked: true,
  },
  {
    key: "functional",
    label: "Functional",
    description: "Enables optional website features such as embedded content, forms, and chat.",
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Used for advertising, campaign measurement, and remarketing.",
  },
];

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({ essential: true, functional: true, marketing: true });

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private browsing, etc.) — skip persisting, don't block the page.
    }
  }, []);

  function save(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    } catch {
      // ignore — see above
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background p-4 shadow-lg sm:p-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-muted-foreground">
          We use cookies to run this site and, if you allow it, to improve your experience.
        </p>

        {expanded && (
          <div className="mt-4 space-y-3">
            {CATEGORIES.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-brand-navy-dark">{c.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs[c.key]}
                  disabled={c.locked}
                  onClick={() => setPrefs((p) => ({ ...p, [c.key]: !p[c.key] }))}
                  className={`mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
                    prefs[c.key] ? "bg-brand-blue" : "bg-brand-gray-light"
                  } ${c.locked ? "opacity-60" : ""}`}
                >
                  <span
                    className={`block size-5 translate-x-0.5 rounded-full bg-white transition-transform ${
                      prefs[c.key] ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => save({ essential: true, functional: true, marketing: true })}
            className="flex-1 rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-dark"
          >
            Accept All
          </button>
          {expanded ? (
            <button
              type="button"
              onClick={() => save(prefs)}
              className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-navy-dark hover:bg-brand-gray-light"
            >
              Save Settings
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-navy-dark hover:bg-brand-gray-light"
            >
              Customize
            </button>
          )}
          <button
            type="button"
            onClick={() => save({ essential: true, functional: false, marketing: false })}
            className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-navy-dark hover:bg-brand-gray-light"
          >
            Deny All
          </button>
        </div>
      </div>
    </div>
  );
}

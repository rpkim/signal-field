"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  detectLocale,
  LOCALE_COOKIE,
  LOCALE_STORAGE,
  t as translate,
  type Locale,
  type MessageKey,
} from "./messages";

type Ctx = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

function readStored(): Locale | null {
  try {
    const fromStore = localStorage.getItem(LOCALE_STORAGE);
    if (fromStore === "ko" || fromStore === "en") return fromStore;
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|; )sf-locale=(ko|en)/);
    if (m) return m[1] as Locale;
  }
  return null;
}

function persist(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE, locale);
  } catch {
    /* ignore */
  }
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStored();
    const next = stored ?? detectLocale();
    setLocaleState(next);
    persist(next);
    document.documentElement.lang = next;
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persist(next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>
      <div data-locale={locale} data-locale-ready={ready ? "1" : "0"}>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

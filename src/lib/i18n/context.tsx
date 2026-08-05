"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, LOCALES, translations, type Locale, type Translation } from "./translations";

const STORAGE_KEY = "leaax-locale";
const LOCALE_CHANGE_EVENT = "leaax-locale-change";

function readStoredLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && LOCALES.includes(stored as Locale) ? (stored as Locale) : DEFAULT_LOCALE;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function subscribe(callback: () => void) {
  window.addEventListener(LOCALE_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LOCALE_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

interface LanguageContextValue {
  locale: Locale;
  t: Translation;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // English is the default for everyone, per spec — the server snapshot
  // (used during SSR and initial hydration) is always DEFAULT_LOCALE, and
  // we only ever sync away from it once mounted in the browser, via the
  // stored preference from a previous explicit switch.
  const locale = useSyncExternalStore(subscribe, readStoredLocale, getServerSnapshot);

  const setLocale = (next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  };

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, t: translations[locale], setLocale }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

export type Locale = "en" | "de";

export const LOCALES: Locale[] = ["en", "de"];
export const DEFAULT_LOCALE: Locale = "en";

export interface Translation {
  brand: string;
  tagline: string;
  hero: {
    title: string;
    subtitle: string;
  };
  form: {
    label: string;
    placeholder: string;
    submit: string;
    submitLoading: string;
    hint: string;
  };
  providers: {
    heading: string;
    note: string;
  };
  result: {
    heading: string;
    red: { title: string; body: string };
    yellow: { title: string; body: string };
    green: { title: string; body: string };
    hitsFound: string;
    foundVia: string;
    noContentShown: string;
    checkAnother: string;
  };
  errors: {
    too_short: string;
    too_long: string;
    invalid: string;
    rate_limited: string;
    provider_not_configured: string;
    internal_error: string;
  };
  privacy: {
    title: string;
    body: string;
  };
  footer: {
    text: string;
    poweredBy: string;
  };
  language: {
    en: string;
    de: string;
  };
  legal: {
    navLabel: string;
    imprint: string;
    privacy: string;
    terms: string;
    placeholderBanner: string;
    backHome: string;
  };
}

export const translations: Record<Locale, Translation> = {
  en: {
    brand: "Leaax",
    tagline: "Find out where your [li:ks] are",
    hero: {
      title: "Is your name exposed in a public AI chat?",
      subtitle:
        "Shared AI chat logs sometimes end up publicly visible in search engines. Check in under a minute, free, nothing is stored.",
    },
    form: {
      label: "Name or company",
      placeholder: "e.g. Jane Doe or Acme GmbH",
      submit: "Start check",
      submitLoading: "Checking…",
      hint: "We only use this to search — it is never saved.",
    },
    providers: {
      heading: "We check public share links from",
      note: "Only providers with a real, search-engine-indexed public share feature are included. Private/agent tools without a public share link (e.g. OpenClaw, MyClaw) are out of scope, since that leak pattern doesn't exist there.",
    },
    result: {
      heading: "Your result",
      red: {
        title: "We found a likely match",
        body: "One or more public AI chat share links appear to be linked to what you entered. Consider having them taken down.",
      },
      yellow: {
        title: "We found something unclear",
        body: "There are results that might be related, but we're not fully sure. Worth a closer look.",
      },
      green: {
        title: "Nothing found",
        body: "We didn't find any public AI chat share link connected to what you entered right now.",
      },
      hitsFound: "matches found",
      foundVia: "found via",
      noContentShown: "For your privacy, we never display full chat contents — only a masked reference.",
      checkAnother: "Check another name",
    },
    errors: {
      too_short: "Please enter at least 2 characters.",
      too_long: "Please enter at most 120 characters.",
      invalid: "This input doesn't look valid — please try again.",
      rate_limited: "Too many checks from your connection. Please try again in a moment.",
      provider_not_configured: "The check service isn't fully set up yet. Please try again later.",
      internal_error: "Something went wrong on our side. Please try again.",
    },
    privacy: {
      title: "Your privacy",
      body: "What you type here is only held in memory for the duration of this one check and is discarded immediately after — we never store your search term or the results.",
    },
    footer: {
      text: "Leaax is an independent security check. Not affiliated with OpenAI, Anthropic, Google, xAI, or DeepSeek.",
      poweredBy: "Search powered by Brave Search API.",
    },
    language: { en: "English", de: "Deutsch" },
    legal: {
      navLabel: "Legal",
      imprint: "Imprint",
      privacy: "Privacy Policy",
      terms: "Terms",
      placeholderBanner: "[PLACEHOLDER — content coming soon]",
      backHome: "Back to home",
    },
  },
  de: {
    brand: "Leaax",
    tagline: "Finde heraus, wo deine [li:ks] sind",
    hero: {
      title: "Ist dein Name in einem öffentlichen KI-Chat sichtbar?",
      subtitle:
        "Geteilte KI-Chat-Verläufe landen manchmal öffentlich sichtbar in Suchmaschinen. Prüfe es in unter einer Minute, kostenlos, ohne Speicherung.",
    },
    form: {
      label: "Name oder Firma",
      placeholder: "z. B. Erika Mustermann oder Muster GmbH",
      submit: "Check starten",
      submitLoading: "Wird geprüft…",
      hint: "Wir nutzen das nur für die Suche — es wird nie gespeichert.",
    },
    providers: {
      heading: "Wir prüfen öffentliche Freigabelinks von",
      note: "Nur Anbieter mit einer echten, von Suchmaschinen indexierten öffentlichen Freigabefunktion sind enthalten. Private Agenten-Tools ohne öffentliche Freigabelinks (z. B. OpenClaw, MyClaw) sind bewusst ausgeschlossen, da dieses Leck-Muster dort nicht existiert.",
    },
    result: {
      heading: "Dein Ergebnis",
      red: {
        title: "Wir haben einen wahrscheinlichen Treffer gefunden",
        body: "Ein oder mehrere öffentliche KI-Chat-Freigabelinks scheinen mit deiner Eingabe verbunden zu sein. Eine Löschung sollte in Betracht gezogen werden.",
      },
      yellow: {
        title: "Wir haben etwas Unklares gefunden",
        body: "Es gibt Ergebnisse, die damit zusammenhängen könnten, wir sind uns aber nicht ganz sicher. Ein genauerer Blick lohnt sich.",
      },
      green: {
        title: "Nichts gefunden",
        body: "Wir konnten aktuell keinen öffentlichen KI-Chat-Freigabelink finden, der mit deiner Eingabe verbunden ist.",
      },
      hitsFound: "Treffer gefunden",
      foundVia: "gefunden über",
      noContentShown: "Zu deinem Schutz zeigen wir nie vollständige Chat-Inhalte an — nur einen maskierten Hinweis.",
      checkAnother: "Weiteren Namen prüfen",
    },
    errors: {
      too_short: "Bitte gib mindestens 2 Zeichen ein.",
      too_long: "Bitte gib höchstens 120 Zeichen ein.",
      invalid: "Diese Eingabe scheint ungültig zu sein — bitte versuche es erneut.",
      rate_limited: "Zu viele Prüfungen von deiner Verbindung. Bitte versuche es gleich noch einmal.",
      provider_not_configured: "Der Prüfdienst ist noch nicht vollständig eingerichtet. Bitte versuche es später erneut.",
      internal_error: "Auf unserer Seite ist etwas schiefgelaufen. Bitte versuche es erneut.",
    },
    privacy: {
      title: "Deine Privatsphäre",
      body: "Deine Eingabe wird nur für die Dauer dieser einen Prüfung im Arbeitsspeicher gehalten und danach sofort verworfen — wir speichern weder deinen Suchbegriff noch die Ergebnisse.",
    },
    footer: {
      text: "Leaax ist ein unabhängiges Sicherheits-Tool. Nicht verbunden mit OpenAI, Anthropic, Google, xAI oder DeepSeek.",
      poweredBy: "Suche unterstützt durch die Brave Search API.",
    },
    language: { en: "English", de: "Deutsch" },
    legal: {
      navLabel: "Rechtliches",
      imprint: "Impressum",
      privacy: "Datenschutz",
      terms: "AGB",
      placeholderBanner: "[PLATZHALTER — Inhalt folgt]",
      backHome: "Zurück zur Startseite",
    },
  },
};

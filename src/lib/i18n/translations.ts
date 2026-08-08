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
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    submitLoading: string;
    hint: string;
  };
  providers: {
    heading: string;
    note: string;
    emailNote: string;
  };
  result: {
    overall: {
      red: { title: string; body: string };
      yellow: { title: string; body: string };
      green: { title: string; body: string };
    };
    statusWord: { red: string; yellow: string; green: string };
    checks: {
      name: { label: string };
      email: { label: string };
    };
    hitsFound: string;
    foundVia: string;
    foundInBreach: string;
    noContentShown: string;
    whatToDoNow: string;
    checkAnother: string;
  };
  errors: {
    too_short: string;
    too_long: string;
    invalid: string;
    rate_limited: string;
    provider_not_configured: string;
    internal_error: string;
    at_least_one_required: string;
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
      title: "Is your data publicly exposed?",
      subtitle:
        "Public AI chat shares and email data breaches can expose you without you knowing. Check either or both in under a minute, free, nothing is stored.",
    },
    form: {
      nameLabel: "Name or company",
      namePlaceholder: "e.g. Jane Doe or Acme Inc.",
      emailLabel: "Email address",
      emailPlaceholder: "e.g. jane@example.com",
      submit: "Start check",
      submitLoading: "Checking…",
      hint: "We only use this to search — it is never saved.",
    },
    providers: {
      heading: "We check public share links from",
      note: "Only providers with a real, search-engine-indexed public share feature are included. Private/agent tools without a public share link (e.g. OpenClaw, MyClaw) are out of scope, since that leak pattern doesn't exist there.",
      emailNote: "Email data breaches are checked against XposedOrNot's public breach database.",
    },
    result: {
      overall: {
        red: {
          title: "We found something you should look at",
          body: "At least one of the checks below found a match. See the breakdown for details.",
        },
        yellow: {
          title: "We found something unclear",
          body: "At least one of the checks below found something that might be related, but we're not fully sure. See the breakdown for details.",
        },
        green: {
          title: "Nothing found",
          body: "We didn't find anything in the checks you ran.",
        },
      },
      statusWord: { red: "Red", yellow: "Yellow", green: "Green" },
      checks: {
        name: { label: "AI chat history" },
        email: { label: "Email data breaches" },
      },
      hitsFound: "matches found",
      foundVia: "found via",
      foundInBreach: "found in breach",
      noContentShown: "For your privacy, we never display full contents — only a masked reference.",
      whatToDoNow: "What to do now?",
      checkAnother: "Check again",
    },
    errors: {
      too_short: "Please enter at least 2 characters.",
      too_long: "Please enter at most 120 characters.",
      invalid: "This input doesn't look valid — please try again.",
      rate_limited: "Too many checks from your connection. Please try again in a moment.",
      provider_not_configured: "The check service isn't fully set up yet. Please try again later.",
      internal_error: "Something went wrong on our side. Please try again.",
      at_least_one_required: "Please enter a name/company or an email address.",
    },
    privacy: {
      title: "Your privacy",
      body: "What you type here is only held in memory for the duration of this one check and is discarded immediately after — we never store your search term, email address, or the results.",
    },
    footer: {
      text: "Leaax is an independent security check. Not affiliated with OpenAI, Anthropic, Google, xAI, DeepSeek, or XposedOrNot.",
      poweredBy: "AI-chat search powered by Brave Search API. Breach data powered by XposedOrNot.",
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
      title: "Sind deine Daten öffentlich sichtbar?",
      subtitle:
        "Öffentliche KI-Chat-Freigaben und E-Mail-Datenlecks können dich offenlegen, ohne dass du es merkst. Prüfe eins oder beides in unter einer Minute, kostenlos, ohne Speicherung.",
    },
    form: {
      nameLabel: "Name oder Firma",
      namePlaceholder: "z. B. Erika Mustermann oder Muster GmbH",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "z. B. erika@beispiel.de",
      submit: "Check starten",
      submitLoading: "Wird geprüft…",
      hint: "Wir nutzen das nur für die Suche — es wird nie gespeichert.",
    },
    providers: {
      heading: "Wir prüfen öffentliche Freigabelinks von",
      note: "Nur Anbieter mit einer echten, von Suchmaschinen indexierten öffentlichen Freigabefunktion sind enthalten. Private Agenten-Tools ohne öffentliche Freigabelinks (z. B. OpenClaw, MyClaw) sind bewusst ausgeschlossen, da dieses Leck-Muster dort nicht existiert.",
      emailNote: "E-Mail-Datenlecks werden gegen die öffentliche Datenleck-Datenbank von XposedOrNot geprüft.",
    },
    result: {
      overall: {
        red: {
          title: "Wir haben etwas gefunden, das du dir ansehen solltest",
          body: "Mindestens eine der Prüfungen unten hat einen Treffer ergeben. Details siehe Aufschlüsselung.",
        },
        yellow: {
          title: "Wir haben etwas Unklares gefunden",
          body: "Mindestens eine der Prüfungen unten hat etwas potenziell Zusammenhängendes gefunden, wir sind uns aber nicht ganz sicher. Details siehe Aufschlüsselung.",
        },
        green: {
          title: "Nichts gefunden",
          body: "Wir konnten bei den durchgeführten Prüfungen nichts finden.",
        },
      },
      statusWord: { red: "Rot", yellow: "Gelb", green: "Grün" },
      checks: {
        name: { label: "KI-Chat-Verläufe" },
        email: { label: "E-Mail-Datenlecks" },
      },
      hitsFound: "Treffer gefunden",
      foundVia: "gefunden über",
      foundInBreach: "gefunden in Datenleck",
      noContentShown: "Zu deinem Schutz zeigen wir nie vollständige Inhalte an — nur einen maskierten Hinweis.",
      whatToDoNow: "Was jetzt tun?",
      checkAnother: "Erneut prüfen",
    },
    errors: {
      too_short: "Bitte gib mindestens 2 Zeichen ein.",
      too_long: "Bitte gib höchstens 120 Zeichen ein.",
      invalid: "Diese Eingabe scheint ungültig zu sein — bitte versuche es erneut.",
      rate_limited: "Zu viele Prüfungen von deiner Verbindung. Bitte versuche es gleich noch einmal.",
      provider_not_configured: "Der Prüfdienst ist noch nicht vollständig eingerichtet. Bitte versuche es später erneut.",
      internal_error: "Auf unserer Seite ist etwas schiefgelaufen. Bitte versuche es erneut.",
      at_least_one_required: "Bitte gib einen Namen/eine Firma oder eine E-Mail-Adresse ein.",
    },
    privacy: {
      title: "Deine Privatsphäre",
      body: "Deine Eingabe wird nur für die Dauer dieser einen Prüfung im Arbeitsspeicher gehalten und danach sofort verworfen — wir speichern weder deinen Suchbegriff noch deine E-Mail-Adresse noch die Ergebnisse.",
    },
    footer: {
      text: "Leaax ist ein unabhängiges Sicherheits-Tool. Nicht verbunden mit OpenAI, Anthropic, Google, xAI, DeepSeek oder XposedOrNot.",
      poweredBy: "KI-Chat-Suche unterstützt durch die Brave Search API. Datenleck-Daten von XposedOrNot.",
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

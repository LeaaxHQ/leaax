export type Locale = "en" | "de";

export const LOCALES: Locale[] = ["en", "de"];

export interface Translation {
  brand: string;
  tagline: string;
  hero: {
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    body: string;
  };
  problem: {
    title: string;
    body: string;
  };
  whatWeDo: {
    title: string;
    body: string;
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
  faq: {
    heading: string;
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
    provisionalNotice: string;
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
    about: {
      title: "What's this about?",
      body: "Anyone using ChatGPT or other AI chats for work — client data, project details, internal notes — risks having a shared chat end up public without noticing. Freelancers and small businesses handling sensitive information in AI tools are especially exposed — but individuals aren't immune either.",
    },
    problem: {
      title: "The problem",
      body: "Shared ChatGPT chats alone have repeatedly turned up in plain Google searches in recent months — customer names, internal strategy, even credentials. The same applies to Claude, Gemini, and other AI chats. Most existing security tools are built for developers and large IT departments. For freelancers and small businesses who just want to know \"is my ChatGPT chat exposed?\", nothing has really fit — until now.",
    },
    whatWeDo: {
      title: "What Leaax does",
      body: "A free check in under 60 seconds: is your ChatGPT or AI chat publicly exposed, or does your email show up in a known data breach? Results come as a clear traffic-light score — red, yellow, green — in plain language, no jargon. Your checked data is never stored.",
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
      emailNote:
        "Email breaches are additionally checked against XposedOrNot's public breach database — as a complement to the AI chat check, not a replacement for dedicated breach-monitoring services.",
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
    faq: {
      heading: "Frequently asked questions",
    },
    footer: {
      text: "Leaax is an independent security check. Not affiliated with OpenAI, Anthropic, Google, xAI, DeepSeek, Microsoft, or Alibaba.",
      poweredBy: "AI-chat search powered by Brave Search API. Breach data powered by XposedOrNot.",
    },
    language: { en: "English", de: "Deutsch" },
    legal: {
      navLabel: "Legal",
      imprint: "Imprint",
      privacy: "Privacy Policy",
      terms: "Terms",
      placeholderBanner: "[PLACEHOLDER — content coming soon]",
      provisionalNotice: "This page is provided provisionally and is still being finalized.",
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
    about: {
      title: "Worum geht's?",
      body: "Wer ChatGPT oder andere KI-Chats beruflich nutzt — etwa für Kundendaten, Projektdetails oder interne Notizen — läuft Gefahr, dass ein geteilter Chat unbemerkt öffentlich landet. Betroffen sind vor allem Freelancer und kleine Unternehmen, die sensible Informationen in KI-Tools eingeben — aber auch Privatpersonen sind nicht ausgenommen.",
    },
    problem: {
      title: "Das Problem",
      body: "Allein bei ChatGPT wurden in den letzten Monaten wiederholt tausende geteilte Chats über normale Google-Suchen auffindbar — Kundennamen, interne Strategien, Zugangsdaten inklusive. Das Gleiche gilt für Claude, Gemini und andere KI-Chats. Die meisten bestehenden Sicherheits-Tools sind für Entwickler und große IT-Abteilungen gebaut. Für Freelancer und kleine Unternehmen, die einfach nur wissen wollen, „ist mein ChatGPT-Chat betroffen?“, gibt es bisher nichts Passendes.",
    },
    whatWeDo: {
      title: "Was Leaax macht",
      body: "Ein kostenloser Check in unter 60 Sekunden: Ist dein ChatGPT- oder KI-Chat öffentlich auffindbar, oder taucht deine E-Mail in einem bekannten Datenleck auf? Ergebnis als klare Ampel — rot, gelb, grün — in einfacher Sprache, ohne Fachjargon. Deine geprüften Daten werden nicht gespeichert.",
    },
    form: {
      nameLabel: "Name oder Firma",
      namePlaceholder: "z. B. Erika Muster oder Muster GmbH",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "z. B. erika@beispiel.de",
      submit: "Check starten",
      submitLoading: "Wird geprüft…",
      hint: "Wir nutzen das nur für die Suche — es wird nie gespeichert.",
    },
    providers: {
      heading: "Wir prüfen öffentliche Freigabelinks von",
      note: "Nur Anbieter mit einer echten, von Suchmaschinen indexierten öffentlichen Freigabefunktion sind enthalten. Private Agenten-Tools ohne öffentliche Freigabelinks (z. B. OpenClaw, MyClaw) sind bewusst ausgeschlossen, da dieses Leck-Muster dort nicht existiert.",
      emailNote:
        "E-Mail-Datenlecks werden zusätzlich gegen XposedOrNots öffentliche Breach-Datenbank geprüft — als Ergänzung zum KI-Chat-Check, nicht als Ersatz für spezialisierte Datenleck-Dienste.",
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
    faq: {
      heading: "Häufige Fragen",
    },
    footer: {
      text: "Leaax ist ein unabhängiges Sicherheits-Tool. Nicht verbunden mit OpenAI, Anthropic, Google, xAI, DeepSeek, Microsoft oder Alibaba.",
      poweredBy: "KI-Chat-Suche unterstützt durch die Brave Search API. Datenleck-Daten von XposedOrNot.",
    },
    language: { en: "English", de: "Deutsch" },
    legal: {
      navLabel: "Rechtliches",
      imprint: "Impressum",
      privacy: "Datenschutz",
      terms: "AGB",
      placeholderBanner: "[PLATZHALTER — Inhalt folgt]",
      provisionalNotice: "Diese Seite wird vorläufig bereitgestellt und noch überarbeitet.",
      backHome: "Zurück zur Startseite",
    },
  },
};

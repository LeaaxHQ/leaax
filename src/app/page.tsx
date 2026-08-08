import { Home } from "@/components/Home";
import { loadRecommendationsContent } from "@/lib/content";

// Server component: reads the repo-controlled recommendation Markdown
// files once per request/build (see src/lib/content.ts) and hands the
// pre-rendered HTML down to the client-rendered UI. The homepage's
// language is a client-side preference (see src/lib/i18n/context.tsx),
// not a routed locale, so both language variants are read here and the
// client picks the right one at render time.
export default function Page() {
  const recommendations = loadRecommendationsContent();
  return <Home recommendations={recommendations} />;
}

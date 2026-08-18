import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

/**
 * Provides the icon Android/Chrome uses for "Add to Home Screen" (a
 * manifest with an icons array is how Chrome picks a home-screen icon —
 * without one it falls back to upscaling whatever favicon it can find,
 * the same blurriness problem this file and apple-icon.png both exist
 * to fix). This does not make the site a PWA — no service worker, no
 * offline support, nothing else changes.
 *
 * iOS/Safari doesn't read this manifest for its home-screen icon; that
 * comes from the separate apple-icon.png file convention (see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md).
 *
 * Colors match the site's only theme (see :root in globals.css — there
 * is no separate light theme to also account for here).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Find out where your [li:ks] are`,
    short_name: SITE_NAME,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1a",
    theme_color: "#0a0f1a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

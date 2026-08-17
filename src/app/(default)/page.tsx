import { redirect } from "next/navigation";

/**
 * "/" has no content of its own. In normal operation, src/proxy.ts
 * (matcher: "/") already resolves the right locale from Accept-Language
 * and redirects before this ever renders. This page stays as a
 * defense-in-depth fallback — e.g. if Proxy is ever bypassed on a given
 * deploy target — so "/" always resolves to a real page instead of
 * 404ing. German is the documented fallback locale; see src/proxy.ts for
 * the actual per-request Accept-Language decision.
 */
export default function RootPage() {
  redirect("/de");
}

// src/components/blog/Comments.tsx
// Giscus comment section — theme-aware (syncs with site Catppuccin theme switcher)
//
// SETUP REQUIRED — fill in the four config values below:
//   1. Go to https://giscus.app
//   2. Enter your GitHub repo (must be public, Discussions enabled)
//   3. Install the giscus GitHub App on the repo
//   4. Copy repo, repoId, category, and categoryId from the generated snippet
//
import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

type SiteTheme = "latte" | "frappe" | "macchiato" | "mocha";
type GiscusTheme =
  | "catppuccin_latte"
  | "catppuccin_frappe"
  | "catppuccin_macchiato"
  | "catppuccin_mocha";

const THEME_MAP: Record<SiteTheme, GiscusTheme> = {
  latte: "catppuccin_latte",
  frappe: "catppuccin_frappe",
  macchiato: "catppuccin_macchiato",
  mocha: "catppuccin_mocha",
};

function resolveGiscusTheme(): GiscusTheme {
  const attr = document.documentElement.getAttribute(
    "data-theme"
  ) as SiteTheme | null;
  return THEME_MAP[attr ?? "macchiato"] ?? "catppuccin_macchiato";
}

export default function Comments() {
  const [giscusTheme, setGiscusTheme] =
    useState<GiscusTheme>("catppuccin_macchiato");

  useEffect(() => {
    setGiscusTheme(resolveGiscusTheme());

    const observer = new MutationObserver(() => {
      setGiscusTheme(resolveGiscusTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Giscus
      id="comments"
      // ─── REPLACE THESE FOUR VALUES ──────────────────────────────────────────
      repo="olddognewflex/OldDogNewFlex.com" // e.g. "janedoe/my-blog"
      repoId="R_kgDOO7ZIrA" // from giscus.app — looks like "R_kgDO..."
      category="Blog Comments" // e.g. "Announcements" or "General"
      categoryId="DIC_kwDOO7ZIrM4C5QWl" // from giscus.app — looks like "DIC_kwDO..."
      // ────────────────────────────────────────────────────────────────────────
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={giscusTheme}
      lang="en"
      loading="eager"
    />
  );
}

import {
  DEFAULT_STOREFRONT_THEME,
  storefrontThemeSchema,
  type StorefrontThemeValues,
} from "@repo/shared-schemas";
import type { CSSProperties } from "react";

const PRODUCT_SERVICE_URL =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

export async function getStorefrontTheme(): Promise<StorefrontThemeValues> {
  try {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/settings/storefront-theme`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to load storefront theme: ${res.status}`);
    }

    const data = storefrontThemeSchema.response.parse(await res.json());
    return data.theme;
  } catch (error) {
    console.error("Failed to load storefront theme", error);
    return DEFAULT_STOREFRONT_THEME;
  }
}

export const storefrontThemeFontVariables = {
  inter: "var(--font-inter)",
  syne: "var(--font-syne)",
  "space-grotesk": "var(--font-space-grotesk)",
  lora: "var(--font-lora)",
} as const;

export function getStorefrontThemeStyle(theme: StorefrontThemeValues) {
  return {
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--primary": theme.primary,
    "--primary-foreground": theme.primaryForeground,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--card": theme.card,
    "--card-foreground": theme.cardForeground,
    "--border": theme.border,
    "--theme-font-heading": storefrontThemeFontVariables[theme.headingFont],
    "--theme-font-body": storefrontThemeFontVariables[theme.bodyFont],
  } as CSSProperties;
}

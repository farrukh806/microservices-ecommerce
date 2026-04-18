"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  DEFAULT_STOREFRONT_THEME,
  STOREFRONT_THEME_FONT_OPTIONS,
  storefrontThemeSchema,
  type StorefrontThemeValues,
} from "@repo/shared-schemas";
import { RefreshCw, Save, Settings } from "lucide-react";
import { PRODUCT_SERVICE_URL } from "@/lib/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StorefrontThemeColorKey =
  | "background"
  | "foreground"
  | "primary"
  | "primaryForeground"
  | "accent"
  | "accentForeground"
  | "card"
  | "cardForeground"
  | "border";

const COLOR_FIELDS: Array<{
  key: StorefrontThemeColorKey;
  label: string;
}> = [
  { key: "background", label: "Background" },
  { key: "foreground", label: "Foreground" },
  { key: "primary", label: "Primary" },
  { key: "primaryForeground", label: "Primary Foreground" },
  { key: "accent", label: "Accent" },
  { key: "accentForeground", label: "Accent Foreground" },
  { key: "card", label: "Card" },
  { key: "cardForeground", label: "Card Foreground" },
  { key: "border", label: "Border" },
];

const FONT_LABELS: Record<(typeof STOREFRONT_THEME_FONT_OPTIONS)[number], string> = {
  inter: "Inter",
  syne: "Syne",
  "space-grotesk": "Space Grotesk",
  lora: "Lora",
};

const FONT_VARIABLES: Record<
  StorefrontThemeValues["headingFont"] | StorefrontThemeValues["bodyFont"],
  string
> = {
  inter: "var(--font-inter)",
  syne: "var(--font-syne)",
  "space-grotesk": "var(--font-space-grotesk)",
  lora: "var(--font-lora)",
};

const HEX_COLOR = /^#(?:[0-9A-F]{6})$/;

function normalizeTheme(theme: StorefrontThemeValues): StorefrontThemeValues {
  const nextTheme = { ...theme };

  for (const field of COLOR_FIELDS) {
    nextTheme[field.key] = nextTheme[field.key].toUpperCase();
  }

  return nextTheme;
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<StorefrontThemeValues>(DEFAULT_STOREFRONT_THEME);
  const [savedTheme, setSavedTheme] = useState<StorefrontThemeValues>(DEFAULT_STOREFRONT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch(`${PRODUCT_SERVICE_URL}/settings/storefront-theme`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load storefront theme");
        }

        const data = storefrontThemeSchema.response.parse(await res.json());
        const normalized = normalizeTheme(data.theme);
        setTheme(normalized);
        setSavedTheme(normalized);
      } catch (error) {
        console.error(error);
        toast.error("Using default storefront theme");
        setTheme(DEFAULT_STOREFRONT_THEME);
        setSavedTheme(DEFAULT_STOREFRONT_THEME);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const previewStyle = useMemo(
    () =>
      ({
        "--theme-background": theme.background,
        "--theme-foreground": theme.foreground,
        "--theme-primary": theme.primary,
        "--theme-primary-foreground": theme.primaryForeground,
        "--theme-accent": theme.accent,
        "--theme-accent-foreground": theme.accentForeground,
        "--theme-card": theme.card,
        "--theme-card-foreground": theme.cardForeground,
        "--theme-border": theme.border,
        "--theme-font-heading": FONT_VARIABLES[theme.headingFont],
        "--theme-font-body": FONT_VARIABLES[theme.bodyFont],
      }) as CSSProperties,
    [theme],
  );

  const hasChanges = JSON.stringify(theme) !== JSON.stringify(savedTheme);

  const updateColorField = (key: StorefrontThemeColorKey, value: string) => {
    setTheme((current) => ({
      ...current,
      [key]: value.toUpperCase(),
    }));
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      const payload = storefrontThemeSchema.values.parse(normalizeTheme(theme));
      const res = await fetch(`${PRODUCT_SERVICE_URL}/settings/storefront-theme`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save storefront theme");
      }

      const data = storefrontThemeSchema.response.parse(await res.json());
      const normalized = normalizeTheme(data.theme);
      setTheme(normalized);
      setSavedTheme(normalized);
      toast.success("Storefront theme updated");
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        toast.error(error.issues.map((issue) => issue.message).join("; "));
        return;
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to save storefront theme",
      );
    } finally {
      setSaving(false);
    }
  };

  const resetTheme = () => {
    setTheme(savedTheme);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Control the storefront colors and typography used in the client app.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetTheme} disabled={!hasChanges || saving || loading}>
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
          <Button onClick={saveTheme} disabled={!hasChanges || saving || loading}>
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Theme"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Storefront Theme</CardTitle>
            <CardDescription>
              Changes here apply globally to every visitor of the client storefront.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <section className="space-y-4">
              <div>
                <h2 className="font-semibold">Palette</h2>
                <p className="text-sm text-muted-foreground">
                  Edit the core storefront colors used for layout, surfaces, buttons, and borders.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {COLOR_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id={field.key}
                        value={theme[field.key]}
                        onChange={(event) => updateColorField(field.key, event.target.value)}
                        disabled={loading || saving}
                        placeholder="#FFFFFF"
                        className="font-mono uppercase"
                      />
                      <input
                        type="color"
                        aria-label={`${field.label} color picker`}
                        value={HEX_COLOR.test(theme[field.key]) ? theme[field.key] : "#000000"}
                        onChange={(event) => updateColorField(field.key, event.target.value)}
                        disabled={loading || saving}
                        className="h-10 w-12 rounded-md border border-slate-200 bg-white p-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="font-semibold">Typography</h2>
                <p className="text-sm text-muted-foreground">
                  Choose the heading and body font used by the storefront.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="headingFont">Heading Font</Label>
                  <Select
                    value={theme.headingFont}
                    onValueChange={(value) =>
                      setTheme((current) => ({
                        ...current,
                        headingFont: value as StorefrontThemeValues["headingFont"],
                      }))
                    }
                    disabled={loading || saving}
                  >
                    <SelectTrigger id="headingFont" className="w-full">
                      <SelectValue placeholder="Select heading font" />
                    </SelectTrigger>
                    <SelectContent>
                      {STOREFRONT_THEME_FONT_OPTIONS.map((font) => (
                        <SelectItem key={font} value={font}>
                          {FONT_LABELS[font]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyFont">Body Font</Label>
                  <Select
                    value={theme.bodyFont}
                    onValueChange={(value) =>
                      setTheme((current) => ({
                        ...current,
                        bodyFont: value as StorefrontThemeValues["bodyFont"],
                      }))
                    }
                    disabled={loading || saving}
                  >
                    <SelectTrigger id="bodyFont" className="w-full">
                      <SelectValue placeholder="Select body font" />
                    </SelectTrigger>
                    <SelectContent>
                      {STOREFRONT_THEME_FONT_OPTIONS.map((font) => (
                        <SelectItem key={font} value={font}>
                          {FONT_LABELS[font]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Local preview of how the storefront theme will render before saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={previewStyle}
              className="overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-background)] text-[var(--theme-foreground)]"
            >
              <div className="border-b border-[var(--theme-border)] px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <p
                        style={{ fontFamily: "var(--theme-font-body), sans-serif" }}
                        className="text-xs uppercase tracking-[0.25em] text-[var(--theme-accent-foreground)]/70"
                      >
                        Storefront
                      </p>
                      <h3
                        style={{ fontFamily: "var(--theme-font-heading), sans-serif" }}
                        className="text-xl font-semibold uppercase tracking-[-0.02em]"
                      >
                        TrendShop
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ fontFamily: "var(--theme-font-body), sans-serif" }}
                    className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-1 text-xs"
                  >
                    Browse
                  </button>
                </div>
              </div>

              <div className="space-y-4 px-5 py-5">
                <div
                  style={{ fontFamily: "var(--theme-font-body), sans-serif" }}
                  className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 text-[var(--theme-card-foreground)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-accent-foreground)]/70">
                    New Collection
                  </p>
                  <h4
                    style={{ fontFamily: "var(--theme-font-heading), sans-serif" }}
                    className="mt-2 text-2xl font-semibold uppercase tracking-[-0.02em]"
                  >
                    Moments of Beauty
                  </h4>
                  <p className="mt-2 text-sm text-[var(--theme-card-foreground)]/75">
                    Curated storefront colors, surfaces, and typography preview.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      style={{ fontFamily: "var(--theme-font-body), sans-serif" }}
                      className="rounded-full bg-[var(--theme-primary)] px-4 py-2 text-sm font-medium text-[var(--theme-primary-foreground)]"
                    >
                      Shop Now
                    </button>
                    <button
                      type="button"
                      style={{ fontFamily: "var(--theme-font-body), sans-serif" }}
                      className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-background)] px-4 py-2 text-sm"
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div
                    style={{ fontFamily: "var(--theme-font-body), sans-serif" }}
                    className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 text-[var(--theme-card-foreground)]"
                  >
                    <div className="h-28 rounded-lg bg-[var(--theme-accent)]" />
                    <p
                      style={{ fontFamily: "var(--theme-font-heading), sans-serif" }}
                      className="mt-3 text-sm font-semibold uppercase tracking-[-0.02em]"
                    >
                      Featured Product
                    </p>
                    <p className="mt-1 text-sm text-[var(--theme-card-foreground)]/70">$48.00</p>
                  </div>
                  <div
                    style={{ fontFamily: "var(--theme-font-body), sans-serif" }}
                    className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-accent)] p-4 text-[var(--theme-accent-foreground)]"
                  >
                    <p
                      style={{ fontFamily: "var(--theme-font-heading), sans-serif" }}
                      className="text-sm font-semibold uppercase tracking-[-0.02em]"
                    >
                      Accent Surface
                    </p>
                    <p className="mt-1 text-sm opacity-80">
                      Search highlights, filters, and subtle UI emphasis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

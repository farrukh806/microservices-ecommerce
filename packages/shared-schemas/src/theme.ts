import { z } from "zod";

const hexColor = /^#(?:[0-9a-fA-F]{6})$/;

export const STOREFRONT_THEME_FONT_OPTIONS = [
  "inter",
  "syne",
  "space-grotesk",
  "lora",
] as const;

export const DEFAULT_STOREFRONT_THEME = {
  background: "#F9F8F6",
  foreground: "#111111",
  primary: "#111111",
  primaryForeground: "#F9F8F6",
  accent: "#E8E1D9",
  accentForeground: "#111111",
  card: "#FFFDF9",
  cardForeground: "#111111",
  border: "#D6D0C7",
  headingFont: "syne",
  bodyFont: "inter",
} as const;

const colorField = z
  .string({ message: "Color is required" })
  .trim()
  .regex(hexColor, { message: "Color must be a 6-digit hex value" });

const fontField = z.enum(STOREFRONT_THEME_FONT_OPTIONS, {
  errorMap: () => ({ message: "Unsupported font selection" }),
});

export const storefrontThemeSchema = {
  values: z.object({
    background: colorField,
    foreground: colorField,
    primary: colorField,
    primaryForeground: colorField,
    accent: colorField,
    accentForeground: colorField,
    card: colorField,
    cardForeground: colorField,
    border: colorField,
    headingFont: fontField,
    bodyFont: fontField,
  }),
  response: z.object({
    theme: z.object({
      background: colorField,
      foreground: colorField,
      primary: colorField,
      primaryForeground: colorField,
      accent: colorField,
      accentForeground: colorField,
      card: colorField,
      cardForeground: colorField,
      border: colorField,
      headingFont: fontField,
      bodyFont: fontField,
    }),
  }),
};

export type StorefrontThemeValues = z.infer<typeof storefrontThemeSchema.values>;
export type StorefrontThemeResponse = z.infer<
  typeof storefrontThemeSchema.response
>;

import { prisma } from "@repo/product-db";
import {
  DEFAULT_STOREFRONT_THEME,
  storefrontThemeSchema,
} from "@repo/shared-schemas";
import type { Request, Response } from "express";

const STOREFRONT_THEME_ID = "global";
const storefrontThemeSettings = (prisma as any).storefrontThemeSettings;

export const settingsController = {
  async getStorefrontTheme(_req: Request, res: Response) {
    const theme = await storefrontThemeSettings.findUnique({
      where: { id: STOREFRONT_THEME_ID },
    });

    const resolvedTheme = storefrontThemeSchema.values.parse(
      theme ?? DEFAULT_STOREFRONT_THEME,
    );

    res.status(200).json({ theme: resolvedTheme });
  },

  async upsertStorefrontTheme(req: Request, res: Response) {
    const data = storefrontThemeSchema.values.parse(req.body);

    const theme = await storefrontThemeSettings.upsert({
      where: { id: STOREFRONT_THEME_ID },
      create: {
        id: STOREFRONT_THEME_ID,
        ...data,
      },
      update: data,
    });

    res.status(200).json({
      theme: storefrontThemeSchema.values.parse(theme),
    });
  },
};

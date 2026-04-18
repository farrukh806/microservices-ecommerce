CREATE TABLE "StorefrontThemeSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "background" TEXT NOT NULL,
    "foreground" TEXT NOT NULL,
    "primary" TEXT NOT NULL,
    "primaryForeground" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "accentForeground" TEXT NOT NULL,
    "card" TEXT NOT NULL,
    "cardForeground" TEXT NOT NULL,
    "border" TEXT NOT NULL,
    "headingFont" TEXT NOT NULL,
    "bodyFont" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorefrontThemeSettings_pkey" PRIMARY KEY ("id")
);

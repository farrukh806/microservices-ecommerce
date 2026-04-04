"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export default function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider
      afterSignInUrl="/products"
      afterSignUpUrl="/products"
      signInFallbackRedirectUrl="/products"
      signUpFallbackRedirectUrl="/products"
    >
      {children}
    </ClerkProvider>
  );
}
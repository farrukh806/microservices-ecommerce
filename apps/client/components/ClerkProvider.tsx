"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

const ClerkProviderWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default ClerkProviderWrapper;

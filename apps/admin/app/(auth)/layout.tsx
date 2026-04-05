import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ClerkProviderWrapper from "@/components/ClerkProvider";
import { ReactNode } from "react";
import "../globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sign In - Admin Panel",
  description: "Sign in to your admin account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="antialiased">
        <ClerkProviderWrapper>
          {children}
          <Toaster position="top-center" />
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}

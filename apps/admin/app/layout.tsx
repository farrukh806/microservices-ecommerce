import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AdminNav from "@/components/AdminNav";
import ClerkProviderWrapper from "@/components/ClerkProvider";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "E-commerce admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="antialiased">
        <ClerkProviderWrapper>
          <div className="flex min-h-screen">
            <AdminNav />
            <main className="flex-1 p-8 bg-gray-50">{children}</main>
          </div>
          <Toaster position="top-center" />
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import AdminNav from "../../components/AdminNav";
import { Toaster } from "react-hot-toast";

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
        <div className="flex min-h-screen">
          <AdminNav />
          <main className="flex-1 p-8 bg-gray-50">{children}</main>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

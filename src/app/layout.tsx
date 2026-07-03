import type { Metadata } from "next";
import { PixelScripts } from "../components/analytics/PixelScripts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Landing Page",
  description: "Your new product description.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PixelScripts />
        {children}
      </body>
    </html>
  );
}

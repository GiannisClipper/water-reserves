import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { APP_TITLE, APP_SUBTITLE } from "./settings";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_SUBTITLE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
            {children}
        </main>
      </body>
    </html>
  );
}

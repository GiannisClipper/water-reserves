import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
        {/* <main className="max-w-full flex min-h-screen flex-col items-stretch justify-between p-12">
          <div className="app-border"> */}
            <div className="app-title">
              Water reserves
            </div>
            {children}
          {/* </div> */}
        </main>
      </body>
    </html>
  );
}

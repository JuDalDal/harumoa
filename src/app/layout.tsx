import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initMocks } from "@/mocks";
import Header from "./component/feature/Header";

// 개발 모드에서만 msw 실행
if (process.env.NODE_ENV === 'development') {
  initMocks();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haru-Moa",
  description: "Haru-Moa",
  icons: {
		icon: "/logo.png",
	},
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen min-w-full`}
      >
        <Header />
        <main className="flex-1 p-6"> 
          {children}
        </main>
      </body>
    </html>
  );
}

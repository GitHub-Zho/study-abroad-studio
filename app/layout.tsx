import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionWrapper from "./components/SessionWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "超级无敌厉害留学咨询工作室",
  description: "留学申请意向表 · 选校规划 · 文书指导 · 签证咨询",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}

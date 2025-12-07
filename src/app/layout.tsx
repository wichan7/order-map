import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Order Map",
  description: "Manage Your Orders With Map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <TMap API 동적 script import 미지원>
          dangerouslySetInnerHTML={{
            __html: `
              document.write('<script src="${process.env.NEXT_PUBLIC_TMAP_API_URL}/tmap/vectorjs?version=1&appKey=${process.env.NEXT_PUBLIC_TMAP_APP_KEY}"><\\/script>');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors closeButton />
        {children}
      </body>
    </html>
  );
}

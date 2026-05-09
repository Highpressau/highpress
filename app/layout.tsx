import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://highpressau.com"),

  title: {
    default: "HIGHPRESS",
    template: "%s | HIGHPRESS",
  },

  description:
    "Australian state league football, told properly.",

  keywords: [
    "Australian football",
    "NPL",
    "National Premier Leagues",
    "Football Australia",
    "State league football",
    "Australian soccer",
    "HIGHPRESS",
  ],

  authors: [{ name: "HIGHPRESS" }],

  creator: "HIGHPRESS",
  publisher: "HIGHPRESS",

  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://highpressau.com",
    siteName: "HIGHPRESS",
    title: "HIGHPRESS",
    description:
      "Australian state league football, told properly.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HIGHPRESS",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "HIGHPRESS",
    description:
      "Australian state league football, told properly.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
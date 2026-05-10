import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://highpressau.com"),

  title: {
    default: "HIGHPRESS",
    template: "%s | HIGHPRESS",
  },

  description: "Australian state league football, told properly.",

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
    description: "Australian state league football, told properly.",
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
    description: "Australian state league football, told properly.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f2f2ee] text-black">
        <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f2f2ee]/95 backdrop-blur">
          <div className="px-6 py-4 md:px-16">
            <div className="flex items-center justify-between gap-5">
              <a href="/" className="inline-block">
                <img
                  src="/logo/highpress.svg"
                  alt="HIGHPRESS"
                  className="h-12 w-auto transition-transform duration-300 hover:scale-[1.03] md:h-14"
                />
              </a>

              <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.25em] text-black md:flex">
                <a
                  href="/news"
                  className="relative py-2 after:absolute after:left-0 after:-bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                  News
                </a>

                <a
                  href="/features"
                  className="relative py-2 after:absolute after:left-0 after:-bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                  Features
                </a>

                <div className="group relative py-2">
                  <button className="relative uppercase tracking-[0.25em] after:absolute after:left-0 after:-bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 group-hover:after:w-full">
                    Fixtures/Results
                  </button>

                  <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="overflow-hidden border border-black bg-[#f2f2ee] shadow-[6px_6px_0px_#000]">
                      <a
                        href="/fixtures-results"
                        className="block px-5 py-4 text-xs uppercase tracking-[0.25em] transition-all duration-200 hover:bg-black hover:text-white"
                      >
                        Fixtures
                      </a>

                      <a
                        href="/standings"
                        className="block border-t border-black/10 px-5 py-4 text-xs uppercase tracking-[0.25em] transition-all duration-200 hover:bg-black hover:text-white"
                      >
                        Standings
                      </a>
                    </div>
                  </div>
                </div>

                <a
                  href="/about"
                  className="relative py-2 after:absolute after:left-0 after:-bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                  About
                </a>

                <a
                  href="https://www.instagram.com/highpressau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative py-2 after:absolute after:left-0 after:-bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                  Instagram
                </a>
              </nav>

              <details className="group relative md:hidden">
                <summary className="list-none cursor-pointer border border-black px-4 py-3 text-xs font-black uppercase tracking-[0.2em] transition hover:bg-black hover:text-white [&::-webkit-details-marker]:hidden">
                  Menu
                </summary>

                <nav className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden border border-black bg-[#f2f2ee] shadow-[6px_6px_0px_#000]">
                  <a
                    href="/news"
                    className="block px-5 py-4 text-xs font-black uppercase tracking-[0.22em] transition hover:bg-black hover:text-white"
                  >
                    News
                  </a>

                  <a
                    href="/features"
                    className="block border-t border-black/10 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] transition hover:bg-black hover:text-white"
                  >
                    Features
                  </a>

                  <a
                    href="/fixtures-results"
                    className="block border-t border-black/10 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] transition hover:bg-black hover:text-white"
                  >
                    Fixtures
                  </a>

                  <a
                    href="/standings"
                    className="block border-t border-black/10 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] transition hover:bg-black hover:text-white"
                  >
                    Standings
                  </a>

                  <a
                    href="/about"
                    className="block border-t border-black/10 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] transition hover:bg-black hover:text-white"
                  >
                    About
                  </a>

                  <a
                    href="https://www.instagram.com/highpressau"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-t border-black/10 px-5 py-4 text-xs font-black uppercase tracking-[0.22em] transition hover:bg-black hover:text-white"
                  >
                    Instagram
                  </a>
                </nav>
              </details>
            </div>
          </div>
        </header>

        {children}

        <footer className="border-t border-black/10 p-8 text-sm text-gray-500">
          © 2026 HIGHPRESS
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "WeThinkDigital Resume — AI-Powered Resume Builder",
  description:
    "Build professional, ATS-friendly resumes in minutes with AI. Stand out to recruiters with beautifully designed resumes.",
  openGraph: {
    title: "WeThinkDigital Resume — AI-Powered Resume Builder",
    description:
      "Build professional, ATS-friendly resumes in minutes with AI. Stand out to recruiters with beautifully designed resumes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeThinkDigital Resume — AI-Powered Resume Builder",
    description:
      "Build professional, ATS-friendly resumes in minutes with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink-primary font-sans">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

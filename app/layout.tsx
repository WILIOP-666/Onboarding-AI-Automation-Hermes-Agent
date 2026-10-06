import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Agent Playground · Hermes Onboarding",
    template: "%s · AI Agent Playground",
  },
  description:
    "A hands-on engineering onboarding that takes you from prompt to production with Hermes Agent.",
  applicationName: "AI Agent Playground",
  openGraph: {
    title: "AI Agent Playground",
    description: "From prompt to production with Hermes Agent.",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}

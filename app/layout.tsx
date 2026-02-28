import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export async function generateMetadata(): Promise<Metadata> {
  const { headers } = await import("next/headers");
  const headerList = await headers();
  const host = headerList.get("host") || "";
  const isAdultsDomain = host.includes('atelierdesmagiciens') || host.startsWith('atelier.');

  if (isAdultsDomain) {
    return {
      title: "L'Atelier des Magiciens",
      description: "Le hub des maîtres. Apprenez des illusions incroyables.",
    };
  }

  return {
    title: "Club des Petits Magiciens",
    description: "Apprenez la magie et le mentalisme",
  };
}

import CookieBanner from "@/components/CookieBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans bg-brand-bg text-brand-text antialiased flex flex-col min-h-screen`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

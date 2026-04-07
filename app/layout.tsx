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
            manifest: "/manifest.json",
            icons: {
                icon: [
                    { url: '/adults-icon-192x192.png', sizes: '192x192', type: 'image/png' },
                    { url: '/adults-icon-512x512.png', sizes: '512x512', type: 'image/png' }
                ],
                apple: [
                    { url: '/adults-apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
                ],
            },
            appleWebApp: {
                capable: true,
                statusBarStyle: "black-translucent",
                title: "L'Atelier",
            },
        };
    }

    return {
        title: "Club des Petits Magiciens",
        description: "Apprenez la magie et le mentalisme",
        manifest: "/manifest.json",
        icons: {
            icon: [
                { url: '/kids-icon-192x192.png', sizes: '192x192', type: 'image/png' },
                { url: '/kids-icon-512x512.png', sizes: '512x512', type: 'image/png' }
            ],
            apple: [
                { url: '/kids-apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
            ],
        },
        appleWebApp: {
            capable: true,
            statusBarStyle: "black-translucent",
            title: "Le Club",
        },
    };
}

import CookieBanner from "@/components/CookieBanner";
import { PWARegistration } from "@/components/PWARegistration";

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
        <PWARegistration />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider/AuthProvider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-modern",
  subsets: ["latin"],
  display: "swap",
});

const georgia = {
  variable: "--font-fairy",
};

export const metadata: Metadata = {
  title: "Папины сказки - Волшебные истории для всей семьи",
  description: "Добро пожаловать в мир волшебных сказок! Читайте авторские истории, создавайте свои собственные сказки и делитесь ими с близкими.",
  keywords: "сказки, детские истории, авторские сказки, семейные истории, фэнтези, приключения",
  authors: [{ name: "Папины сказки" }],
  creator: "Папины сказки",
  publisher: "Папины сказки",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://dads-fairy-tales.vercel.app",
    title: "Папины сказки - Волшебные истории для всей семьи",
    description: "Добро пожаловать в мир волшебных сказок! Читайте авторские истории, создавайте свои собственные сказки и делитесь ими с близкими.",
    siteName: "Папины сказки",
  },
  twitter: {
    card: "summary_large_image",
    title: "Папины сказки - Волшебные истории для всей семьи",
    description: "Добро пожаловать в мир волшебных сказок! Читайте авторские истории, создавайте свои собственные сказки и делитесь ими с близкими.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${georgia.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header magic />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

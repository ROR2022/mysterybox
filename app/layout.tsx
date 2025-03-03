import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "MysteryBox - Experiencias Digitales Personalizadas",
  description: "Descubre experiencias digitales sorpresa basadas en tus intereses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="light">
      <body className={inter.className}>
        <Toaster 
          
        />
        <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}

/*

position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'hsl(var(--b1))',
              color: 'hsl(var(--bc))',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--su))',
                secondary: 'hsl(var(--b1))',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(var(--er))',
                secondary: 'hsl(var(--b1))',
              },
            },
          }}

*/
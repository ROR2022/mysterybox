import { Navbar } from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
    </SessionProvider>
  );
} 
import type { Metadata } from "next";
import { AuthProvider } from "@/components/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Entertainment Picker",
  description: "Descubra o que assistir, ouvir ou fazer hoje com ajuda da IA!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

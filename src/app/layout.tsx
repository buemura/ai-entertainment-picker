import type { Metadata } from "next";
import { AuthProvider } from "@/components/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RecomendAI",
    template: "%s | RecomendAI",
  },
  description:
    "Descubra o que assistir, ouvir ou fazer hoje com ajuda da IA! Receba recomendações personalizadas de filmes, séries, músicas e muito mais.",
  keywords: [
    "recomendação",
    "IA",
    "filmes",
    "séries",
    "músicas",
    "entretenimento",
    "inteligência artificial",
  ],
  authors: [{ name: "RecomendAI" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "RecomendAI",
    title: "RecomendAI",
    description:
      "Descubra o que assistir, ouvir ou fazer hoje com ajuda da IA!",
  },
  twitter: {
    card: "summary_large_image",
    title: "RecomendAI",
    description:
      "Descubra o que assistir, ouvir ou fazer hoje com ajuda da IA!",
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
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

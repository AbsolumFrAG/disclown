import { Metadata } from "next";
import { ThemeProvider } from "./theme";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Disclown",
  description: "Une application de chat moderne open source",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

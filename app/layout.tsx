import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import "./theme.css";

export const metadata: Metadata = {
  title: "BarberGo | Corte em casa",
  description: "Protótipo demonstrativo do marketplace BarberGo"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}

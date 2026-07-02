import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "BudgetTracker",
  description: "Bütçeni takip et, kontrol sende olsun.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable}`}>
      <body>
        <div className="container">
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </div>
      </body>
    </html>
  );
}

import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyAction from "@/components/StickyAction";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Prayog India | Premier Robotics & STEM Education",
  description: "Empowering the next generation with hands-on robotics, AI, and STEM workshops.",
  icons: {
    icon: "/icon.png?v=2",
  },
};

import { SettingsProvider } from "@/components/SettingsContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-body">
        <SettingsProvider>
          <main className="flex-grow">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  );
}

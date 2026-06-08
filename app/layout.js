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
  title: "Prayog India | STEM & Robotics Education for Class 1-12",
  description: "India's leading STEM & robotics education hub for school students. Hands-on learning programs in coding, IoT, drones, and AI logic.",
  icons: {
    icon: "/favicon.svg",
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

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
  title: "PRAYOG INDIA ROBOTICS | Training & Internship Centre",
  description: "Leading Robotics, AI, IoT, Drone Technology, STEM, 3D Design & Embedded Systems Training and Internship Centre at Ranchi, Jharkhand. Learn, Build, Innovate with PRAYOG INDIA ROBOTICS.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "PRAYOG INDIA ROBOTICS | Training & Internship Centre",
    description: "Leading Robotics, AI, IoT, Drone Technology, STEM, 3D Design & Embedded Systems Training and Internship Centre at Ranchi, Jharkhand. Learn, Build, Innovate with PRAYOG INDIA ROBOTICS.",
    url: "https://prayogindiarobotics.com",
    siteName: "Prayog India",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Prayog India PI Monogram Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PRAYOG INDIA ROBOTICS | Training & Internship Centre",
    description: "Leading Robotics, AI, IoT, Drone Technology, STEM, 3D Design & Embedded Systems Training and Internship Centre at Ranchi, Jharkhand. Learn, Build, Innovate with PRAYOG INDIA ROBOTICS.",
    images: ["/favicon.png"],
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

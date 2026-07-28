import { Montserrat, Great_Vibes, Cambria } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyAction from "@/components/StickyAction";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: ["400"],
  variable: "--font-freehand",
  subsets: ["latin"],
  display: "swap",
});

// Custom local fonts or fallbacks for certificate
// We configure custom font families via CSS font-face or web font imports

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
    <html lang="en" className={`${montserrat.variable} ${greatVibes.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@600&family=Courgette&family=Great+Vibes&family=Kaushan+Script&family=Playfair+Display:ital,wght@1,400;1,700&family=Satisfy&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-body">
        <SettingsProvider>
          <main className="flex-grow">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  );
}

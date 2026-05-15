"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    logo_url: '/assets/logo.png',
    footer_address: '1st Floor, City Centre, Club Road, Ranchi - 834001',
    footer_phone: '+91 7033066338',
    footer_email: 'info@prayogindiarobotics.com',
    facebook_url: 'https://www.facebook.com/share/p/1CEiWdZKuo/',
    youtube_url: 'https://youtube.com/@prayog_india?si=MZmuDauDOHqmmuzD',
    linkedin_url: 'https://www.linkedin.com/company/prayog-india-robotics/',
    instagram_url: 'https://www.instagram.com/prayog_india?utm_source=qr&igsh=MWNtMXBjODlwMTJ5Zg=='
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    }
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import sharp from "sharp";

async function buildAndroidApp() {
  const rootDir = path.join(process.cwd(), "prayog-android");
  console.log("Scaffolding Android WebView wrapper in:", rootDir);

  // 1. Create directory structure
  const dirs = [
    "",
    "app",
    "app/src",
    "app/src/main",
    "app/src/main/java",
    "app/src/main/java/com",
    "app/src/main/java/com/prayog",
    "app/src/main/java/com/prayog/india",
    "app/src/main/res",
    "app/src/main/res/layout",
    "app/src/main/res/values",
    "app/src/main/res/mipmap-mdpi",
    "app/src/main/res/mipmap-hdpi",
    "app/src/main/res/mipmap-xhdpi",
    "app/src/main/res/mipmap-xxhdpi",
    "app/src/main/res/mipmap-xxxhdpi",
  ];

  dirs.forEach(d => {
    const p = path.join(rootDir, d);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });

  // 2. Write project-level gradle files
  fs.writeFileSync(path.join(rootDir, "settings.gradle"), `
include ':app'
rootProject.name = "Prayog India"
  `.trim());

  fs.writeFileSync(path.join(rootDir, "build.gradle"), `
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
  `.trim());

  // Write gradle.properties file
  fs.writeFileSync(path.join(rootDir, "gradle.properties"), `
android.useAndroidX=true
android.enableJetifier=true
  `.trim());

  // 3. Write app-level files
  fs.writeFileSync(path.join(rootDir, "app/build.gradle"), `
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.prayog.india'
    compileSdk 34

    defaultConfig {
        applicationId "com.prayog.india"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
}
  `.trim());

  // Manifest
  fs.writeFileSync(path.join(rootDir, "app/src/main/AndroidManifest.xml"), `
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.PrayogIndia">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.PrayogIndia.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
  `.trim());

  // MainActivity.java
  fs.writeFileSync(path.join(rootDir, "app/src/main/java/com/prayog/india/MainActivity.java"), `
package com.prayog.india;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        myWebView = findViewById(R.id.webview);
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setLoadsImagesAutomatically(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        myWebView.setWebViewClient(new WebViewClient());
        myWebView.loadUrl("https://prayogindiarobotics.com");
    }

    @Override
    public void onBackPressed() {
        if (myWebView.canGoBack()) {
            myWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
  `.trim());

  // activity_main.xml layout
  fs.writeFileSync(path.join(rootDir, "app/src/main/res/layout/activity_main.xml"), `
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</FrameLayout>
  `.trim());

  // Resources: values
  fs.writeFileSync(path.join(rootDir, "app/src/main/res/values/strings.xml"), `
<resources>
    <string name="app_name">Prayog India</string>
</resources>
  `.trim());

  fs.writeFileSync(path.join(rootDir, "app/src/main/res/values/colors.xml"), `
<resources>
    <color name="primary">#01254d</color>
    <color name="primary_dark">#001124</color>
    <color name="accent">#FFC107</color>
</resources>
  `.trim());

  fs.writeFileSync(path.join(rootDir, "app/src/main/res/values/styles.xml"), `
<resources>
    <style name="Theme.PrayogIndia" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/primary_dark</item>
        <item name="colorAccent">@color/accent</item>
    </style>
    <style name="Theme.PrayogIndia.NoActionBar" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/primary_dark</item>
        <item name="colorAccent">@color/accent</item>
    </style>
</resources>
  `.trim());

  // 4. Generate Launcher Icons in various resolutions from favicon.png
  const faviconPath = path.join(process.cwd(), "public", "favicon.png");
  if (fs.existsSync(faviconPath)) {
    const mipmaps = [
      { name: "mdpi", size: 48 },
      { name: "hdpi", size: 72 },
      { name: "xhdpi", size: 96 },
      { name: "xxhdpi", size: 144 },
      { name: "xxxhdpi", size: 192 },
    ];
    for (const m of mipmaps) {
      const p = path.join(rootDir, `app/src/main/res/mipmap-${m.name}/ic_launcher.png`);
      await sharp(faviconPath).resize(m.size, m.size).png().toFile(p);
      console.log(`Generated ic_launcher.png at size ${m.size}x${m.size}`);
    }
  } else {
    console.warn("favicon.png not found, building without custom launcher icon.");
  }

  // 5. Compile Android App using local Gradle
  try {
    console.log("Compiling app with Gradle...");
    execSync("gradle assembleDebug", { cwd: rootDir, stdio: "inherit" });

    // 6. Copy output APK
    const srcApk = path.join(rootDir, "app/build/outputs/apk/debug/app-debug.apk");
    const destApk = path.join(process.cwd(), "prayog_india.apk");
    if (fs.existsSync(srcApk)) {
      fs.copyFileSync(srcApk, destApk);
      console.log("\n=============================================");
      console.log("Success! Compiled APK placed in workspace root:");
      console.log("Path:", destApk);
      console.log("=============================================\n");
    } else {
      console.error("Compilation succeeded but output APK not found at:", srcApk);
    }
  } catch (error) {
    console.error("Gradle compilation failed:", error);
    process.exit(1);
  }
}

buildAndroidApp();

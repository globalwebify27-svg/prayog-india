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
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    
    <!-- Camera -->
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- Storage / Media Access for uploads -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />

    <!-- Location -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

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

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.GeolocationPermissions;
import android.webkit.PermissionRequest;
import android.webkit.DownloadListener;
import android.webkit.URLUtil;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.app.DownloadManager;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {
    private WebView myWebView;
    private ValueCallback<Uri[]> uploadMessage;
    private final static int FILECHOOSER_RESULTCODE = 1;
    private final static int PERMISSION_REQUEST_CODE = 100;

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
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        // Add Javascript Interface for handling blob downloads
        myWebView.addJavascriptInterface(new WebAppInterface(), "AndroidApp");

        myWebView.setWebViewClient(new WebViewClient());
        myWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                if (uploadMessage != null) {
                    uploadMessage.onReceiveValue(null);
                    uploadMessage = null;
                }
                uploadMessage = filePathCallback;

                if (!checkPermissions()) {
                    requestPermissions();
                    return true;
                }

                openFileChooser();
                return true;
            }
        });

        // Enable File Downloads in WebView
        myWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                // Handle Blob URLs generated client-side by libraries like jsPDF
                if (url.startsWith("blob:")) {
                    String filename = "download.pdf";
                    if (contentDisposition != null && contentDisposition.contains("filename=")) {
                        try {
                            String[] parts = contentDisposition.split("filename=");
                            if (parts.length > 1) {
                                filename = parts[1].replace("\\\"", "").replace(";", "").trim();
                            }
                        } catch (Exception e) {}
                    }
                    
                    final String finalFilename = filename;
                    final String finalMimetype = mimetype;
                    
                    String js = "javascript:(function() {" +
                            "  var xhr = new XMLHttpRequest();" +
                            "  xhr.open('GET', '" + url + "', true);" +
                            "  xhr.responseType = 'blob';" +
                            "  xhr.onload = function(e) {" +
                            "    if (this.status == 200) {" +
                            "      var blob = this.response;" +
                            "      var reader = new FileReader();" +
                            "      reader.readAsDataURL(blob);" +
                            "      reader.onloadend = function() {" +
                            "        var base64data = reader.result.split(',')[1];" +
                            "        AndroidApp.saveBlob(base64data, '" + finalMimetype + "', '" + finalFilename + "');" +
                            "      }" +
                            "    }" +
                            "  };" +
                            "  xhr.send();" +
                            "})()";
                    myWebView.loadUrl(js);
                    return;
                }

                // Handle Data URLs directly
                if (url.startsWith("data:")) {
                    try {
                        String[] parts = url.split(",");
                        String metadata = parts[0];
                        String base64Data = parts[1];
                        String filename = "download";
                        if (metadata.contains("pdf")) filename += ".pdf";
                        else if (metadata.contains("image/png")) filename += ".png";
                        else if (metadata.contains("image/jpeg")) filename += ".jpg";
                        
                        byte[] fileBytes = android.util.Base64.decode(base64Data, android.util.Base64.DEFAULT);
                        java.io.File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                        java.io.File file = new java.io.File(path, filename);
                        java.io.FileOutputStream fos = new java.io.FileOutputStream(file);
                        fos.write(fileBytes);
                        fos.close();
                        Toast.makeText(MainActivity.this, "File downloaded: " + filename, Toast.LENGTH_LONG).show();
                        android.media.MediaScannerConnection.scanFile(MainActivity.this, new String[]{file.getAbsolutePath()}, null, null);
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "Download failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
                    }
                    return;
                }

                // Handle Standard HTTP/HTTPS links
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                    if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                        ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 101);
                        return;
                    }
                }

                try {
                    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                    request.setMimeType(mimetype);
                    String cookies = CookieManager.getInstance().getCookie(url);
                    request.addRequestHeader("cookie", cookies);
                    request.addRequestHeader("User-Agent", userAgent);
                    request.setDescription("Downloading file...");
                    request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype));
                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimetype));
                    
                    DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                    if (dm != null) {
                        dm.enqueue(request);
                        Toast.makeText(MainActivity.this, "Downloading file...", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Download failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            }
        });
        
        // Request camera and location permissions at startup so they are pre-granted for WebRTC/Geolocation
        if (!checkPermissions()) {
            requestPermissions();
        }

        myWebView.loadUrl("https://prayogindiarobotics.com");
    }

    private boolean checkPermissions() {
        boolean hasLocation = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        boolean hasCamera = ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return hasLocation && hasCamera &&
                   ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) == PackageManager.PERMISSION_GRANTED;
        } else {
            return hasLocation && hasCamera &&
                   ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
        }
    }

    private void requestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.requestPermissions(this, new String[]{
                    Manifest.permission.READ_MEDIA_IMAGES,
                    Manifest.permission.CAMERA,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
            }, PERMISSION_REQUEST_CODE);
        } else {
            ActivityCompat.requestPermissions(this, new String[]{
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.CAMERA,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
            }, PERMISSION_REQUEST_CODE);
        }
    }

    private void openFileChooser() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), FILECHOOSER_RESULTCODE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (uploadMessage == null) return;
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                String dataString = data.getDataString();
                if (dataString != null) {
                    results = new Uri[]{Uri.parse(dataString)};
                } else if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    results = new Uri[count];
                    for (int i = 0; i < count; i++) {
                        results[i] = data.getClipData().getItemAt(i).getUri();
                    }
                }
            }
            uploadMessage.onReceiveValue(results);
            uploadMessage = null;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            openFileChooser();
        }
    }

    @Override
    public void onBackPressed() {
        if (myWebView.canGoBack()) {
            myWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    private class WebAppInterface {
        @JavascriptInterface
        public void saveBlob(String base64Data, String mimetype, String filename) {
            try {
                byte[] fileBytes = android.util.Base64.decode(base64Data, android.util.Base64.DEFAULT);
                java.io.File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                java.io.File file = new java.io.File(path, filename);
                
                java.io.FileOutputStream fos = new java.io.FileOutputStream(file);
                fos.write(fileBytes);
                fos.close();
                
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(MainActivity.this, "Saved: " + filename, Toast.LENGTH_LONG).show();
                        android.media.MediaScannerConnection.scanFile(MainActivity.this, new String[]{file.getAbsolutePath()}, null, null);
                    }
                });
            } catch (Exception e) {
                MainActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(MainActivity.this, "Blob Download failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
            }
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

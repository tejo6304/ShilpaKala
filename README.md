
# 🪵 Shilpa-Kala — Digital Portfolio Assistant for Indian Artisans

> *"Your Craft. Your Brand." | "ನಿಮ್ಮ ಕಲೆ. ನಿಮ್ಮ ಬ್ರ್ಯಾಂಡ್."*

---

## 📖 About the App

**Shilpa-Kala** is an Android app built to empower traditional Indian artisans — wood carvers, Gombe makers, and craft workers from places like **Channapatna** and **Kinnala** in Karnataka — by transforming their ordinary smartphone photos into professional, catalog-ready product images.

The name *Shilpa-Kala* (ಶಿಲ್ಪ ಕಲೆ) means **"The Art of Craft"** in Kannada — a tribute to the centuries-old tradition of Indian artisanship.

---

## 🎯 The Problem We Solve

Skilled artisans produce **world-class handicrafts** — hand-turned wooden toys, intricate Gombe dolls, and carved figurines. But when they photograph these products on WhatsApp to share with city buyers, the photos look **dull, unlit, and unprofessional**.

This makes premium handmade work appear cheap, and artisans lose the ability to charge prices their craft truly deserves.

**Shilpa-Kala fixes this** — no photography training required.

---

## ✨ Key Features

### 📷 Guided Camera
- Full-screen camera interface with a **golden guide frame overlay**
- Dashed border rectangle with corner markers shows artisans exactly where to place their product
- Tap-to-focus for sharp, clear captures
- Simple, distraction-free UI designed for first-time smartphone users

### 🏷️ Automatic Heritage Branding
After every photo, the app automatically applies:
- **"Handmade in Karnataka"** heritage label on a semi-transparent strip
- **Artisan's name and village** embedded directly in the image
- **Wood type** displayed alongside artisan details
- **Price badge** in saffron orange at the top corner
- **Product name** in elegant serif typography
- **Shilpa-Kala watermark** for brand consistency

### 🖼️ Professional Background
- Subtle vignette effect to draw attention to the product
- Soft cream/ivory gradient overlay for a luxury catalog feel
- All processing done **locally on-device** — no internet needed

### 📤 One-Tap Sharing
- Save branded photos directly to your device gallery (`Pictures/ShilpaKala`)
- Share instantly to **WhatsApp**, **Facebook**, Instagram, or any app via Android's native share sheet

### 🗂️ Branded Gallery
- View all your previously branded photos in a clean 2-column grid
- Tap to view full screen, long-press to share or delete

---

## 📱 App Flow

```
Launch App
    │
    ▼
Onboarding (first time only)
    │   Enter Artisan Name + Village
    ▼
Camera Screen  ◄─────────────────────┐
    │   Guide frame overlay           │
    │   Capture product photo         │
    ▼                                 │
Product Details (bottom sheet)        │
    │   Product Name                  │
    │   Wood Type                     │
    │   Price                         │
    ▼                                 │
Branded Photo Preview                 │
    │   Heritage label                │
    │   Price badge                   │
    │   Artisan name + village        │
    ├── Save to Gallery               │
    ├── Share (WhatsApp / Facebook)   │
    └── Retake ───────────────────────┘
```

---

## 🛠️ Technical Stack

| Component | Technology |
|-----------|------------|
| Language | Kotlin |
| Camera | CameraX (androidx.camera) |
| Image Processing | Android Bitmap + Canvas API |
| Storage | MediaStore API (Scoped Storage) |
| UI Framework | Material Design 3 |
| Architecture | ViewModel + LiveData |
| Local Storage | SharedPreferences |
| Min SDK | API 24 (Android 7.0) |
| Target SDK | API 34 (Android 14) |

---

## 🎨 Design Language

Shilpa-Kala's visual identity is rooted in the warmth of Indian craft culture:

| Token | Value | Use |
|-------|-------|-----|
| Primary | `#5C3317` Dark Walnut Brown | App bar, key UI elements |
| Secondary | `#C8960C` Heritage Gold | Accents, borders, watermark |
| Accent | `#FF6B00` Saffron Orange | Price badge, CTA buttons |
| Background | `#FDF6EC` Cream Ivory | Screens, cards |
| Text | `#2C1A0E` Deep Espresso | Body text, labels |

Typography uses a warm **serif font** for headings and product names, and a clean **sans-serif** for UI elements — evoking both tradition and modernity.

---

## 📂 Project Structure

```
shilpa-kala/
├── app/
│   ├── src/main/
│   │   ├── java/com/shilpakala/
│   │   │   ├── MainActivity.kt              # Entry point, permissions
│   │   │   ├── CameraFragment.kt            # CameraX + overlay
│   │   │   ├── OverlayView.kt               # Custom Canvas guide frame
│   │   │   ├── ProductDetailsBottomSheet.kt # Input: name, wood, price
│   │   │   ├── BrandingViewModel.kt         # Image processing logic
│   │   │   ├── BrandedPhotoActivity.kt      # Preview, save, share
│   │   │   ├── GalleryFragment.kt           # Saved photos grid
│   │   │   ├── GalleryAdapter.kt            # RecyclerView adapter
│   │   │   ├── BitmapUtils.kt               # Branding pipeline
│   │   │   └── SharedPrefsHelper.kt         # Artisan profile storage
│   │   ├── res/
│   │   │   ├── layout/                      # XML layouts
│   │   │   ├── drawable/                    # Icons, shapes
│   │   │   ├── font/                        # Custom serif font
│   │   │   └── values/                      # Colors, strings, themes
│   │   └── AndroidManifest.xml
│   └── build.gradle
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- Android device or emulator running API 24+
- JDK 17

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/shilpa-kala.git

# 2. Open in Android Studio
File → Open → select the shilpa-kala folder

# 3. Sync Gradle
Android Studio will prompt — click "Sync Now"

# 4. Run on a real device (recommended for camera)
Run → Run 'app' → select your connected device
```

> ⚠️ **Note:** CameraX features work best on a **real Android device**. The emulator camera is simulated and may not fully represent the overlay experience.

### Required Permissions
The app will request the following at runtime:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="28" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```

---

## 🖼️ Image Branding Pipeline

The core of Shilpa-Kala is the `BitmapUtils.applyBranding()` function:

```kotlin
fun applyBranding(
    originalBitmap: Bitmap,
    artisanName: String,
    village: String,
    productName: String,
    woodType: String,
    price: String
): Bitmap {
    val result = originalBitmap.copy(Bitmap.Config.ARGB_8888, true)
    val canvas = Canvas(result)
    // Step 1: Bottom gradient strip (cream/ivory, 20% height)
    // Step 2: Heritage label — "Handmade in Karnataka" + artisan name + wood type
    // Step 3: Price badge (saffron, top-right corner)
    // Step 4: Product name (elegant serif, top-left)
    // Step 5: Shilpa-Kala watermark (golden, small, top-left)
    return result
}
```

All text sizes are proportional to the image dimensions, so branding looks sharp on both budget and flagship phone cameras.

---

## 🌍 Impact Goals

| Goal | Description |
|------|-------------|
| 🇮🇳 Brand India | Elevating the perceived value of Indian handicrafts for domestic and global buyers |
| 📱 Digital Literacy | Teaching artisans the power of visual branding through a tool they can use independently |
| 💰 Economic Empowerment | Enabling artisans to justify and command premium prices for quality-branded work |
| 🤝 Self-Employment | Supporting micro-entrepreneurs in rural Karnataka with zero extra cost |

---

## ✅ Success Criteria

- [x] Guide frame overlay correctly positions product during capture
- [x] Heritage label, price badge, and product name are correctly layered on the output image
- [x] Artisan name from onboarding is automatically embedded in every branded photo
- [x] Photos are saved to the device gallery and shareable via WhatsApp / Facebook
- [x] App works fully **offline** — no internet connection required
- [x] UI is clean, camera-focused, and accessible for first-time users

---

## 🗣️ Supported Languages

| Language | Status |
|----------|--------|
| English | ✅ Full support |
| ಕನ್ನಡ (Kannada) | ✅ Key labels and tagline |

---

## 🤝 Contributing

Contributions are welcome! If you're a student, developer, or artisan community organization who wants to improve Shilpa-Kala:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push and open a Pull Request

### Ideas for Contribution
- Add multi-language support (Hindi, Telugu, Tamil)
- Improve background removal for cleaner product isolation
- Add a "before/after" preview slider
- Build a web version for artisan cooperatives

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute for educational and social impact purposes.

---

## 🙏 Acknowledgements

- Artisan communities of **Channapatna** and **Kinnala**, Karnataka
- Karnataka Handicrafts Development Corporation (KHDC)
- Built as part of the **GenAI Android App Development** initiative for self-employment and digital literacy
- Inspired by India's rich tradition of *Shilpa Shastra* — the ancient science of craft

---
<img width="590" height="1280" alt="1" src="https://github.com/user-attachments/assets/d100a546-6c6e-40c4-b7db-5b081de2a388" />
<img width="590" height="1280" alt="2" src="https://github.com/user-attachments/assets/f696cb97-159f-4dff-b53a-94b66da1ff6a" />
<img width="590" height="1280" alt="3" src="https://github.com/user-attachments/assets/d3611e3b-1f03-462a-850f-ca31c0d78728" />
<img width="590" height="1280" alt="4" src="https://github.com/user-attachments/assets/0ced8974-779a-4cda-b4de-e58e1bceea0f" />
<div align="center">

**Shilpa-Kala** — *Giving ancient craft a modern voice.*

🪵 Made with ❤️ for the artisans of Karnataka

</div>

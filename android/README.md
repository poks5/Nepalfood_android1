# Khana Sathi (खाना साथी) — Android Native App (Option 3)
### Nepal Food & Nutrition Database (Kotlin + Jetpack Compose + Room SQLite)

This directory contains the **complete, standalone native Android project** for the Nepal Food & Nutrition Database (NARC 2024 & DFTQC 2012 editions).

---

## 📱 Tech Stack & Native Architecture

| Component | Technology | Purpose |
|---|---|---|
| **Language** | Kotlin 2.0.20 | Pure native modern Android development |
| **UI Framework** | Jetpack Compose (Material 3) | Declarative UI, smooth 60/120fps animations, edge-to-edge support |
| **Database** | Room Database (SQLite) + Coroutines Flow | 100% offline local querying, full-text search indexing |
| **Image Loading** | Coil Compose 2.7.0 | Seamless rendering of 100 high-res food specimen plates from assets |
| **Serialization** | Kotlinx Serialization | Cold-boot database seeder from `database.json` |
| **Architecture** | MVVM + Repository Pattern | Clean separation of concerns with Android ViewModel & StateFlow |

---

## 🚀 How to Open and Run in Android Studio

1. **Prerequisites**:
   - [Android Studio Iguana / Jellyfish / Koala or newer](https://developer.android.com/studio)
   - JDK 17 or JDK 21 (bundled with Android Studio)
   - Android SDK 35 (API 35)

2. **Open in Android Studio**:
   - Launch Android Studio.
   - Click **Open** (or **File > Open**).
   - Select the `android/` directory from this project.
   - Wait for Gradle Sync to complete.

3. **Run on Device or Emulator**:
   - Connect an Android phone (with USB debugging enabled) or start an Android Virtual Device (AVD).
   - Click the green **Run** button (`Shift + F10`) in Android Studio.

---

## 🛠️ Command-Line Build Instructions

You can also build the APK directly using the Gradle wrapper:

```bash
# Navigate to the android directory
cd android

# Build debug APK
./gradlew assembleDebug

# Output APK location:
# app/build/outputs/apk/debug/app-debug.apk

# Build release bundle (for Google Play Store)
./gradlew bundleRelease
```

---

## 📂 Project Structure

```
android/
├── build.gradle.kts                         # Root Gradle script
├── settings.gradle.kts                      # Module management
├── gradle.properties                        # JVM & AndroidX optimization
├── gradle/
│   ├── libs.versions.toml                   # Gradle Version Catalog
│   └── wrapper/gradle-wrapper.properties    # Gradle 8.7 wrapper
└── app/
    ├── build.gradle.kts                     # App module dependencies & configuration
    ├── proguard-rules.pro                   # Optimization & keep rules
    └── src/
        └── main/
            ├── AndroidManifest.xml          # App manifest & permissions
            ├── assets/
            │   ├── database.json            # Complete 644 food records & photo mappings
            │   └── images/                  # High-resolution photographic plates (NFD-00001 to NFD-00100)
            ├── res/values/
            │   ├── strings.xml              # Multilingual strings (English & Nepali)
            │   ├── colors.xml               # Emerald theme palette
            │   └── themes.xml               # Material 3 window styling
            └── java/com/khanasathi/app/
                ├── MainActivity.kt          # Compose root & tab navigation
                ├── data/
                │   ├── model/FoodItem.kt    # Room entity with 40+ nutrient attributes
                │   ├── dao/FoodDao.kt       # SQLite DAO queries, search & filtering
                │   ├── database/AppDatabase.kt # Room database with auto-seeder
                │   └── repository/FoodRepository.kt
                ├── ui/
                │   ├── theme/               # Material 3 colors, typography, theme
                │   ├── components/          # FoodCard, nutrient badges
                │   ├── viewmodel/           # FoodViewModel & Meal calculator state
                │   └── screens/
                │       ├── HomeScreen.kt    # Overview dashboard, stats, categories
                │       ├── FoodListScreen.kt # Filterable list (2024 / 2012 / Groups)
                │       ├── FoodDetailScreen.kt # High-res photo plate, macros & minerals
                │       ├── FavoritesScreen.kt # Bookmarked foods
                │       ├── NutritionCalculatorScreen.kt # Custom portion calculator
                │       └── MoreScreen.kt    # Laboratory citations & methodology
```

---

## 🔒 100% Offline & Zero Network Dependency
All 644 food composition records and photographic plates are packaged directly within the APK's `assets/` directory. The app requires **no internet permission** (`android.permission.INTERNET` is not required), making it ideal for remote fieldwork, health posts, agricultural extension workers, and community nutritionists across all 7 provinces of Nepal.

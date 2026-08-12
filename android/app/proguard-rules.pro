##############################################
# PROGUARD / R8 RULES FOR STRATEGY CORE
# Optimized for Capacitor, WebView, AI engines,
# and Google Play Games on PC compatibility.
##############################################

# --- KEEP CAPACITOR CORE ---
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.plugins.** { *; }

# --- KEEP YOUR APP CLASSES ---
-keep class com.strategycore.app.** { *; }

# --- KEEP WEBVIEW JAVASCRIPT INTERFACE ---
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# --- KEEP ANDROID WEBVIEW ---
-keep class android.webkit.** { *; }

# --- KEEP REFLECTION-BASED CODE ---
-keepclassmembers class * {
    *;
}

# --- KEEP ENUMS (avoid shrink issues) ---
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# --- KEEP AI ENGINE CLASSES (minimax, neural engine) ---
-keep class **Minimax** { *; }
-keep class **NeuralEngine** { *; }
-keep class **GameAI** { *; }
-keep class **Evaluator** { *; }
-keep class **BoardState** { *; }

# --- KEEP GAME LOGIC (avoid shrink of strategy classes) ---
-keep class **Chess** { *; }
-keep class **Go** { *; }
-keep class **Reversi** { *; }
-keep class **Tetris** { *; }
-keep class **Snake** { *; }
-keep class **Minesweeper** { *; }
-keep class **GameManager** { *; }

# --- KEEP JSON SERIALIZATION ---
-keep class com.google.gson.** { *; }
-keep class com.fasterxml.jackson.** { *; }

# --- KEEP ANNOTATIONS ---
-keepattributes *Annotation*

# --- KEEP KOTLIN (if any plugin uses it) ---
-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }

# --- REMOVE LOGGING IN RELEASE ---
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# --- OPTIMIZE BYTECODE ---
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*


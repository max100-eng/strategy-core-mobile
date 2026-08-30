##############################################
# PROGUARD / R8 RULES FOR STRATEGY CORE
# FIXED - Alta optimización para Play Console
##############################################

# --- CAPACITOR CORE - Solo lo necesario ---
-keep class com.getcapacitor.Bridge { *; }
-keep class com.getcapacitor.Plugin { *; }
-keep class com.getcapacitor.PluginCall { *; }
-keep class com.getcapacitor.PluginMethod { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep @com.getcapacitor.annotation.PluginMethod class * { *; }
-keep class com.getcapacitor.cordova.MockCordovaWebViewImpl { *; }

# --- TU APP - Solo Entry points, no toda la app ---
-keep class com.strategycore.app.MainActivity { *; }
-keep class com.strategycore.app.BridgeActivity { *; }

# --- WEBVIEW JAVASCRIPT INTERFACE - Solo métodos anotados ---
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface

# --- ENUMS ---
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# --- AI ENGINES - Permite ofuscación pero mantiene nombres si los llamas desde JS ---
# Si tus AI se llaman solo desde Kotlin/Java, puedes borrar este bloque entero
-keep,allowobfuscation class **.Minimax { <methods>; }
-keep,allowobfuscation class **.NeuralEngine { <methods>; }
-keep,allowobfuscation class **.GameAI { <methods>; }
-keep,allowobfuscation class **.Evaluator { <methods>; }
-keep,allowobfuscation class **.BoardState { <methods>; }

# --- JSON - Solo si usas Gson con modelos ---
-keepattributes Signature, *Annotation*
-keep class com.google.gson.reflect.TypeToken { *; }
-keep class * extends com.google.gson.reflect.TypeToken
-keepclassmembers,allowobfuscation class * {
  @com.google.gson.annotations.SerializedName <fields>;
}

# --- KOTLIN ---
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.**

# --- CAPACITOR PLUGINS ---
-dontwarn com.getcapacitor.**
-dontwarn org.apache.cordova.**

# --- LOGS FUERA EN RELEASE ---
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# --- OPTIMIZACIÓN AGRESIVA ---
-optimizationpasses 5
-allowaccessmodification
-repackageclasses

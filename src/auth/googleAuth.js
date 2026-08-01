import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

const provider = new GoogleAuthProvider();

// Login con popup (funciona en Android WebView)
export async function loginWithGooglePopup() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("🔐 Google Login OK:", user.uid);

    return {
      ok: true,
      user
    };

  } catch (err) {
    console.error("❌ Error en Google Popup:", err);
    return { ok: false, error: err };
  }
}

// Login con redirect (alternativa si popup falla)
export async function loginWithGoogleRedirect() {
  try {
    await signInWithRedirect(auth, provider);
  } catch (err) {
    console.error("❌ Error en Google Redirect:", err);
  }
}

// Recuperar usuario después del redirect
export async function checkGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);

    if (result) {
      const user = result.user;
      console.log("🔐 Google Redirect OK:", user.uid);

      return {
        ok: true,
        user
      };
    }

    return { ok: false, user: null };

  } catch (err) {
    console.error("❌ Error en Redirect:", err);
    return { ok: false, error: err };
  }
}

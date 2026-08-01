import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

export async function testFirebaseAuthAndroid() {
  console.log("🔍 Probando Firebase Auth en Android…");

  const email = "test_android@example.com";
  const password = "12345678";

  try {
    // 1. Crear usuario
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("👤 Usuario creado:", userCred.user.uid);

    // 2. Cerrar sesión
    await signOut(auth);
    console.log("🚪 Sesión cerrada");

    // 3. Iniciar sesión
    const loginCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("🔐 Sesión iniciada:", loginCred.user.uid);

    // 4. Escuchar estado
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("📡 Usuario autenticado:", user.uid);
      } else {
        console.log("📡 Sin usuario autenticado");
      }
    });

    return {
      ok: true,
      user: loginCred.user.uid
    };

  } catch (err) {
    console.error("❌ Error en Auth Android:", err);
    return { ok: false, error: err };
  }
}

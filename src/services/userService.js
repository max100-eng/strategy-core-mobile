import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

/* ============================================================
   CREAR O ACTUALIZAR USUARIO DESPUÉS DE GOOGLE LOGIN
   ============================================================ */

export async function syncUserWithFirestore(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const userData = {
    uid: user.uid,
    name: user.displayName || "Jugador",
    email: user.email,
    avatar: user.photoURL || null,
    provider: "google",
    lastLogin: serverTimestamp(),
  };

  if (!snap.exists()) {
    // Crear usuario nuevo
    await setDoc(ref, {
      ...userData,
      createdAt: serverTimestamp(),
      settings: {
        sound: true,
        music: true,
        difficulty: "normal"
      },
      progress: {
        level: 1,
        xp: 0
      },
      inventory: {},
      stats: {
        wins: 0,
        losses: 0,
        matchesPlayed: 0
      }
    });

    console.log("🆕 Usuario creado en Firestore:", user.uid);
  } else {
    // Actualizar usuario existente
    await updateDoc(ref, {
      ...userData
    });

    console.log("🔄 Usuario actualizado en Firestore:", user.uid);
  }

  return userData;
}

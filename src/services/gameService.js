import { 
  db,
  auth
} from "../firebase";

import {
  doc,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

/* ============================================================
   USERS
   ============================================================ */

// Crear usuario nuevo
export async function createUserProfile(userId, data) {
  await setDoc(doc(db, "users", userId), {
    ...data,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    settings: {
      sound: true,
      music: true,
      difficulty: "normal"
    }
  });
}

// Obtener perfil de usuario
export async function getUserProfile(userId) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
}

// Actualizar ajustes del usuario
export async function updateUserSettings(userId, settings) {
  await updateDoc(doc(db, "users", userId), {
    settings,
    updatedAt: serverTimestamp()
  });
}

/* ============================================================
   GAMES
   ============================================================ */

// Crear partida nueva
export async function createGame(ownerId, mode = "classic") {
  const gameRef = await addDoc(collection(db, "games"), {
    ownerId,
    mode,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return gameRef.id;
}

// Añadir jugador a partida
export async function addPlayerToGame(gameId, userId) {
  await addDoc(collection(db, `games/${gameId}/players`), {
    userId,
    score: 0,
    joinedAt: serverTimestamp()
  });
}

// Registrar turno
export async function addTurn(gameId, turnData) {
  await addDoc(collection(db, `games/${gameId}/turns`), {
    ...turnData,
    createdAt: serverTimestamp()
  });
}

// Finalizar partida
export async function finishGame(gameId, winnerId) {
  await updateDoc(doc(db, "games", gameId), {
    status: "finished",
    winnerId,
    updatedAt: serverTimestamp()
  });
}

/* ============================================================
   LEADERBOARD
   ============================================================ */

export async function updateLeaderboard(userId, scoreDelta) {
  const ref = doc(db, "leaderboard", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      score: scoreDelta,
      wins: scoreDelta > 0 ? 1 : 0,
      losses: scoreDelta < 0 ? 1 : 0,
      updatedAt: serverTimestamp()
    });
  } else {
    const data = snap.data();
    await updateDoc(ref, {
      score: data.score + scoreDelta,
      wins: data.wins + (scoreDelta > 0 ? 1 : 0),
      losses: data.losses + (scoreDelta < 0 ? 1 : 0),
      updatedAt: serverTimestamp()
    });
  }
}

/* ============================================================
   ANALYTICS
   ============================================================ */

export async function logEvent(type, metadata = {}) {
  await addDoc(collection(db, "analytics"), {
    type,
    userId: auth.currentUser?.uid || "anonymous",
    metadata,
    createdAt: serverTimestamp()
  });
}

import { 
  addTurn,
  finishGame,
  updateLeaderboard,
  logEvent
} from "./gameService";

import { db } from "../firebase";
import { 
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

/* ============================================================
   GAME LOOP PRINCIPAL
   ============================================================ */

// Avanza al siguiente turno
export async function nextTurn(gameId) {
  const gameRef = doc(db, "games", gameId);
  const snap = await getDoc(gameRef);

  if (!snap.exists()) {
    throw new Error("La partida no existe");
  }

  const game = snap.data();

  // Si la partida ya terminó, no avanzar
  if (game.status === "finished") {
    console.warn("La partida ya está finalizada");
    return;
  }

  // Incrementar contador de turnos
  const newTurnNumber = (game.turnNumber || 0) + 1;

  await updateDoc(gameRef, {
    turnNumber: newTurnNumber,
    updatedAt: serverTimestamp()
  });

  // Registrar evento en analytics
  await logEvent("turn_advanced", { gameId, turn: newTurnNumber });

  console.log(`Turno ${newTurnNumber} avanzado correctamente`);
  return newTurnNumber;
}

/* ============================================================
   ACCIONES DEL JUGADOR
   ============================================================ */

// Acción genérica del jugador (mover, atacar, construir, etc.)
export async function playerAction(gameId, playerId, action, payload = {}) {
  // Registrar acción en subcolección "turns"
  await addTurn(gameId, {
    playerId,
    action,
    payload,
    timestamp: serverTimestamp()
  });

  // Registrar evento en analytics
  await logEvent("player_action", {
    gameId,
    playerId,
    action,
    payload
  });

  console.log(`Acción registrada: ${action}`);
}

/* ============================================================
   VALIDACIÓN DE ACCIONES
   ============================================================ */

export function validateAction(action, payload) {
  // Aquí puedes añadir reglas del juego
  // Ejemplo simple:
  const allowedActions = ["move", "attack", "defend", "build"];

  if (!allowedActions.includes(action)) {
    return { valid: false, reason: "Acción no permitida" };
  }

  return { valid: true };
}

/* ============================================================
   FINALIZAR PARTIDA
   ============================================================ */

export async function endGame(gameId, winnerId) {
  await finishGame(gameId, winnerId);

  // Actualizar leaderboard
  await updateLeaderboard(winnerId, +100);

  // Registrar evento
  await logEvent("match_end", { gameId, winnerId });

  console.log(`Partida ${gameId} finalizada. Ganador: ${winnerId}`);
}

/* ============================================================
   LOOP AUTOMÁTICO (OPCIONAL)
   ============================================================ */

// Ejecuta el loop automáticamente cada X segundos
export function startAutoLoop(gameId, intervalMs = 5000) {
  console.log(`Loop automático iniciado para partida ${gameId}`);

  const interval = setInterval(async () => {
    try {
      await nextTurn(gameId);
    } catch (err) {
      console.error("Error en loop automático:", err);
      clearInterval(interval);
    }
  }, intervalMs);

  return interval;
}

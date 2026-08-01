import { db } from "../firebase";
import {
  doc,
  collection,
  onSnapshot
} from "firebase/firestore";

/* ============================================================
   ESCUCHAR ESTADO DE LA PARTIDA
   ============================================================ */

// Escucha cambios en la partida (estado, turno, ganador, etc.)
export function listenGame(gameId, callback) {
  const ref = doc(db, "games", gameId);

  return onSnapshot(ref, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      console.warn("La partida ya no existe");
    }
  });
}

/* ============================================================
   ESCUCHAR JUGADORES DE LA PARTIDA
   ============================================================ */

// Escucha cambios en la lista de jugadores
export function listenPlayers(gameId, callback) {
  const ref = collection(db, `games/${gameId}/players`);

  return onSnapshot(ref, (snapshot) => {
    const players = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(players);
  });
}

/* ============================================================
   ESCUCHAR TURNOS DE LA PARTIDA
   ============================================================ */

// Escucha cambios en los turnos (acciones de jugadores)
export function listenTurns(gameId, callback) {
  const ref = collection(db, `games/${gameId}/turns`);

  return onSnapshot(ref, (snapshot) => {
    const turns = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(turns);
  });
}

/* ============================================================
   ESCUCHAR TODO EL ESTADO DEL JUEGO
   ============================================================ */

// Escucha partida + jugadores + turnos en un solo callback
export function listenFullGame(gameId, callback) {
  let gameState = {
    game: null,
    players: [],
    turns: []
  };

  const unsubGame = listenGame(gameId, (data) => {
    gameState.game = data;
    callback(gameState);
  });

  const unsubPlayers = listenPlayers(gameId, (players) => {
    gameState.players = players;
    callback(gameState);
  });

  const unsubTurns = listenTurns(gameId, (turns) => {
    gameState.turns = turns;
    callback(gameState);
  });

  // Devolver función para detener todos los listeners
  return () => {
    unsubGame();
    unsubPlayers();
    unsubTurns();
  };
}

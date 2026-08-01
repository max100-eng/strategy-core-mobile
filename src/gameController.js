import { 
  createGame, 
  addPlayerToGame 
} from "./services/gameService";

import { 
  nextTurn, 
  playerAction 
} from "./services/gameLoop";

import { 
  validateAction, 
  resolveAction, 
  checkVictory 
} from "./services/rulesEngine";

import { 
  resolveAttack 
} from "./services/combatSystem";

import { 
  generateMap, 
  getTile, 
  applyTerrainEffects 
} from "./services/mapService";

import { 
  findPathAStar 
} from "./services/pathfinding";

import { 
  listenFullGame 
} from "./services/syncService";

/* ============================================================
   CONTROLADOR PRINCIPAL DEL JUEGO
   ============================================================ */

export async function iniciarPartida() {
  console.log("Iniciando partida…");

  // 1. Crear partida en Firebase
  const gameId = await createGame("USER_123", "classic");
  await addPlayerToGame(gameId, "USER_123");
  await addPlayerToGame(gameId, "USER_456");

  console.log("Partida creada:", gameId);

  // 2. Generar mapa
  const map = generateMap(10);
  console.log("Mapa generado:", map);

  // 3. Escuchar estado completo del juego en tiempo real
  const stopSync = listenFullGame(gameId, (state) => {
    console.log("Estado sincronizado:", state);
  });

  // 4. Turno 1
  await nextTurn(gameId);

  /* ============================================================
     MOVIMIENTO DEL JUGADOR
     ============================================================ */

  const start = { x: 0, y: 0 };
  const goal = { x: 5, y: 7 };

  const path = findPathAStar(map, start, goal);
  console.log("Ruta encontrada:", path);

  // Simular movimiento paso a paso
  for (const step of path) {
    const tile = getTile(map, step.x, step.y);

    // Aplicar efectos del terreno
    let player = {
      id: "USER_123",
      hp: 100,
      defense: 5,
      speed: 3,
      position: { x: step.x, y: step.y }
    };

    player = applyTerrainEffects(player, tile);

    console.log(`Jugador movido a (${step.x}, ${step.y})`, player);

    // Registrar acción en Firebase
    await playerAction(gameId, "USER_123", "move", {
      direction: "path",
      position: step
    });
  }

  /* ============================================================
     COMBATE
     ============================================================ */

  const attacker = {
    id: "USER_123",
    baseDamage: 15,
    defense: 5,
    hp: 100,
    critChance: 0.1,
    critMultiplier: 2
  };

  const target = {
    id: "USER_456",
    defense: 3,
    hp: 80
  };

  const attackResult = resolveAttack(attacker, target, {
    baseDamage: attacker.baseDamage,
    weaponType: "heavy",
    ability: "power_strike"
  });

  console.log("Resultado del ataque:", attackResult);

  // Registrar acción de ataque
  await playerAction(gameId, "USER_123", "attack", attackResult);

  /* ============================================================
     REGLAS DE VICTORIA
     ============================================================ */

  const gameState = {
    players: [
      attacker,
      attackResult.target
    ]
  };

  const winner = checkVictory(gameState);

  if (winner) {
    console.log("Ganador detectado:", winner);
  }

  return {
    gameId,
    map,
    path,
    attackResult,
    winner
  };
}


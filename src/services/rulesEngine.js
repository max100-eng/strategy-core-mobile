/* ============================================================
   RULES ENGINE — MOTOR DE REGLAS DEL JUEGO
   ============================================================ */

/**
 * Valida si una acción es permitida según las reglas del juego.
 */
export function validateAction(action, payload) {
  const allowedActions = ["move", "attack", "defend", "build", "gather"];

  if (!allowedActions.includes(action)) {
    return { valid: false, reason: "Acción no permitida" };
  }

  // Validaciones específicas por tipo de acción
  switch (action) {
    case "move":
      return validateMove(payload);

    case "attack":
      return validateAttack(payload);

    case "defend":
      return { valid: true };

    case "build":
      return validateBuild(payload);

    case "gather":
      return validateGather(payload);

    default:
      return { valid: true };
  }
}

/* ============================================================
   VALIDACIONES ESPECÍFICAS
   ============================================================ */

function validateMove(payload) {
  if (!payload?.direction) {
    return { valid: false, reason: "Movimiento sin dirección" };
  }

  const allowedDirections = ["north", "south", "east", "west"];

  if (!allowedDirections.includes(payload.direction)) {
    return { valid: false, reason: "Dirección inválida" };
  }

  return { valid: true };
}

function validateAttack(payload) {
  if (!payload?.targetId) {
    return { valid: false, reason: "Ataque sin objetivo" };
  }

  if (payload.damage <= 0) {
    return { valid: false, reason: "Daño inválido" };
  }

  return { valid: true };
}

function validateBuild(payload) {
  if (!payload?.structure) {
    return { valid: false, reason: "Construcción sin tipo de estructura" };
  }

  const allowedStructures = ["tower", "wall", "farm", "barracks"];

  if (!allowedStructures.includes(payload.structure)) {
    return { valid: false, reason: "Estructura no permitida" };
  }

  return { valid: true };
}

function validateGather(payload) {
  if (!payload?.resource) {
    return { valid: false, reason: "Recolección sin recurso" };
  }

  const allowedResources = ["wood", "stone", "gold", "food"];

  if (!allowedResources.includes(payload.resource)) {
    return { valid: false, reason: "Recurso no permitido" };
  }

  return { valid: true };
}

/* ============================================================
   RESOLUCIÓN DE ACCIONES
   ============================================================ */

/**
 * Resuelve el efecto de una acción.
 * Aquí se aplican las reglas del juego.
 */
export function resolveAction(action, payload, gameState) {
  switch (action) {
    case "move":
      return resolveMove(payload, gameState);

    case "attack":
      return resolveAttack(payload, gameState);

    case "defend":
      return resolveDefend(payload, gameState);

    case "build":
      return resolveBuild(payload, gameState);

    case "gather":
      return resolveGather(payload, gameState);

    default:
      return gameState;
  }
}

function resolveMove(payload, gameState) {
  // Ejemplo simple: mover jugador en el mapa
  const { playerId, direction } = payload;

  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return gameState;

  const movement = {
    north: { y: +1 },
    south: { y: -1 },
    east: { x: +1 },
    west: { x: -1 }
  };

  const delta = movement[direction];

  player.position.x += delta.x || 0;
  player.position.y += delta.y || 0;

  return gameState;
}

function resolveAttack(payload, gameState) {
  const { playerId, targetId, damage } = payload;

  const target = gameState.players.find(p => p.id === targetId);
  if (!target) return gameState;

  target.hp -= damage;

  if (target.hp <= 0) {
    target.hp = 0;
    target.status = "defeated";
  }

  return gameState;
}

function resolveDefend(payload, gameState) {
  const { playerId } = payload;

  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return gameState;

  player.defense += 10;

  return gameState;
}

function resolveBuild(payload, gameState) {
  const { playerId, structure } = payload;

  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return gameState;

  player.structures.push({
    type: structure,
    createdAt: Date.now()
  });

  return gameState;
}

function resolveGather(payload, gameState) {
  const { playerId, resource, amount = 10 } = payload;

  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return gameState;

  player.resources[resource] = (player.resources[resource] || 0) + amount;

  return gameState;
}

/* ============================================================
   REGLAS DE VICTORIA
   ============================================================ */

export function checkVictory(gameState) {
  const alivePlayers = gameState.players.filter(p => p.status !== "defeated");

  if (alivePlayers.length === 1) {
    return alivePlayers[0].id; // ganador
  }

  return null;
}

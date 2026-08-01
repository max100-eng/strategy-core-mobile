/* ============================================================
   MAP SERVICE — SISTEMA DE MAPAS Y TERRENOS
   ============================================================ */

/**
 * Genera un mapa cuadrado con diferentes tipos de terreno.
 * Ideal para juegos de estrategia por turnos.
 */
export function generateMap(size = 10) {
  const terrainTypes = ["grass", "forest", "mountain", "water", "desert"];

  const map = [];

  for (let y = 0; y < size; y++) {
    const row = [];

    for (let x = 0; x < size; x++) {
      const terrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];

      row.push({
        x,
        y,
        terrain,
        obstacle: generateObstacle(terrain),
        bonus: generateBonus(terrain)
      });
    }

    map.push(row);
  }

  return map;
}

/* ============================================================
   OBSTÁCULOS SEGÚN TERRENO
   ============================================================ */

function generateObstacle(terrain) {
  const obstacles = {
    forest: ["tree", "bush", null],
    mountain: ["rock", "cliff", null],
    water: ["lake", "river", null],
    desert: ["dune", null],
    grass: [null]
  };

  const list = obstacles[terrain] || [null];
  return list[Math.floor(Math.random() * list.length)];
}

/* ============================================================
   BONIFICACIONES SEGÚN TERRENO
   ============================================================ */

function generateBonus(terrain) {
  const bonuses = {
    forest: { defense: +2 },
    mountain: { defense: +4, attack: +1 },
    water: { speed: -2 },
    desert: { speed: -1 },
    grass: { speed: +1 }
  };

  return bonuses[terrain] || {};
}

/* ============================================================
   OBTENER CELDA DEL MAPA
   ============================================================ */

export function getTile(map, x, y) {
  if (!map[y] || !map[y][x]) return null;
  return map[y][x];
}

/* ============================================================
   VALIDAR MOVIMIENTO EN EL MAPA
   ============================================================ */

export function canMoveTo(map, x, y) {
  const tile = getTile(map, x, y);
  if (!tile) return false;

  // No se puede mover a agua profunda
  if (tile.terrain === "water" && tile.obstacle === "lake") {
    return false;
  }

  // No se puede mover a montañas con acantilado
  if (tile.terrain === "mountain" && tile.obstacle === "cliff") {
    return false;
  }

  return true;
}

/* ============================================================
   APLICAR EFECTOS DEL TERRENO AL JUGADOR
   ============================================================ */

export function applyTerrainEffects(player, tile) {
  if (!tile || !tile.bonus) return player;

  const updated = { ...player };

  if (tile.bonus.defense) {
    updated.defense = (updated.defense || 0) + tile.bonus.defense;
  }

  if (tile.bonus.attack) {
    updated.attack = (updated.attack || 0) + tile.bonus.attack;
  }

  if (tile.bonus.speed) {
    updated.speed = (updated.speed || 0) + tile.bonus.speed;
  }

  return updated;
}

/* ============================================================
   GENERAR MAPAS PREDEFINIDOS (CAMPAÑA)
   ============================================================ */

export function generatePresetMap(type = "classic") {
  switch (type) {
    case "classic":
      return generateMap(10);

    case "desert_battle":
      return generateBiomeMap("desert", 12);

    case "forest_war":
      return generateBiomeMap("forest", 15);

    case "islands":
      return generateIslandsMap(12);

    default:
      return generateMap(10);
  }
}

/* ============================================================
   MAPAS ESPECIALES
   ============================================================ */

export function generateBiomeMap(biome, size) {
  const map = generateMap(size);

  return map.map(row =>
    row.map(tile => ({
      ...tile,
      terrain: biome,
      obstacle: generateObstacle(biome),
      bonus: generateBonus(biome)
    }))
  );
}

export function generateIslandsMap(size) {
  const map = generateMap(size);

  return map.map(row =>
    row.map(tile => {
      if (Math.random() < 0.4) {
        tile.terrain = "water";
        tile.obstacle = "lake";
        tile.bonus = generateBonus("water");
      }
      return tile;
    })
  );
}

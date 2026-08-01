/* ============================================================
   PATHFINDING — A*, Dijkstra y BFS para Strategy Core
   ============================================================ */

import { getTile, canMoveTo } from "./mapService";

/* ============================================================
   HEURÍSTICA (Distancia Manhattan)
   ============================================================ */

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/* ============================================================
   A* — Algoritmo de búsqueda óptima
   ============================================================ */

export function findPathAStar(map, start, goal) {
  const openSet = [];
  const cameFrom = new Map();

  const gScore = new Map();
  const fScore = new Map();

  const key = (p) => `${p.x},${p.y}`;

  gScore.set(key(start), 0);
  fScore.set(key(start), heuristic(start, goal));

  openSet.push(start);

  while (openSet.length > 0) {
    // Ordenar por menor fScore
    openSet.sort((a, b) => fScore.get(key(a)) - fScore.get(key(b)));

    const current = openSet.shift();

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current);
    }

    const neighbors = getNeighbors(map, current);

    for (const neighbor of neighbors) {
      const tentativeG = gScore.get(key(current)) + 1;

      if (tentativeG < (gScore.get(key(neighbor)) || Infinity)) {
        cameFrom.set(key(neighbor), current);
        gScore.set(key(neighbor), tentativeG);
        fScore.set(key(neighbor), tentativeG + heuristic(neighbor, goal));

        if (!openSet.find((p) => p.x === neighbor.x && p.y === neighbor.y)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return null; // No hay camino
}

/* ============================================================
   RECONSTRUIR CAMINO
   ============================================================ */

function reconstructPath(cameFrom, current) {
  const path = [current];
  const key = (p) => `${p.x},${p.y}`;

  while (cameFrom.has(key(current))) {
    current = cameFrom.get(key(current));
    path.unshift(current);
  }

  return path;
}

/* ============================================================
   VECINOS VÁLIDOS
   ============================================================ */

function getNeighbors(map, node) {
  const directions = [
    { x: 0, y: -1 }, // north
    { x: 0, y: 1 },  // south
    { x: -1, y: 0 }, // west
    { x: 1, y: 0 }   // east
  ];

  const neighbors = [];

  for (const d of directions) {
    const nx = node.x + d.x;
    const ny = node.y + d.y;

    if (canMoveTo(map, nx, ny)) {
      neighbors.push({ x: nx, y: ny });
    }
  }

  return neighbors;
}

/* ============================================================
   BFS — Camino más corto sin pesos
   ============================================================ */

export function findPathBFS(map, start, goal) {
  const queue = [start];
  const visited = new Set();
  const cameFrom = new Map();

  const key = (p) => `${p.x},${p.y}`;
  visited.add(key(start));

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current);
    }

    for (const neighbor of getNeighbors(map, current)) {
      const k = key(neighbor);

      if (!visited.has(k)) {
        visited.add(k);
        cameFrom.set(k, current);
        queue.push(neighbor);
      }
    }
  }

  return null;
}

/* ============================================================
   DIJKSTRA — Camino más corto con pesos
   ============================================================ */

export function findPathDijkstra(map, start, goal) {
  const dist = new Map();
  const cameFrom = new Map();
  const pq = [];

  const key = (p) => `${p.x},${p.y}`;

  dist.set(key(start), 0);
  pq.push({ node: start, cost: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { node } = pq.shift();

    if (node.x === goal.x && node.y === goal.y) {
      return reconstructPath(cameFrom, node);
    }

    for (const neighbor of getNeighbors(map, node)) {
      const terrainCost = getTerrainCost(map, neighbor);
      const newDist = dist.get(key(node)) + terrainCost;

      if (newDist < (dist.get(key(neighbor)) || Infinity)) {
        dist.set(key(neighbor), newDist);
        cameFrom.set(key(neighbor), node);
        pq.push({ node: neighbor, cost: newDist });
      }
    }
  }

  return null;
}

/* ============================================================
   COSTO SEGÚN TERRENO
   ============================================================ */

function getTerrainCost(map, tile) {
  const cell = getTile(map, tile.x, tile.y);

  if (!cell) return 999;

  const terrainCosts = {
    grass: 1,
    forest: 2,
    desert: 3,
    mountain: 4,
    water: 999 // casi imposible
  };

  return terrainCosts[cell.terrain] || 1;
}

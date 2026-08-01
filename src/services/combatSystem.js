/* ============================================================
   COMBAT SYSTEM — SISTEMA DE COMBATE AVANZADO
   ============================================================ */

/**
 * Calcula el daño final de un ataque considerando:
 * - ataque base
 * - defensa del objetivo
 * - crítico
 * - tipo de arma
 * - tipo de unidad
 * - modificadores especiales
 */
export function calculateDamage(attacker, target, attackData) {
  const {
    baseDamage,
    weaponType = "normal",
    ability = null
  } = attackData;

  let damage = baseDamage;

  /* ============================================================
     1. MODIFICADOR POR TIPO DE ARMA
     ============================================================ */

  const weaponModifiers = {
    normal: 1,
    heavy: 1.3,
    magic: 1.5,
    ranged: 1.2
  };

  damage *= weaponModifiers[weaponType] || 1;

  /* ============================================================
     2. DEFENSA DEL OBJETIVO
     ============================================================ */

  const defense = target.defense || 0;
  damage -= defense * 0.5; // defensa reduce daño parcialmente

  /* ============================================================
     3. CRÍTICO
     ============================================================ */

  const critChance = attacker.critChance || 0.1; // 10% por defecto
  const critMultiplier = attacker.critMultiplier || 2;

  const isCrit = Math.random() < critChance;

  if (isCrit) {
    damage *= critMultiplier;
  }

  /* ============================================================
     4. HABILIDADES ESPECIALES
     ============================================================ */

  if (ability) {
    damage = applyAbilityModifier(attacker, target, ability, damage);
  }

  /* ============================================================
     5. DAÑO MÍNIMO
     ============================================================ */

  if (damage < 1) damage = 1;

  return {
    damage: Math.round(damage),
    isCrit
  };
}

/* ============================================================
   HABILIDADES ESPECIALES
   ============================================================ */

function applyAbilityModifier(attacker, target, ability, damage) {
  switch (ability) {
    case "power_strike":
      return damage * 1.4;

    case "armor_break":
      target.defense = Math.max(0, target.defense - 10);
      return damage;

    case "life_steal":
      attacker.hp += damage * 0.3;
      return damage;

    case "double_hit":
      return damage * 2;

    case "fireball":
      return damage + 25;

    default:
      return damage;
  }
}

/* ============================================================
   APLICAR DAÑO AL OBJETIVO
   ============================================================ */

export function applyDamage(target, damageInfo) {
  const { damage, isCrit } = damageInfo;

  target.hp -= damage;

  if (target.hp <= 0) {
    target.hp = 0;
    target.status = "defeated";
  }

  return {
    target,
    damage,
    isCrit
  };
}

/* ============================================================
   RESOLVER ATAQUE COMPLETO
   ============================================================ */

export function resolveAttack(attacker, target, attackData) {
  const damageInfo = calculateDamage(attacker, target, attackData);
  const result = applyDamage(target, damageInfo);

  return {
    attacker,
    target: result.target,
    damage: result.damage,
    isCrit: result.isCrit
  };
}

/* ============================================================
   SISTEMA DE ARMADURAS
   ============================================================ */

export function equipArmor(player, armor) {
  const armorStats = {
    light: { defense: 5, speed: +2 },
    medium: { defense: 10, speed: 0 },
    heavy: { defense: 20, speed: -2 }
  };

  const stats = armorStats[armor] || armorStats.medium;

  player.defense = stats.defense;
  player.speed = (player.speed || 0) + stats.speed;

  return player;
}

/* ============================================================
   SISTEMA DE ARMAS
   ============================================================ */

export function equipWeapon(player, weapon) {
  const weaponStats = {
    sword: { baseDamage: 15, critChance: 0.1 },
    axe: { baseDamage: 20, critChance: 0.05 },
    bow: { baseDamage: 12, critChance: 0.15 },
    staff: { baseDamage: 10, critChance: 0.1, magic: true }
  };

  const stats = weaponStats[weapon] || weaponStats.sword;

  player.baseDamage = stats.baseDamage;
  player.critChance = stats.critChance;

  if (stats.magic) {
    player.magicPower = 20;
  }

  return player;
}

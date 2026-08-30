const unlocked = new Set<string>();

export async function unlockAchievementSafe(id: string) {
  if (!id) {
    console.warn("ID de logro vacío o inválido");
    return;
  }

  if (unlocked.has(id)) {
    console.info("Logro ya desbloqueado:", id);
    return;
  }

  try {
    console.info("Desbloqueando logro:", id);
    await (window as any).PGS.unlockAchievement({ id });
    unlocked.add(id);
  } catch (e) {
    console.error("Error desbloqueando logro:", id, e);
  }
}

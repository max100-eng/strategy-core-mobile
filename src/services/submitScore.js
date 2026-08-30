import { PGS } from "../plugins/PGS";

export async function submitScore(boardId, score) {
  try {
    await PGS.submitScore({ leaderboardID: boardId, score });
    console.log("Score sent:", boardId, score);
  } catch (e) {
    console.warn("Error sending score:", boardId, e);
  }
}

import { submitScore } from "./submitScore";

/**
 * Controlador central del Arcade Suite.
 * Cada juego llama a endArcadeGame() con sus datos reales.
 */
export function endArcadeGame(result) {

  switch (result.game) {

    case "snake":
      submitScore("snake_highscore", result.score);
      break;

    case "2048":
      submitScore("2048_best_tile", result.tile);
      break;

    case "tetris":
      submitScore("tetris_lines", result.lines);
      break;

    case "mines":
      submitScore("minesweeper_best_time", result.time);
      break;

    case "chess":
      submitScore("chess_elo", result.elo);
      break;

    case "go":
      submitScore("go_wins", result.wins);
      break;

    case "reversi":
      submitScore("reversi_wins", result.wins);
      break;

    default:
      console.warn("Juego no reconocido:", result.game);
  }
}

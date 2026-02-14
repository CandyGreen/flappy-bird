import { BirdComponent } from "~/components/bird";
import { GameComponent } from "~/components/game";
import { GameOverComponent } from "~/components/game-over";
import type { EntityId } from "~/core/entity";
import type { GameLoop } from "~/core/game-loop";
import type { System } from "~/core/system";
import type { World } from "~/core/world";
import { GameNotifier } from "~/utils/game-notifier";

/**
 * Reacts to game-ending conditions (like bird having a GameOverComponent)
 * and transitions the global game state to "gameOver".
 * It also centrally manages the game loop's start/stop based on GameComponent state.
 * (Note: GameLoop start/stop is now managed by GameManager, this system only reacts to game state changes)
 */
export class GameControllerSystem implements System {
  private world!: World;
  private gameEntityId: EntityId;
  private gameLoop: GameLoop; // Keep reference if needed for other checks, but not for start/stop
  private gameNotifier: GameNotifier;

  constructor(gameEntityId: EntityId, gameLoop: GameLoop, gameNotifier: GameNotifier) {
    this.gameEntityId = gameEntityId;
    this.gameLoop = gameLoop;
    this.gameNotifier = gameNotifier;
  }

  initialize(world: World): void {
    this.world = world;
    const game = this.world.getComponent(this.gameEntityId, GameComponent);

    if (game) {
      this.gameNotifier.updateValues(game.state, game.score);
    }
  }

  setGameEntityId(id: EntityId): void {
    this.gameEntityId = id;
  }

  update(): void {
    const game = this.world.getComponent(this.gameEntityId, GameComponent);

    if (!game) {
      console.error("GameComponent not found on game entity!");
      return;
    }

    // This system no longer directly controls gameLoop.start/stop.
    // That responsibility has moved to GameManager.
    // if (game.state === "running" && !this.gameLoop.isRunning) {
    //   this.gameLoop.start();
    //   console.log("GameControllerSystem: GameLoop started.");
    // } else if (game.state !== "running" && this.gameLoop.isRunning) {
    //   this.gameLoop.stop();
    //   console.log("GameControllerSystem: GameLoop stopped.");
    // }

    // If game is not running, we still need to check for game over conditions
    // and notify, but we don't return early.
    // if (game.state !== "running") {
    //   this.gameNotifier.updateValues(game.state, game.score);
    //   return;
    // }

    const birds = this.world.getEntitiesWith(BirdComponent, GameOverComponent);

    // Game over condition detected for the bird
    if (birds.length > 0) {
      game.state = "gameOver";
      this.gameLoop.stop(); // Stop the game loop on game over
      console.log("Game Over! Triggered by GameControllerSystem.");
    }

    // Always update the notifier with the latest game state and score
    this.gameNotifier.updateValues(game.state, game.score);
  }

  reset(): void {
    const game = this.world.getComponent(this.gameEntityId, GameComponent);
    if (game) {
      // On reset, ensure game state is set to "ready" or initial state
      game.state = "ready";
      // Clear any game over component from the bird if it exists
      const birdsWithGameOver = this.world.getEntitiesWith(BirdComponent, GameOverComponent);
      for (const birdId of birdsWithGameOver) {
        this.world.removeComponent(birdId, GameOverComponent);
      }
      console.log("GameControllerSystem: Reset completed.");
    }
  }
}

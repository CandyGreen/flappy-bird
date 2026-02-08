import { BirdComponent } from "~/components/bird";
import { GameComponent } from "~/components/game";
import { GameOverComponent } from "~/components/game-over";
import type { EntityId } from "~/core/entity";
import type { GameLoop } from "~/core/game-loop";
import type { System } from "~/core/system";
import type { World } from "~/core/world";

/**
 * Reacts to game-ending conditions (like bird having a GameOverComponent)
 * and transitions the global game state to "gameOver".
 */
export class GameControllerSystem implements System {
  private world!: World;
  private gameEntityId: EntityId;
  private gameLoop: GameLoop;

  constructor(gameEntityId: EntityId, gameLoop: GameLoop) {
    this.gameEntityId = gameEntityId;
    this.gameLoop = gameLoop;
  }

  initialize(world: World): void {
    this.world = world;
  }

  update(): void {
    const game = this.world.getComponent(this.gameEntityId, GameComponent);

    if (!game || game.state !== "running") {
      return; // Only process if the game is running
    }

    const birds = this.world.getEntitiesWith(BirdComponent, GameOverComponent);

    // Game over condition detected for the bird
    if (birds.length > 0) {
      game.state = "gameOver";
      this.gameLoop.stop();

      console.log("Game Over! Triggered by GameControllerSystem.");

      // Optional: Remove GameOverComponent from bird to prevent re-triggering
      // or to allow for a reset logic to re-add it.
      // this.world.removeComponent(birdWithGameOver[0], GameOverComponent);
    }
  }
}

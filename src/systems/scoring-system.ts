import { GameComponent } from "~/components/game";
import { PipeComponent } from "~/components/pipe";
import { PositionComponent } from "~/components/position";
import { ScoredComponent } from "~/components/scored";
import { SizeComponent } from "~/components/size";
import type { EntityId } from "~/core/entity";
import type { System } from "~/core/system";
import type { World } from "~/core/world";

/**
 * Handles scoring by detecting when the bird passes a pipe.
 */
export class ScoringSystem implements System {
  private world!: World;
  private gameEntityId: EntityId;
  private birdEntityId: EntityId;

  constructor(gameEntityId: EntityId, birdEntityId: EntityId) {
    this.gameEntityId = gameEntityId;
    this.birdEntityId = birdEntityId;
  }

  initialize(world: World): void {
    this.world = world;
  }

  update(): void {
    const game = this.world.getComponent(this.gameEntityId, GameComponent);

    if (!game || game.state !== "running") {
      return; // Only score if the game is running
    }

    const birdPosition = this.world.getComponent(this.birdEntityId, PositionComponent);
    const birdSize = this.world.getComponent(this.birdEntityId, SizeComponent);

    if (!birdPosition || !birdSize) {
      return; // Bird not found or missing components
    }

    // Get all active pipe entities that have not yet been scored
    const unscoredPipeEntities = this.world
      .getEntitiesWith(PipeComponent, PositionComponent, SizeComponent)
      .filter((pipeId) => !this.world.hasComponent(pipeId, ScoredComponent));

    for (const pipeId of unscoredPipeEntities) {
      const pipePosition = this.world.getComponent(pipeId, PositionComponent);
      const pipeSize = this.world.getComponent(pipeId, SizeComponent);

      if (pipePosition && pipeSize) {
        // Check if the bird has passed the pipe's X position.
        // The scoring point is usually when the bird's leading edge passes the pipe's trailing edge.
        // Or when the bird's *trailing* edge passes the pipe's *leading* edge.
        // Let's use bird's leading edge passes pipe's leading edge for simplicity.
        if (birdPosition.x > pipePosition.x + pipeSize.width) {
          game.score += 1;
          this.world.addComponent(pipeId, new ScoredComponent());
        }
      }
    }
  }
}

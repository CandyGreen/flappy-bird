import { BirdComponent } from "~/components/bird";
import { GameOverComponent } from "~/components/game-over";
import { PipeComponent } from "~/components/pipe";
import { PositionComponent } from "~/components/position";
import { SizeComponent } from "~/components/size";
import { VelocityComponent } from "~/components/velocity";
import { ViewportComponent } from "~/components/viewport";
import type { EntityId } from "~/core/entity";
import type { System } from "~/core/system";
import type { World } from "~/core/world";

/**
 * Handles collision detection and response.
 * It checks for collisions with the ground/ceiling and between the bird and pipes.
 * If a collision is detected, it adds a GameOverComponent to the bird.
 */
export class CollisionSystem implements System {
  private world!: World;
  private gameEntityId: EntityId;
  private viewport!: ViewportComponent;

  constructor(gameEntityId: EntityId) {
    this.gameEntityId = gameEntityId;
  }

  initialize(world: World): void {
    this.world = world;
    const viewport = this.world.getComponent(this.gameEntityId, ViewportComponent);

    if (viewport) {
      this.viewport = viewport;
    } else {
      console.error("ViewportComponent not found for CollisionSystem!");
      this.viewport = new ViewportComponent(0, 0); // Fallback
    }
  }

  update(): void {
    let collisionDetected = false;

    const birdEntities = this.world.getEntitiesWith(
      BirdComponent,
      PositionComponent,
      VelocityComponent,
      SizeComponent,
    );

    if (birdEntities.length === 0) {
      return; // No bird to check collisions for
    }

    const birdId = birdEntities[0]; // Assuming only one bird
    const birdPosition = this.world.getComponent(birdId, PositionComponent);
    const birdVelocity = this.world.getComponent(birdId, VelocityComponent);
    const birdSize = this.world.getComponent(birdId, SizeComponent);

    if (!birdPosition || !birdVelocity || !birdSize) {
      return; // Bird components missing
    }

    // Ground/Ceiling collision
    const groundY = this.viewport.height - birdSize.height;

    if (birdPosition.y > groundY) {
      birdPosition.y = groundY; // Place the bird exactly on the ground
      birdVelocity.y = 0; // Stop vertical movement
      collisionDetected = true;
    }
    if (birdPosition.y < 0) {
      birdPosition.y = 0;
      birdVelocity.y = 0;
      collisionDetected = true;
    }

    // Bird-Pipe collision
    const pipeEntities = this.world.getEntitiesWith(
      PipeComponent,
      PositionComponent,
      SizeComponent,
    );

    for (const pipeId of pipeEntities) {
      const pipePosition = this.world.getComponent(pipeId, PositionComponent);
      const pipeSize = this.world.getComponent(pipeId, SizeComponent);

      if (pipePosition && pipeSize) {
        if (
          this.isCollidingAABB(
            birdPosition.x,
            birdPosition.y,
            birdSize.width,
            birdSize.height,
            pipePosition.x,
            pipePosition.y,
            pipeSize.width,
            pipeSize.height,
          )
        ) {
          collisionDetected = true;
          break; // No need to check other pipes if one collision is found
        }
      }
    }

    if (collisionDetected && birdId !== undefined) {
      console.log("Game Over! Collision detected.");

      if (!this.world.hasComponent(birdId, GameOverComponent)) {
        this.world.addComponent(birdId, new GameOverComponent());
      }
    }
  }

  /**
   * Checks for AABB (Axis-Aligned Bounding Box) collision between two rectangles.
   * @param x1 X position of rect1 (top-left)
   * @param y1 Y position of rect1 (top-left)
   * @param w1 Width of rect1
   * @param h1 Height of rect1
   * @param x2 X position of rect2 (top-left)
   * @param y2 Y position of rect2 (top-left)
   * @param w2 Width of rect2
   * @param h2 Height of rect2
   * @returns True if rectangles are colliding, false otherwise.
   */
  private isCollidingAABB(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number,
  ): boolean {
    // Check if the rectangles overlap on the X axis
    if (x1 < x2 + w2 && x1 + w1 > x2) {
      // Check if the rectangles overlap on the Y axis
      if (y1 < y2 + h2 && y1 + h1 > y2) {
        return true; // Collision detected
      }
    }

    return false; // No collision
  }
}

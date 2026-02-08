import { PositionComponent } from "~/components/position";
import { VelocityComponent } from "~/components/velocity";
import type { System } from "~/core/system";
import type { World } from "~/core/world";

/**
 * Updates the position of entities based on their velocity.
 */
export class MovementSystem implements System {
  private world!: World; // Will be set in initialize

  initialize(world: World): void {
    this.world = world;
  }

  update(deltaTime: number): void {
    const entities = this.world.getEntitiesWith(PositionComponent, VelocityComponent);

    for (const entityId of entities) {
      const position = this.world.getComponent(entityId, PositionComponent);
      const velocity = this.world.getComponent(entityId, VelocityComponent);

      if (position && velocity) {
        position.x += velocity.x * deltaTime;
        position.y += velocity.y * deltaTime;
      }
    }
  }
}

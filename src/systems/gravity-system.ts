import { AffectedByGravityComponent } from "~/components/affected-by-gravity";
import { VelocityComponent } from "~/components/velocity";
import type { System } from "~/core/system";
import type { World } from "~/core/world";

export class GravitySystem implements System {
  private world!: World; // Will be set in initialize
  private gravity = 980; // Pixels per second squared

  initialize(world: World): void {
    this.world = world;
  }

  update(deltaTime: number): void {
    const entities = this.world.getEntitiesWith(VelocityComponent, AffectedByGravityComponent);

    for (const entityId of entities) {
      const velocity = this.world.getComponent(entityId, VelocityComponent);

      if (velocity) {
        // Apply gravity to the vertical velocity
        velocity.y += this.gravity * deltaTime;
      }
    }
  }
}

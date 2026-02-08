import { AffectedByGravityComponent } from "~/components/affected-by-gravity";
import { BirdComponent } from "~/components/bird";
import { PositionComponent } from "~/components/position";
import { SizeComponent } from "~/components/size";
import { SpriteComponent } from "~/components/sprite";
import { VelocityComponent } from "~/components/velocity";
import type { EntityId } from "~/core/entity";
import type { World } from "~/core/world";

/**
 * Creates and initializes a bird entity with all its relevant components.
 * @param world The game world to add the entity to.
 * @returns The ID of the newly created bird entity.
 */
export function createBird(world: World): EntityId {
  const birdEntityId = world.createEntity();

  world.addComponent(birdEntityId, new PositionComponent(100, 100));
  world.addComponent(birdEntityId, new SpriteComponent("blue"));
  world.addComponent(birdEntityId, new VelocityComponent(0, 0));
  world.addComponent(birdEntityId, new SizeComponent(30, 30));
  world.addComponent(birdEntityId, new AffectedByGravityComponent());
  world.addComponent(birdEntityId, new BirdComponent());

  return birdEntityId;
}

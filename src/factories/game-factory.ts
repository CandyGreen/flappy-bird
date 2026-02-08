import { GameComponent } from "~/components/game";
import type { EntityId } from "~/core/entity";
import type { World } from "~/core/world";

/**
 * Creates and initializes a dedicated entity for global game state.
 * @param world The game world to add the entity to.
 * @returns The ID of the newly created game state entity.
 */
export function createGame(world: World): EntityId {
  const gameEntityId = world.createEntity();

  world.addComponent(gameEntityId, new GameComponent("ready"));

  return gameEntityId;
}

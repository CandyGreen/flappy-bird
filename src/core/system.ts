import type { World } from "./world";

/**
 * Defines the lifecycle for all systems in the game.
 */
export interface System {
  /**
   * Called once when the game loop starts.
   * Ideal for setup, adding event listeners, and receiving a reference to the world.
   * @param world The game world.
   */
  initialize?(world: World): void;

  /**
   * Called on every frame for systems that need to perform continuous updates.
   * @param deltaTime The time elapsed since the last frame, in seconds.
   */
  update?(deltaTime: number): void;

  /**
   * Called once when the game loop stops.
   * Ideal for cleanup, such as removing event listeners.
   */
  destroy?(): void;
}

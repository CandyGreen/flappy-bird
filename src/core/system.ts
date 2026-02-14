import type { World } from "./world";

/**
 * Defines the lifecycle for all systems in the game.
 */
export interface System {
  /**
   * Called once when the game loop starts, during the first phase of initialization.
   * Ideal for basic setup, getting a world reference, and populating initial data into components.
   * @param world The game world.
   */
  initialize?(world: World): void;

  /**
   * Called once after all systems have completed their `initialize` phase.
   * Ideal for setup logic that depends on data that other systems have initialized.
   */
  postInitialize?(): void;

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

  /**
   * Called when the game is reset.
   * Ideal for clearing system-specific state for a new game round.
   */
  reset?(): void;
}

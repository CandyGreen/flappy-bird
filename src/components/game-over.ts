import type { Component } from "~/core/component";

/**
 * A marker component added to an entity (e.g., the bird) when a game-ending collision occurs.
 * This signals the GameControllerSystem to transition to the "Game Over" state.
 */
export class GameOverComponent implements Component {}

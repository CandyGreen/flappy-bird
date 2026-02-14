import type { Component } from "~/core/component";

export type GameState = "ready" | "running" | "gameOver";

/**
 * Component to hold the global game state.
 * It's usually attached to a dedicated "game" entity.
 */
export class GameComponent implements Component {
  public state: GameState;
  public score: number;

  constructor(initialState: GameState, initialScore: number = 0) {
    this.state = initialState;
    this.score = initialScore;
  }
}

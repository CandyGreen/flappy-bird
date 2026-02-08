import type { Component } from "~/core/component";

export type GameState = "ready" | "running" | "gameOver";

// Define a type for the state change callback
type GameStateChangeCallback = (newState: GameState, newScore: number) => void;

/**
 * Component to hold the global game state.
 * It's usually attached to a dedicated "game" entity.
 * Implements an observer pattern to notify subscribers of state/score changes.
 */
export class GameComponent implements Component {
  private _state: GameState;
  private _score: number;
  private subscribers: GameStateChangeCallback[] = [];

  constructor(initialState: GameState, initialScore: number = 0) {
    this._state = initialState;
    this._score = initialScore;
  }

  get state(): GameState {
    return this._state;
  }

  set state(newState: GameState) {
    if (this._state !== newState) {
      this._state = newState;
      this.notifySubscribers();
    }
  }

  get score(): number {
    return this._score;
  }

  set score(newScore: number) {
    if (this._score !== newScore) {
      this._score = newScore;
      this.notifySubscribers();
    }
  }

  /**
   * Subscribes a callback function to state/score changes.
   * @param callback The function to call when state or score changes.
   * @returns A function to unsubscribe.
   */
  subscribe(callback: GameStateChangeCallback): () => void {
    this.subscribers.push(callback);
    // Return an unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) =>
      callback(this._state, this._score),
    );
  }
}

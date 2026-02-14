import type { GameState } from "~/components/game";

type GameEventType = "state" | "score";

// Define the payload types for each event type
interface GameEventPayloads {
  state: GameState;
  score: number;
}

type Listener<T extends GameEventType> = (payload: GameEventPayloads[T]) => void;

export class GameNotifier {
  private currentState: GameState = "ready";
  private currentScore: number = 0;

  private stateListeners = new Set<Listener<"state">>();
  private scoreListeners = new Set<Listener<"score">>();

  getState(): GameState {
    return this.currentState;
  }

  getScore(): number {
    return this.currentScore;
  }

  subscribe<T extends GameEventType>(eventType: T, listener: Listener<T>): () => void {
    if (eventType === "state") {
      this.stateListeners.add(listener as Listener<"state">);
    } else if (eventType === "score") {
      this.scoreListeners.add(listener as Listener<"score">);
    }

    return () => this.unsubscribe(eventType, listener);
  }

  unsubscribe<T extends GameEventType>(eventType: T, listener: Listener<T>): void {
    if (eventType === "state") {
      this.stateListeners.delete(listener as Listener<"state">);
    } else if (eventType === "score") {
      this.scoreListeners.delete(listener as Listener<"score">);
    }
  }

  /**
   * Updates the internal game state and score, and notifies relevant subscribers
   * if the values have changed.
   * @param newState The new game state.
   * @param newScore The new score.
   */
  updateValues(newState: GameState, newScore: number): void {
    if (this.currentState !== newState) {
      this.currentState = newState;
      this.stateListeners.forEach((listener) => listener(this.currentState));
    }

    if (this.currentScore !== newScore) {
      this.currentScore = newScore;
      this.scoreListeners.forEach((listener) => listener(this.currentScore));
    }
  }
}

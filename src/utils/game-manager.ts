import type { GameState } from "~/components/game";
import { GameComponent } from "~/components/game";
import type { EntityId } from "~/core/entity";
import type { GameLoop } from "~/core/game-loop";
import type { World } from "~/core/world";
import { GameInitializer } from "./game-initializer";
import type { GameNotifier } from "~/utils/game-notifier";

type StateSubscriber = (newState: GameState) => void;
type ScoreSubscriber = (newScore: number) => void;

export class GameManager {
  private world: World;
  private gameEntityId!: EntityId; // Will be initialized by the initialize() method
  private gameLoop: GameLoop;
  private gameNotifier: GameNotifier;

  private gameInitializer: GameInitializer;

  constructor(
    world: World,
    gameLoop: GameLoop,
    gameNotifier: GameNotifier,
    gameInitializer: GameInitializer,
  ) {
    this.world = world;
    this.gameLoop = gameLoop;
    this.gameNotifier = gameNotifier;
    this.gameInitializer = gameInitializer;
  }

  initialize(): void {
    const { gameEntityId } = this.gameInitializer.initialize(
      this.world,
      this.gameLoop,
      this.gameNotifier,
    );

    this.gameEntityId = gameEntityId;

    console.log(`GameManager: Initialized with gameEntityId: ${this.gameEntityId}`);
  }

  startGame(): void {
    const game = this.world.getComponent(this.gameEntityId, GameComponent);

    if (!game) {
      console.error("GameComponent not found on game entity!");
      return;
    }

    if (game.state === "ready") {
      game.state = "running";
      this.gameLoop.start();
      console.log("GameManager: Game requested to start!");
    } else if (game.state === "gameOver") {
      this.restartGame();
    }
  }

  stopGame(): void {
    const game = this.world.getComponent(this.gameEntityId, GameComponent);

    if (!game) {
      console.error("GameComponent not found on game entity!");
      return;
    }

    if (game.state === "running") {
      this.gameLoop.stop();
      game.state = "ready";
      console.log("GameManager: Game requested to stop!");
    }
  }

  restartGame(): void {
    console.log("GameManager: Game restart requested.");

    this.gameLoop.stop();

    this.world.reset(this.gameEntityId);
    this.world.clearSystems();

    this.initialize();

    this.gameLoop.start();

    const game = this.world.getComponent(this.gameEntityId, GameComponent);

    if (game) {
      game.state = "running";
    } else {
      console.error("GameComponent not found after restart!");
    }
  }

  getState(): GameState {
    return this.gameNotifier.getState();
  }

  getScore(): number {
    return this.gameNotifier.getScore();
  }

  subscribeToState(subscriber: StateSubscriber): () => void {
    return this.gameNotifier.subscribe("state", subscriber);
  }

  subscribeToScore(subscriber: ScoreSubscriber): () => void {
    return this.gameNotifier.subscribe("score", subscriber);
  }
}

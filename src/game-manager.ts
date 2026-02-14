import type { GameState } from "./components/game";
import { GameComponent } from "./components/game";
import type { EntityId } from "./core/entity";
import type { GameLoop } from "./core/game-loop";
import type { World } from "./core/world";
import type { GameNotifier } from "./utils/game-notifier";
import { GameInitializer } from "./game-initializer"; // Import the GameInitializer class

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

  public initialize(): void {
    // Perform initial game world setup and get entity IDs
    const { gameEntityId } = this.gameInitializer.initialize(
      this.world,
      this.gameLoop,
      this.gameNotifier,
    );
    this.gameEntityId = gameEntityId;
    console.log(`GameManager: Initialized with gameEntityId: ${this.gameEntityId}`);
  }

  public startGame(): void {
    const game = this.world.getComponent(this.gameEntityId, GameComponent);
    if (!game) {
      console.error("GameComponent not found on game entity!");
      return;
    }

    if (game.state === "ready") {
      game.state = "running";
      this.gameLoop.start(); // Explicitly start game loop
      console.log("GameManager: Game requested to start!");
    } else if (game.state === "gameOver") {
      this.restartGame();
    }
  }

  public stopGame(): void {
    const game = this.world.getComponent(this.gameEntityId, GameComponent);
    if (!game) {
      console.error("GameComponent not found on game entity!");
      return;
    }

    if (game.state === "running") {
      this.gameLoop.stop(); // Explicitly stop game loop
      game.state = "ready";
      console.log("GameManager: Game requested to stop!");
    }
  }

  public restartGame(): void {
    console.log("GameManager: Game restart requested.");

    // 1. Stop the game loop
    this.gameLoop.stop();

    // 2. Reset the world (removes all entities except the game entity and calls reset on systems)
    this.world.reset(this.gameEntityId);
    this.world.clearSystems(); // Clear systems from world as they will be re-added by initializer

    // 3. Re-initialize the game world, creating new entities and systems
    this.initialize(); // Call the new initialize method

    // 4. Start the game loop (which will re-initialize systems via world.initialize)
    this.gameLoop.start();

    // 5. Set the GameComponent state to "running"
    const game = this.world.getComponent(this.gameEntityId, GameComponent);
    if (game) {
      game.state = "running";
    } else {
      console.error("GameComponent not found after restart!");
    }
  }

  public getState(): GameState {
    return this.gameNotifier.getState();
  }

  public getScore(): number {
    return this.gameNotifier.getScore();
  }

  public subscribeToState(subscriber: StateSubscriber): () => void {
    return this.gameNotifier.subscribe("state", subscriber);
  }

  public subscribeToScore(subscriber: ScoreSubscriber): () => void {
    return this.gameNotifier.subscribe("score", subscriber);
  }
}

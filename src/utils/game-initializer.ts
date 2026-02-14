import type { EntityId } from "~/core/entity";
import type { GameLoop } from "~/core/game-loop";
import type { System } from "~/core/system";
import { World } from "~/core/world";
import { CollisionSystem } from "~/systems/collision-system";
import { GameControllerSystem } from "~/systems/game-controller-system";
import { GravitySystem } from "~/systems/gravity-system";
import { InputSystem } from "~/systems/input-system";
import { MovementSystem } from "~/systems/movement-system";
import { PipeSpawnerSystem } from "~/systems/pipe-spawner-system";
import { RenderSystem } from "~/systems/render-system";
import { ScoringSystem } from "~/systems/scoring-system";
import type { GameNotifier } from "~/utils/game-notifier";

type EntityFactory = (world: World) => EntityId;

interface GameInitializationResult {
  gameEntityId: EntityId;
  birdEntityId: EntityId;
}

export class GameInitializer {
  private createBird: EntityFactory;
  private createGame: EntityFactory;

  constructor(createBird: EntityFactory, createGame: EntityFactory) {
    this.createBird = createBird;
    this.createGame = createGame;
  }

  initialize(
    world: World,
    gameLoop: GameLoop,
    gameNotifier: GameNotifier,
  ): GameInitializationResult {
    const birdEntityId = this.createBird(world);
    const gameEntityId = this.createGame(world);

    const systems: System[] = [
      new InputSystem(birdEntityId),
      new PipeSpawnerSystem(gameEntityId),
      new GravitySystem(),
      new MovementSystem(),
      new ScoringSystem(gameEntityId, birdEntityId),
      new CollisionSystem(gameEntityId),
      new GameControllerSystem(gameEntityId, gameLoop, gameNotifier),
      new RenderSystem(gameEntityId),
    ];

    for (const system of systems) {
      world.addSystem(system);
    }

    return { gameEntityId, birdEntityId };
  }
}

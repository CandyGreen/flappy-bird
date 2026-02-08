import { createRoot } from "react-dom/client";

import { GameLoop } from "~/core/game-loop";
import { World } from "~/core/world";
import { createBird } from "~/factories/bird-factory";
import { createGame } from "~/factories/game-factory";
import { CollisionSystem } from "~/systems/collision-system";
import { GameControllerSystem } from "~/systems/game-controller-system";
import { GravitySystem } from "~/systems/gravity-system";
import { InputSystem } from "~/systems/input-system";
import { MovementSystem } from "~/systems/movement-system";
import { PipeSpawnerSystem } from "~/systems/pipe-spawner-system";
import { RenderSystem } from "~/systems/render-system";
import { ScoringSystem } from "~/systems/scoring-system";

import { App } from "./app";
import "./index.css";

const world = new World();
const gameLoop = new GameLoop(world);

const birdEntityId = createBird(world);
const gameEntityId = createGame(world);

// Register systems in the order they should run
world.addSystem(new InputSystem(birdEntityId));
world.addSystem(new PipeSpawnerSystem());
world.addSystem(new GravitySystem());
world.addSystem(new MovementSystem());
world.addSystem(new ScoringSystem(gameEntityId, birdEntityId));
world.addSystem(new CollisionSystem());
world.addSystem(new GameControllerSystem(gameEntityId, gameLoop));
world.addSystem(new RenderSystem());

createRoot(document.getElementById("root")!).render(
  <App gameLoop={gameLoop} gameEntityId={gameEntityId} world={world} />,
);

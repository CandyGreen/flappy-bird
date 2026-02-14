import { createRoot } from "react-dom/client";

import { GameLoop } from "~/core/game-loop";
import { World } from "~/core/world";
import { createBird } from "~/factories/bird-factory";
import { createGame } from "~/factories/game-factory";
import { GameInitializer } from "~/utils/game-initializer";
import { GameManager } from "~/utils/game-manager";
import { GameNotifier } from "~/utils/game-notifier";

import { App } from "./app";
import "./index.css";

const world = new World();
const gameLoop = new GameLoop(world);

const gameNotifier = new GameNotifier();
const gameInitializer = new GameInitializer(createBird, createGame);
const gameManager = new GameManager(world, gameLoop, gameNotifier, gameInitializer);

gameManager.initialize();

createRoot(document.getElementById("root")!).render(<App gameManager={gameManager} />);

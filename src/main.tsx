import { createRoot } from "react-dom/client";

import { GameLoop } from "~/core/game-loop";
import { World } from "~/core/world";
import { createBird } from "~/factories/bird-factory";
import { createGame } from "~/factories/game-factory";
import { GameManager } from "~/game-manager";
import { GameInitializer } from "~/game-initializer"; // Import the GameInitializer class
import { GameNotifier } from "~/utils/game-notifier";

import { App } from "./app";
import "./index.css";

const world = new World();
const gameLoop = new GameLoop(world);
const gameNotifier = new GameNotifier();

// Instantiate the GameInitializer
const gameInitializer = new GameInitializer(createBird, createGame);

// Instantiate GameManager
const gameManager = new GameManager(
  world,
  gameLoop,
  gameNotifier,
  gameInitializer,
);

// Initialize the game manager, which in turn initializes the game world
gameManager.initialize();

createRoot(document.getElementById("root")!).render(<App gameManager={gameManager} />);

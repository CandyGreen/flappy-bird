import React, { useEffect, useRef, useState } from "react";

import { GameComponent, type GameState } from "~/components/game";
import type { EntityId } from "~/core/entity";
import type { GameLoop } from "~/core/game-loop";
import type { World } from "~/core/world";

interface AppProps {
  gameLoop: GameLoop;
  world: World;
  gameEntityId: EntityId;
}

export const App: React.FC<AppProps> = ({ gameLoop, world, gameEntityId }) => {
  const [currentGameState] = useState<GameState>("ready");
  const [currentScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameComponentRef = useRef<GameComponent>(null);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        console.log("Canvas context obtained.");
      }
    }
  }, []);

  // Effect to monitor game state and score from the ECS world via observer pattern
  // useEffect(() => {
  //   const gameComponent = world.getComponent(gameEntityId, GameComponent);

  //   if (!gameComponent) {
  //     console.error("GameComponent not found on game entity!");
  //     return;
  //   }

  //   gameComponentRef.current = gameComponent;

  //   const handleGameChange = (newState: GameState, newScore: number) => {
  //     console.group("GameChange Event");
  //     console.log("[newState]", newState);
  //     console.log("[newScore]", newScore);
  //     console.groupEnd();

  //     // Check if state actually changed before updating React state
  //     if (newState !== currentGameState) {
  //       setCurrentGameState(newState);

  //       if (newState === "gameOver") {
  //         gameLoop.stop();
  //       }
  //     }

  //     // Check if score actually changed before updating React state
  //     if (newScore !== currentScore) {
  //       setCurrentScore(newScore);
  //     }
  //   };

  //   // Subscribe to GameComponent changes
  //   const unsubscribe = gameComponent.subscribe(handleGameChange);

  //   // Initial sync
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setCurrentGameState(gameComponent.state);
  //   setCurrentScore(gameComponent.score);

  //   // Cleanup: unsubscribe when component unmounts or dependencies change
  //   return () => unsubscribe();
  // }, [world, gameEntityId, gameLoop]);

  useEffect(() => {
    const gameComponent = world.getComponent(gameEntityId, GameComponent);

    if (gameComponent) {
      gameComponent.state = "running"; // Use setter to trigger notification
      gameLoop.start();
      console.log("Game started!");
    }
  }, [world, gameLoop, gameEntityId]);

  const handleStartGame = () => {
    if (currentGameState === "ready") {
      gameComponentRef.current!.state = "running"; // Use setter to trigger notification
      gameLoop.start();
      console.log("Game started!");
    } else if (currentGameState === "gameOver") {
      handleRestartGame();
    }
  };

  const handleStopGame = () => {
    if (currentGameState === "running") {
      gameComponentRef.current!.state = "ready"; // Use setter to trigger notification
      gameLoop.stop();
      console.log("Game stopped.");
    }
  };

  const handleRestartGame = () => {
    // Reset game state and score in ECS using setters
    gameComponentRef.current!.state = "ready";
    gameComponentRef.current!.score = 0;
    gameLoop.stop(); // Stop current loop (this will call destroy on systems)

    // TODO: A proper game restart involves clearing/resetting entities and components.
    // For now, we'll re-create the world entirely for simplicity on restart.
    // This is NOT ideal for large games but works for this prototype.
    // A better approach would be to have a reset method on the World or specific systems.
    // For example, each system could have a `reset()` method called by the world.
    window.location.reload(); // Hard refresh for simplicity to reset everything

    // // Example of soft reset (more complex)
    // world.clearEntities(); // You'd need a method to clear all entities or reset them
    // // Re-add initial entities like the bird
    // // gameLoop.start();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="mb-8 text-4xl font-bold">Flappy Bird ECS</h1>
      <canvas ref={canvasRef} width={800} height={600} className="mb-8 border-2 border-white" />

      <div className="flex space-x-4">
        {currentGameState === "ready" && (
          <button
            onClick={handleStartGame}
            className="focus:ring-opacity-75 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            Start Game
          </button>
        )}

        {currentGameState === "running" && (
          <button
            onClick={handleStopGame}
            className="focus:ring-opacity-75 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
          >
            Stop Game
          </button>
        )}

        {currentGameState === "gameOver" && (
          <button
            onClick={handleRestartGame}
            className="focus:ring-opacity-75 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Restart Game
          </button>
        )}
      </div>

      {(currentGameState === "running" || currentGameState === "gameOver") && (
        <p className="mt-4 text-2xl font-bold">Score: {currentScore}</p>
      )}

      {currentGameState === "gameOver" && (
        <p className="mt-2 text-2xl font-bold text-red-500">GAME OVER!</p>
      )}
    </div>
  );
};

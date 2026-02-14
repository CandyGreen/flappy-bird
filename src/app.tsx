import React, { useEffect, useRef, useState } from "react";

import type { GameState } from "~/components/game";
import { GameManager } from "~/game-manager"; // Import GameManager

interface AppProps {
  gameManager: GameManager; // Accept GameManager as prop
}

export const App: React.FC<AppProps> = ({ gameManager }) => { // Destructure gameManager
  const [currentGameState, setCurrentGameState] = useState<GameState>(gameManager.getState());
  const [currentScore, setCurrentScore] = useState(gameManager.getScore());

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      // In a real game, you might want to adjust canvas resolution for pixel perfect rendering.
      // For this example, we'll keep it simple.
      const ctx = canvas.getContext("2d");

      if (ctx) {
        console.log("Canvas context obtained.");
      }
    }
  }, []);

  // Effect to monitor game state and score from the ECS world via GameNotifier (now via GameManager)
  useEffect(() => {
    const unsubscribeState = gameManager.subscribeToState((newState) => {
      console.log("[GameManager] State changed:", newState);
      setCurrentGameState(newState);
    });

    const unsubscribeScore = gameManager.subscribeToScore((newScore) => {
      console.log("[GameManager] Score changed:", newScore);
      setCurrentScore(newScore);
    });

    return () => {
      unsubscribeState();
      unsubscribeScore();
    };
  }, [gameManager]);

  const handleStartGame = () => {
    gameManager.startGame(); // Use GameManager method
  };

  const handleStopGame = () => {
    gameManager.stopGame(); // Use GameManager method
  };

  const handleRestartGame = () => {
    gameManager.restartGame(); // Use GameManager method
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="mb-4 space-y-4 text-center">
        <h1 className="text-2xl font-bold">Flappy Bird (ECS)</h1>
        <p className="font-bold">Score: {currentScore}</p>
      </div>

      <div className="relative mb-8">
        <canvas ref={canvasRef} width={800} height={600} className="border-2 border-white" />

        {currentGameState === "gameOver" && (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-4xl font-bold text-red-500">
            GAME OVER
          </p>
        )}
      </div>

      <div className="flex space-x-4">
        {currentGameState === "ready" && (
          <button
            onClick={handleStartGame}
            className="focus:ring-opacity-75 cursor-pointer rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            Start Game
          </button>
        )}

        {currentGameState === "running" && (
          <button
            onClick={handleStopGame}
            className="focus:ring-opacity-75 cursor-pointer rounded-lg bg-red-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
          >
            Stop Game
          </button>
        )}

        {currentGameState === "gameOver" && (
          <button
            onClick={handleRestartGame}
            className="focus:ring-opacity-75 cursor-pointer rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Restart Game
          </button>
        )}
      </div>
    </div>
  );
};

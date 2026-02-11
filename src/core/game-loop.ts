import { World } from "~/core/world";

export class GameLoop {
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private boundGameLoop: (currentTime: number) => void;

  constructor(private world: World) {
    this.boundGameLoop = this.gameLoop.bind(this);
  }

  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();

      // Initialize all systems in the world
      this.world.initialize();

      this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
    }
  }

  stop(): void {
    if (this.isRunning) {
      this.isRunning = false;

      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // Destroy all systems in the world
      this.world.destroy();
    }
  }

  private gameLoop(currentTime: number): void {
    if (!this.isRunning) {
      return;
    }

    const deltaTime = (currentTime - this.lastTime) / 1000; // Delta time in seconds
    this.lastTime = currentTime;

    if (deltaTime > 0.012) {
      console.group("Game Loop");
      console.log("[deltaTime]", deltaTime);
      console.groupEnd();
    }

    // Update game state
    this.world.update(deltaTime);

    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
  }
}

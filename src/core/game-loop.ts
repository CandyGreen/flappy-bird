import { World } from "~/core/world";

export class GameLoop {
  private lastTime: number = 0;
  private _isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private boundGameLoop: (currentTime: number) => void;

  constructor(private world: World) {
    this.boundGameLoop = this.gameLoop.bind(this);
  }

  get isRunning(): boolean {
    return this._isRunning;
  }

  start(): void {
    if (!this._isRunning) {
      this._isRunning = true;
      this.lastTime = performance.now();

      // Initialize all systems in the world (first phase)
      this.world.initialize();
      // Post-initialize all systems (second phase)
      this.world.postInitialize();

      this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
    }
  }

  stop(): void {
    if (!this._isRunning) {
      return;
    }

    this._isRunning = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Destroy all systems in the world
    this.world.destroy();
  }

  private gameLoop(currentTime: number): void {
    if (!this._isRunning) {
      return;
    }

    const deltaTime = (currentTime - this.lastTime) / 1000; // Delta time in seconds
    this.lastTime = currentTime;

    // Optional: Log deltaTime if it's unusually large (e.g., after a tab switch)
    if (deltaTime > 0.1) {
      console.warn(
        "Large deltaTime detected:",
        deltaTime,
        "s. Skipping frame to prevent physics glitches.",
      );
      this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
      return;
    }

    // Update game state
    this.world.update(deltaTime);

    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
  }
}

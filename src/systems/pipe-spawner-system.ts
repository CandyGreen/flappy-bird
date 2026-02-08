import { PipeComponent } from "~/components/pipe";
import { PositionComponent } from "~/components/position";
import { SizeComponent } from "~/components/size";
import { SpriteComponent } from "~/components/sprite";
import { VelocityComponent } from "~/components/velocity";
import type { System } from "~/core/system";
import type { World } from "~/core/world";

export class PipeSpawnerSystem implements System {
  private world!: World;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private pipeWidth = 80;
  private pipeGapHeight = 200; // Vertical gap
  private pipeSpeed = 150; // pixels per second
  private spawnInterval = 2.5; // seconds between pipe pairs
  private timeSinceLastSpawn = 0;

  private minPipeHeight = 50; // Minimum height for top or bottom pipe
  private maxPipeHeight!: number; // Calculated in initialize

  private pipeColor = "green";

  initialize(world: World): void {
    this.world = world;
    const canvas = document.querySelector("canvas");

    if (canvas) {
      this.canvasWidth = canvas.width;
      this.canvasHeight = canvas.height;
      this.maxPipeHeight = this.canvasHeight - this.pipeGapHeight - this.minPipeHeight;
    } else {
      console.error("Canvas element not found for PipeSpawnerSystem!");
      this.canvasWidth = 0;
      this.canvasHeight = 0;
      this.maxPipeHeight = 0;
    }
  }

  update(deltaTime: number): void {
    this.timeSinceLastSpawn += deltaTime;

    // Spawn new pipes
    if (this.timeSinceLastSpawn >= this.spawnInterval) {
      this.spawnPipePair();
      this.timeSinceLastSpawn = 0;
    }

    // Remove off-screen pipes
    const pipeEntities = this.world.getEntitiesWith(
      PipeComponent,
      PositionComponent,
      SizeComponent,
    );

    for (const entityId of pipeEntities) {
      const position = this.world.getComponent(entityId, PositionComponent);
      const size = this.world.getComponent(entityId, SizeComponent);

      if (position && size) {
        if (position.x + size.width < 0) {
          this.world.removeEntity(entityId);
        }
      }
    }
  }

  private spawnPipePair(): void {
    // Random height for the top pipe
    const topPipeHeight =
      Math.random() * (this.maxPipeHeight - this.minPipeHeight) + this.minPipeHeight;
    const bottomPipeHeight = this.canvasHeight - topPipeHeight - this.pipeGapHeight;

    // Top Pipe
    const topPipeId = this.world.createEntity();
    this.world.addComponent(topPipeId, new PositionComponent(this.canvasWidth, 0));
    this.world.addComponent(topPipeId, new SizeComponent(this.pipeWidth, topPipeHeight));
    this.world.addComponent(topPipeId, new SpriteComponent(this.pipeColor));
    this.world.addComponent(topPipeId, new VelocityComponent(-this.pipeSpeed, 0));
    this.world.addComponent(topPipeId, new PipeComponent());

    // Bottom Pipe
    const bottomPipeId = this.world.createEntity();
    this.world.addComponent(
      bottomPipeId,
      new PositionComponent(this.canvasWidth, topPipeHeight + this.pipeGapHeight),
    );
    this.world.addComponent(bottomPipeId, new SizeComponent(this.pipeWidth, bottomPipeHeight));
    this.world.addComponent(bottomPipeId, new SpriteComponent(this.pipeColor));
    this.world.addComponent(bottomPipeId, new VelocityComponent(-this.pipeSpeed, 0));
    this.world.addComponent(bottomPipeId, new PipeComponent());
  }
}

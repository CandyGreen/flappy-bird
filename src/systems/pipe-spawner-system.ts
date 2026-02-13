import { PipeComponent } from "~/components/pipe";
import { PositionComponent } from "~/components/position";
import { SizeComponent } from "~/components/size";
import { SpriteComponent } from "~/components/sprite";
import { VelocityComponent } from "~/components/velocity";
import { ViewportComponent } from "~/components/viewport";
import type { EntityId } from "~/core/entity";
import type { System } from "~/core/system";
import type { World } from "~/core/world";

export class PipeSpawnerSystem implements System {
  private world!: World;
  private gameEntityId: EntityId;
  private viewport!: ViewportComponent;

  private pipeWidth = 80;
  private pipeGapHeight = 200; // Vertical gap
  private pipeSpeed = 150; // pixels per second
  private spawnInterval = 2.5; // seconds between pipe pairs
  private timeSinceLastSpawn = 0;

  private minPipeHeight = 50; // Minimum height for top or bottom pipe
  private maxPipeHeight!: number; // Calculated in postInitialize

  private pipeColor = "green";

  constructor(gameEntityId: EntityId) {
    this.gameEntityId = gameEntityId;
  }

  initialize(world: World): void {
    this.world = world;
    const viewport = this.world.getComponent(this.gameEntityId, ViewportComponent);

    if (viewport) {
      this.viewport = viewport;
    } else {
      console.error("ViewportComponent not found for PipeSpawnerSystem!");
      this.viewport = new ViewportComponent(0, 0); // Fallback
    }
  }

  postInitialize(): void {
    if (this.viewport && this.viewport.height > 0) {
      this.maxPipeHeight = this.viewport.height - this.pipeGapHeight - this.minPipeHeight;
    } else {
      console.error("Viewport not initialized for PipeSpawnerSystem in postInitialize!");
      this.maxPipeHeight = 0; // Fallback
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
    const bottomPipeHeight = this.viewport.height - topPipeHeight - this.pipeGapHeight;

    // Top Pipe
    const topPipeId = this.world.createEntity();
    this.world.addComponent(topPipeId, new PositionComponent(this.viewport.width, 0));
    this.world.addComponent(topPipeId, new SizeComponent(this.pipeWidth, topPipeHeight));
    this.world.addComponent(topPipeId, new SpriteComponent(this.pipeColor));
    this.world.addComponent(topPipeId, new VelocityComponent(-this.pipeSpeed, 0));
    this.world.addComponent(topPipeId, new PipeComponent());

    // Bottom Pipe
    const bottomPipeId = this.world.createEntity();
    this.world.addComponent(
      bottomPipeId,
      new PositionComponent(this.viewport.width, topPipeHeight + this.pipeGapHeight),
    );
    this.world.addComponent(bottomPipeId, new SizeComponent(this.pipeWidth, bottomPipeHeight));
    this.world.addComponent(bottomPipeId, new SpriteComponent(this.pipeColor));
    this.world.addComponent(bottomPipeId, new VelocityComponent(-this.pipeSpeed, 0));
    this.world.addComponent(bottomPipeId, new PipeComponent());
  }
}

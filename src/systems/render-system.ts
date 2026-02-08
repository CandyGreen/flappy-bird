import { PositionComponent } from "~/components/position";
import { SizeComponent } from "~/components/size";
import { SpriteComponent } from "~/components/sprite";
import type { System } from "~/core/system";
import type { World } from "~/core/world";
import { type CanvasContext, clearCanvas, drawEntity } from "~/utils/canvas";

export class RenderSystem implements System {
  private world!: World; // Will be set in initialize
  private canvasContext: CanvasContext | null = null;

  initialize(world: World): void {
    this.world = world;
    const canvas = document.querySelector("canvas");

    if (!canvas) {
      console.error("Canvas element not found!");
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Failed to get 2D context from canvas!");
      return;
    }

    this.canvasContext = { ctx };

    console.log("RenderSystem initialized with canvas context.");
  }

  update(): void {
    if (!this.canvasContext) {
      console.warn("Canvas context not available for RenderSystem. Skipping rendering.");
      return;
    }

    // Clear the canvas before drawing new frame
    clearCanvas(this.canvasContext);

    const entitiesToRender = this.world.getEntitiesWith(
      PositionComponent,
      SpriteComponent,
      SizeComponent,
    );

    for (const entityId of entitiesToRender) {
      drawEntity(entityId, this.world, this.canvasContext);
    }
  }
}

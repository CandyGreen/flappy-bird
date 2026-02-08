import { PositionComponent } from "~/components/position";
import { SizeComponent } from "~/components/size";
import { SpriteComponent } from "~/components/sprite";

export interface CanvasContext {
  ctx: CanvasRenderingContext2D;
}

export function drawEntity(
  entityId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  world: any, // TODO: Using 'any' for world here to avoid circular dependency for now.
  canvasContext: CanvasContext,
): void {
  const { ctx } = canvasContext;

  const position = world.getComponent(entityId, PositionComponent);
  const sprite = world.getComponent(entityId, SpriteComponent);
  const size = world.getComponent(entityId, SizeComponent);

  if (!position || !sprite || !size) {
    return; // Entity is missing a required component for drawing.
  }

  ctx.fillStyle = sprite.color;
  ctx.fillRect(position.x, position.y, size.width, size.height);
}

export function clearCanvas(canvasContext: CanvasContext): void {
  const { ctx } = canvasContext;

  // Clear the entire canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

import { VelocityComponent } from "~/components/velocity";
import type { EntityId } from "~/core/entity";
import type { System } from "~/core/system";
import type { World } from "~/core/world";

export class InputSystem implements System {
  private world!: World; // Will be set in initialize
  private playerEntityId: EntityId;
  private jumpStrength: number;

  private handleKeyDownBinding: (event: KeyboardEvent) => void;
  private handleMouseDownBinding: (event: MouseEvent) => void;

  constructor(playerEntityId: EntityId, jumpStrength = 350) {
    this.playerEntityId = playerEntityId;
    this.jumpStrength = jumpStrength;

    // Bind event listeners to the instance
    this.handleKeyDownBinding = this.handleKeyDown.bind(this);
    this.handleMouseDownBinding = this.handleMouseDown.bind(this);
  }

  initialize(world: World): void {
    this.world = world;

    document.addEventListener("keydown", this.handleKeyDownBinding);
    document.addEventListener("mousedown", this.handleMouseDownBinding);

    console.log("InputSystem initialized and listeners added.");
  }

  setPlayerEntityId(id: EntityId): void {
    this.playerEntityId = id;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.code === "Space") {
      this.performJump();
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    // Check if it's the main button (usually the left one)
    if (event.button === 0) {
      this.performJump();
    }
  }

  private performJump(): void {
    const velocity = this.world.getComponent(this.playerEntityId, VelocityComponent);

    if (velocity) {
      // Set vertical velocity to an upward value
      velocity.y = -this.jumpStrength;
    }
  }

  destroy(): void {
    document.removeEventListener("keydown", this.handleKeyDownBinding);
    document.removeEventListener("mousedown", this.handleMouseDownBinding);

    console.log("InputSystem destroyed and listeners removed.");
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Component, ComponentConstructor, ComponentMap } from "./component";
import type { EntityId } from "./entity";
import type { System } from "./system";

export class World {
  private nextEntityId: EntityId = 0;
  private entities = new Set<EntityId>();
  private components = new Map<EntityId, ComponentMap>();
  private systems: System[] = [];

  // Bitset-related properties
  private componentIdCounter: number = 0;
  private componentTypeToId: Map<ComponentConstructor<any>, number> = new Map();
  private entitySignatures: Map<EntityId, number> = new Map(); // EntityId -> bitmask

  // Helper to get or assign a unique ID to a component type
  private getComponentId(componentType: ComponentConstructor<any>): number {
    if (!this.componentTypeToId.has(componentType)) {
      // Assign an ID by shifting 1 left by componentIdCounter, then increment counter
      // Max 31 unique components for a standard 32-bit integer bitmask
      if (this.componentIdCounter >= 31) {
        console.warn("ECS: Too many unique component types registered. Bitmask might overflow.");
      }
      this.componentTypeToId.set(componentType, 1 << this.componentIdCounter++);
    }
    return this.componentTypeToId.get(componentType)!;
  }

  createEntity(): EntityId {
    const entityId = this.nextEntityId++;

    this.entities.add(entityId);
    this.components.set(entityId, {});
    this.entitySignatures.set(entityId, 0);

    return entityId;
  }

  removeEntity(entityId: EntityId): void {
    this.entities.delete(entityId);
    this.components.delete(entityId);
    this.entitySignatures.delete(entityId);
  }

  addComponent<T extends Component>(entityId: EntityId, component: T): void {
    if (!this.entities.has(entityId)) {
      console.warn(`Attempted to add component to non-existent entity: ${entityId}`);
      return;
    }

    const entityComponents = this.components.get(entityId);

    if (entityComponents) {
      entityComponents[component.constructor.name] = component;
      const componentId = this.getComponentId(component.constructor as ComponentConstructor<any>);
      this.entitySignatures.set(entityId, this.entitySignatures.get(entityId)! | componentId);
    }
  }

  getComponent<T extends Component>(
    entityId: EntityId,
    componentType: ComponentConstructor<T>,
  ): T | undefined {
    const entityComponents = this.components.get(entityId);

    return entityComponents ? (entityComponents[componentType.name] as T) : undefined;
  }

  // hasComponent now uses bitmasks
  hasComponent(entityId: EntityId, componentType: ComponentConstructor<Component>): boolean {
    const signature = this.entitySignatures.get(entityId);
    if (signature === undefined) return false;

    // We must ensure the component type is registered before getting its ID
    const componentId = this.componentTypeToId.get(componentType);
    if (componentId === undefined) {
      // If a component type is queried but never added to any entity, it won't have an ID
      // This is a valid scenario, so we treat it as not having the component.
      return false;
    }

    return (signature & componentId) === componentId;
  }

  removeComponent(entityId: EntityId, componentType: ComponentConstructor<Component>): void {
    const entityComponents = this.components.get(entityId);

    if (entityComponents) {
      delete entityComponents[componentType.name];
      // We must ensure the component type is registered before getting its ID
      const componentId = this.componentTypeToId.get(componentType);
      if (componentId !== undefined) {
        this.entitySignatures.set(entityId, this.entitySignatures.get(entityId)! & ~componentId); // Clear bit
      }
    }
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  getSystems(): System[] {
    return this.systems;
  }

  getEntitiesWith<T extends Component[]>(
    ...componentTypes: ComponentConstructor<T[number]>[]
  ): EntityId[] {
    // Generate query mask using bitsets
    let queryMask = 0;
    for (const type of componentTypes) {
      // Ensure all component types in the query are registered and have an ID
      const componentId = this.getComponentId(type);
      queryMask |= componentId;
    }

    const matchingEntities: EntityId[] = [];

    for (const entityId of this.entities) {
      const entitySignature = this.entitySignatures.get(entityId);

      // Use bitwise AND for fast filtering
      if (entitySignature !== undefined && (entitySignature & queryMask) === queryMask) {
        matchingEntities.push(entityId);
      }
    }

    return matchingEntities;
  }

  initialize(): void {
    for (const system of this.systems) {
      if (system.initialize) {
        system.initialize(this);
      }
    }
  }

  update(deltaTime: number): void {
    for (const system of this.systems) {
      if (system.update) {
        system.update(deltaTime);
      }
    }
  }

  destroy(): void {
    for (const system of this.systems) {
      if (system.destroy) {
        system.destroy();
      }
    }
  }
}

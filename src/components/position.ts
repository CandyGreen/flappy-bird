import type { Component } from "~/core/component";

export class PositionComponent implements Component {
  constructor(
    public x: number,
    public y: number,
  ) {}
}

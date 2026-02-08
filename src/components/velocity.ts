import type { Component } from "~/core/component";

export class VelocityComponent implements Component {
  constructor(
    public x: number,
    public y: number,
  ) {}
}

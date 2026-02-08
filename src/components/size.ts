import type { Component } from "~/core/component";

export class SizeComponent implements Component {
  constructor(
    public width: number,
    public height: number,
  ) {}
}

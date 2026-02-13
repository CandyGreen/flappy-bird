import type { Component } from "~/core/component";

export class ViewportComponent implements Component {
  constructor(
    public width: number = 0,
    public height: number = 0,
  ) {}
}

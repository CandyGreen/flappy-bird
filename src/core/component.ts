/* eslint-disable @typescript-eslint/no-explicit-any */
export type Component = Record<string, any>;

export type ComponentConstructor<T extends Component> = new (...args: any[]) => T;

export interface ComponentMap {
  [key: string]: Component;
}

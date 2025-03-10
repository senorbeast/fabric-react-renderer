/**
 * Type extensions for Fabric.js React components
 * Provides TypeScript support for JSX elements
 */
import { fabric } from "fabric";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: FabricElementProps<fabric.Object>;
    }
  }
}

type FabricElementProps<T extends fabric.Object> = React.PropsWithChildren<
  Partial<T> & {
    custom?: Record<string, any>;
    ref?: React.Ref<T>;
  } & FabricEvents<T>
>;

type FabricEvents<T extends fabric.Object> = {
  [K in keyof T as K extends `on${string}` ? K : never]?: T[K];
} & {
  [K in keyof fabric.CanvasEvents as `on${string}`]?: (
    event: fabric.IEvent
  ) => void;
};

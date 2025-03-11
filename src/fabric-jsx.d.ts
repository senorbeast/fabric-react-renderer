import * as fabric from "fabric";

// Define a type for constructors of fabric objects.
type FabricObjectConstructor = new (options?: any) => fabric.Object;

// Get keys that correspond to fabric object constructors.
type FabricObjectKeys = {
  [K in keyof typeof fabric]: (typeof fabric)[K] extends FabricObjectConstructor
    ? K
    : never;
}[keyof typeof fabric];

// Map the constructors to JSX intrinsic element types.
type FabricIntrinsicElements = {
  [K in FabricObjectKeys as Lowercase<K & string>]: Partial<
    InstanceType<(typeof fabric)[K]>
  > & {
    children?: React.ReactNode;
  };
};

// Augment the React namespace to include our Fabric elements.
declare global {
  namespace JSX {
    interface IntrinsicElements extends FabricIntrinsicElements {}
  }
}

// Augment React’s JSX namespace.
declare module "react" {
  namespace JSX {
    // This will merge with (and override conflicting) definitions.
    // If you are not using SVG in your project, this should work fine.
    interface IntrinsicElements extends FabricIntrinsicElements {}
  }
}

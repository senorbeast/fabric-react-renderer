import * as fabric from "fabric";

// Define a type for constructors of fabric objects.
type FabricObjectConstructor = new (options?: any) => fabric.Object;

// Get keys that correspond to fabric object constructors.
type FabricObjectKeys = {
  [K in keyof typeof fabric]: (typeof fabric)[K] extends FabricObjectConstructor
    ? K
    : never;
}[keyof typeof fabric];

// Map the constructors to JSX intrinsic element types with a fixed prefix.
// This produces keys like "fabric.rect", "fabric.circle", etc.
type FabricIntrinsicElements = {
  [K in FabricObjectKeys as `fabric.${Lowercase<K & string>}`]: Partial<
    InstanceType<(typeof fabric)[K]>
  > & { children?: React.ReactNode };
} & {
  [K in FabricObjectKeys as `fab.${Lowercase<K & string>}`]: Partial<
    InstanceType<(typeof fabric)[K]>
  > & { children?: React.ReactNode };
};

// Define the type for our proxy object. This makes properties like "triangle" available
// and their value will be a string in the form "fab.triangle".
type FabProxy = {
  [K in FabricObjectKeys as Lowercase<K & string>]: `fab.${Lowercase<
    K & string
  >}`;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends FabricIntrinsicElements {}
  }
}

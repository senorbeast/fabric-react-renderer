import * as fabric from "fabric";

// Get the constructor’s first argument type
type FirstArg<T> = T extends new (...args: infer P) => any ? P[0] : never;

// Extract key name if the first argument is required (non-object)
type FirstArgKey<T> = RequiresFirstArg<T> extends true
  ? keyof FirstArg<T>
  : never;

// Check if a class requires a first argument
type RequiresFirstArg<T> = FirstArg<T> extends undefined | object
  ? false
  : true;

// Define a type for constructors of fabric objects.
type FabricObjectConstructor = new (options?: any) => fabric.Object;

// Get keys that correspond to fabric object constructors.
type FabricObjectKeys = {
  [K in keyof typeof fabric]: (typeof fabric)[K] extends FabricObjectConstructor
    ? K
    : never;
}[keyof typeof fabric];

// Map the constructors to JSX intrinsic element types with a fixed prefix.
// This produces keys like "fab.rect", "fab.circle", etc.
// Define JSX intrinsic elements dynamically.
type FabricIntrinsicElements = {
  [K in FabricObjectKeys as `fab.${Lowercase<K & string>}`]: Partial<
    InstanceType<(typeof fabric)[K]>
  >;
} & {
  "fab.group": Partial<InstanceType<typeof fabric.Group>> & {
    children?: ReactNode;
  };
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

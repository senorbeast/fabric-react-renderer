import * as fabric from "fabric";

type Constructor<T> = new (...args: any[]) => T;

// Improved type extraction for constructor arguments
type FirstArg<T> = T extends new (arg: infer A, ...rest: any[]) => any
  ? A
  : never;
type SecondArg<T> = T extends new (
  arg: any,
  arg2: infer B,
  ...rest: any[]
) => any
  ? B
  : never;

// Determine if first argument is an options object
type IsOptionsObject<T> = T extends fabric.IObjectOptions
  ? true
  : T extends Record<string, any>
  ? true
  : false;

// Check if a class requires a non-object first argument
export type RequiresPrimitiveFirstArg<T> = FirstArg<Constructor<T>> extends
  | string
  | number
  | Array<any>
  ? true
  : false;

type FabricObjectConstructors = {
  [K in keyof typeof fabric]: (typeof fabric)[K] extends Constructor<fabric.Object>
    ? K
    : never;
}[keyof typeof fabric];

type FabricIntrinsicElements = {
  [K in FabricObjectConstructors as `fab.${Lowercase<K>}`]: RequiresPrimitiveFirstArg<
    InstanceType<(typeof fabric)[K]>
  > extends true
    ? {
        [P in keyof FirstArg<
          Constructor<InstanceType<(typeof fabric)[K]>>
        >]: FirstArg<Constructor<InstanceType<(typeof fabric)[K]>>>[P];
      } & Partial<InstanceType<(typeof fabric)[K]>> & {
          options?: SecondArg<Constructor<InstanceType<(typeof fabric)[K]>>>;
        }
    : Partial<InstanceType<(typeof fabric)[K]>>;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends FabricIntrinsicElements {}
  }
}

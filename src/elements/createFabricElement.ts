/**
 * Factory function to create React components for Fabric.js objects
 * Enables dynamic component creation and ref forwarding
 */
import React from "react";
import * as fabric from "fabric";

export function createFabricElement<T extends fabric.Object>(
  elementName: string,
  validate?: (props: any) => boolean
) {
  return React.forwardRef<T, React.PropsWithChildren<any>>((props, ref) => {
    React.useImperativeHandle(
      ref,
      () => {
        // Validate props if needed
        if (validate && !validate(props)) {
          throw new Error(`Invalid props for ${elementName}`);
        }
        return props as T;
      },
      [props]
    );

    return React.createElement(elementName, props);
  });
}

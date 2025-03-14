// fabricRenderer.ts
import Reconciler, { HostConfig } from "react-reconciler";
import * as fabric from "fabric";
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from "react-reconciler/constants";
import { mainGetParams } from "../getParams";

// Define our container type which wraps a Fabric.Canvas.
export interface FabricRoot {
  canvas: fabric.Canvas;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const constructorMainPropMap: Record<
  string,
  { mainProp: string; isArray?: boolean }
> = {
  Group: { mainProp: "objects", isArray: true },
  Text: { mainProp: "text" },
  IText: { mainProp: "text" },
  Textbox: { mainProp: "text" },
  Polyline: { mainProp: "points", isArray: true },
  Polygon: { mainProp: "points", isArray: true },
  Line: { mainProp: "points", isArray: true },
  Path: { mainProp: "path" },
  Image: { mainProp: "src" },
};
mainGetParams();

export type FabricElement = fabric.Object;
// Here we supply all 13 type arguments for HostConfig:
// 1. Type: our element names (string)
// 2. Props: any
// 3. Container: FabricRoot
// 4. Instance: FabricElement
// 5. TextInstance: never (we don't support text nodes)
// 6. SuspenseInstance: never
// 7. HydratableInstance: never
// 8. PublicInstance: FabricElement (same as instance)
// 9. HostContext: an empty object ({}), we don't use it here
// 10. UpdatePayload: any (we pass new props directly)
// 11. ChildSet: any
// 12. TimeoutHandle: number (from setTimeout)
// 13. NoTimeout: number
const hostConfig: HostConfig<
  string,
  any,
  FabricRoot,
  FabricElement,
  never,
  never,
  never,
  FabricElement,
  {},
  any,
  any,
  number,
  number
> = {
  supportsMutation: true,

  createInstance(
    type: string,
    props: any,
    rootContainer: FabricRoot,
    hostContext: {},
    internalInstanceHandle: any
  ): FabricElement {
    const [prefix, elementName] = type.split(".");
    if (prefix !== "fab") {
      throw new Error(`Invalid fabric element prefix: ${type}`);
    }

    const className = capitalize(elementName);

    const FabricClass = (fabric as any)[className];
    if (!FabricClass) {
      throw new Error(`Fabric.js class not found: ${className}`);
    }

    const config = constructorMainPropMap[className];

    if (config) {
      const { mainProp, isArray } = config;
      const mainValue = props[mainProp];

      if (mainValue === undefined) {
        throw new Error(`Missing required prop '${mainProp}' for ${className}`);
      }

      const { [mainProp]: _, ...options } = props;

      if (isArray && !Array.isArray(mainValue)) {
        throw new Error(`Prop '${mainProp}' must be an array for ${className}`);
      }

      return new FabricClass(mainValue, options);
    }

    // Handle normal object constructors
    return new FabricClass(props);
  },

  createTextInstance(
    text: string,
    rootContainer: FabricRoot,
    hostContext: {},
    internalInstanceHandle: any
  ): never {
    throw new Error("Text instances are not supported in Fabric renderer.");
  },

  appendInitialChild(
    parentInstance: FabricElement,
    child: FabricElement
  ): void {
    if (parentInstance instanceof fabric.Group) {
      parentInstance.add(child);
      parentInstance.dirty = true; // Mark group as needing re-render
      parentInstance.setCoords(); // Ensure correct positioning
    } else if (
      "add" in parentInstance &&
      typeof parentInstance.add === "function"
    ) {
      parentInstance.add(child);
    }
  },

  appendChild(
    parentInstance: FabricElement | FabricRoot,
    child: FabricElement
  ): void {
    if (parentInstance instanceof fabric.Group) {
      parentInstance.add(child);
      parentInstance.dirty = true;
      parentInstance.setCoords();
    } else if ("canvas" in parentInstance) {
      (parentInstance as FabricRoot).canvas.add(child);
    } else if (
      "add" in parentInstance &&
      typeof parentInstance.add === "function"
    ) {
      parentInstance.add(child);
    }
  },

  appendChildToContainer(container: FabricRoot, child: FabricElement): void {
    container.canvas.add(child);
  },

  removeChild(
    parentInstance: FabricElement | FabricRoot,
    child: FabricElement
  ): void {
    if (parentInstance instanceof fabric.Group) {
      parentInstance.remove(child);
      parentInstance.dirty = true;
      parentInstance.setCoords();
    } else if ("canvas" in parentInstance) {
      (parentInstance as FabricRoot).canvas.remove(child);
    } else if (
      "remove" in parentInstance &&
      typeof parentInstance.remove === "function"
    ) {
      parentInstance.remove(child);
    }
  },

  removeChildFromContainer(container: FabricRoot, child: FabricElement): void {
    container.canvas.remove(child);
  },

  insertBefore(
    parentInstance: FabricElement | FabricRoot,
    child: FabricElement,
    beforeChild: FabricElement
  ): void {
    // Fabric.js doesn't offer explicit ordering; simply add the child.
    if ("canvas" in parentInstance) {
      (parentInstance as FabricRoot).canvas.add(child);
    }
  },

  prepareUpdate(
    instance: FabricElement,
    type: string,
    oldProps: any,
    newProps: any,
    rootContainer: FabricRoot,
    hostContext: {}
  ): any {
    // For this simple example, return the new props as the update payload.
    return newProps;
  },

  commitUpdate(
    instance: FabricElement,
    updatePayload: any,
    type: string,
    oldProps: any,
    newProps: any,
    internalInstanceHandle: any
  ): void {
    instance.set(updatePayload);
    instance.setCoords();
  },

  commitTextUpdate(
    textInstance: never,
    oldText: string,
    newText: string
  ): void {
    // Not supported.
  },

  resetTextContent(instance: FabricElement): void {
    // Not supported.
  },

  finalizeInitialChildren(
    instance: FabricElement,
    type: string,
    props: any,
    rootContainer: FabricRoot,
    hostContext: {}
  ): boolean {
    return false;
  },

  getPublicInstance(instance: FabricElement): FabricElement {
    return instance;
  },

  prepareForCommit(containerInfo: FabricRoot): Record<string, any> | null {
    // No preparation needed—return null.
    return null;
  },

  resetAfterCommit(containerInfo: FabricRoot): void {
    containerInfo.canvas.renderAll();
  },

  shouldSetTextContent(type: string, props: any): boolean {
    return false;
  },

  clearContainer(container: FabricRoot): void {
    // Check if the underlying context exists before clearing.
    if (container.canvas.contextContainer) {
      container.canvas.clear();
    }
  },

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  getRootHostContext(rootContainerInstance: FabricRoot): {} {
    return {};
  },

  getChildHostContext(
    parentHostContext: {},
    type: string,
    rootContainerInstance: FabricRoot
  ): {} {
    return {};
  },

  supportsPersistence: false,
  supportsHydration: false,
  preparePortalMount: function (containerInfo: FabricRoot): void {},

  isPrimaryRenderer: false,
  getCurrentEventPriority: function (): Reconciler.Lane {
    return 0;
  },
  getInstanceFromNode: () => null,

  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},

  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,

  detachDeletedInstance: () => {},
  resolveUpdatePriority: (...args) => {
    console.log("resolveUpdatePriority", args);
    return DefaultEventPriority;
  },
  getCurrentUpdatePriority(...args) {
    console.log("getCurrentUpdatePriority", args);
    return DefaultEventPriority;
  },
  setCurrentUpdatePriority(...args) {
    console.log("setCurrentUpdatePriority", args);
    return DefaultEventPriority;
  },
  maySuspendCommit() {
    return false;
  },
};

// Create the reconciler instance.
const FabricReconciler = Reconciler(hostConfig);

// Export a render function that mounts the React element into the Fabric canvas.
export function render(element: any, canvas: fabric.Canvas): void {
  const container: FabricRoot = { canvas };
  const root = FabricReconciler.createContainer(
    container, // containerInfo
    1, // tag (e.g. LegacyRoot)
    null, // hydrationCallbacks
    false, // isStrictMode
    false, // concurrentUpdatesByDefaultOverride
    "", // identifierPrefix
    (error: Error) => {
      console.error(error);
    }, // onRecoverableError
    null // transitionCallbacks
  );
  FabricReconciler.updateContainer(element, root, null, () => null);
}

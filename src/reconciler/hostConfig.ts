// fabricRenderer.ts
import Reconciler, { HostConfig } from "react-reconciler";
import * as fabric from "fabric";
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
} from "react-reconciler/constants";

// Define our container type which wraps a Fabric.Canvas.
export interface FabricRoot {
  canvas: fabric.Canvas;
}

// Our instance type will be a Fabric.js object (we support only Rect for now).
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
    let instance: FabricElement;
    switch (type) {
      case "rect":
        instance = new fabric.Rect({
          left: props.left ?? 0,
          top: props.top ?? 0,
          fill: props.fill ?? "red",
          width: props.width ?? 100,
          height: props.height ?? 100,
          ...props, // pass any additional props
        });
        break;
      default:
        throw new Error(`Unknown element type: ${type}`);
    }
    return instance;
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
    if ("add" in parentInstance && typeof parentInstance.add === "function") {
      parentInstance.add(child);
    }
  },

  appendChild(
    parentInstance: FabricElement | FabricRoot,
    child: FabricElement
  ): void {
    if ("canvas" in parentInstance) {
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
    if ("canvas" in parentInstance) {
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
    container.canvas.clear();
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

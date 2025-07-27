import Reconciler from 'react-reconciler';
import type { HostConfig } from 'react-reconciler';
import * as fabric from 'fabric';
import { DefaultEventPriority } from 'react-reconciler/constants.js';

// Define our container type which wraps a Fabric.Canvas.
export interface FabricRoot {
  canvas: fabric.Canvas;
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

type FabricElement = fabric.Object;
type Props = Record<string, any>;
type UpdatePayload = Record<string, any>;

const hostConfig: HostConfig<
  string,
  Props,
  FabricRoot,
  FabricElement,
  never, // TextInstance
  never, // SuspenseInstance
  never, // HydratableInstance
  FabricElement, // PublicInstance
  object, // HostContext
  UpdatePayload,
  any, // ChildSet
  number, // TimeoutHandle
  number // NoTimeout
> = {
  createInstance(
    type: string,
    props: Props,
    rootContainer: FabricRoot,
    hostContext: object,
    internalInstanceHandle: any,
  ): FabricElement {
    const { instance, ...restProps } = props;
    if (instance) {
      instance.set(restProps);
      return instance;
    }

    const [prefix, elementName] = type.split('.');
    if (prefix !== 'fab') {
      throw new Error(`Invalid fabric element prefix: ${type}. Must be 'fab'.`);
    }
    if (!elementName) {
      throw new Error(`Invalid fabric element name: ${type}.`);
    }

    const className = capitalize(elementName);
    const FabricClass = (fabric as any)[className];

    if (!FabricClass) {
      throw new Error(`Fabric.js class not found: ${className}`);
    }

    return new FabricClass(restProps);
  },

  createTextInstance(): never {
    throw new Error('Text instances are not supported in Fabric renderer.');
  },

  appendInitialChild(
    parentInstance: FabricElement,
    child: FabricElement,
  ): void {
    if (parentInstance instanceof fabric.Group) {
      parentInstance.add(child);
    }
  },

  appendChild(
    parentInstance: FabricElement | FabricRoot,
    child: FabricElement,
  ): void {
    if ('canvas' in parentInstance) {
      parentInstance.canvas.add(child);
    } else if (parentInstance instanceof fabric.Group) {
      parentInstance.add(child);
    }
  },

  appendChildToContainer(container: FabricRoot, child: FabricElement): void {
    container.canvas.add(child);
  },

  removeChild(
    parentInstance: FabricElement | FabricRoot,
    child: FabricElement,
  ): void {
    if ('canvas' in parentInstance) {
      parentInstance.canvas.remove(child);
    } else if (parentInstance instanceof fabric.Group) {
      parentInstance.remove(child);
    }
  },

  removeChildFromContainer(container: FabricRoot, child: FabricElement): void {
    container.canvas.remove(child);
  },

  insertBefore(
    parentInstance: FabricElement | FabricRoot,
    child: FabricElement,
    beforeChild: FabricElement,
  ): void {
    const container = 'canvas' in parentInstance ? parentInstance.canvas : parentInstance;
    if (container instanceof fabric.Group || container instanceof fabric.Canvas) {
      const index = container.getObjects().indexOf(beforeChild);
      if (index !== -1) {
        container.insertAt(index, child);
      } else {
        container.add(child);
      }
    }
  },

  prepareUpdate(
    instance: FabricElement,
    type: string,
    oldProps: Props,
    newProps: Props,
  ): UpdatePayload | null {
    const payload: UpdatePayload = {};
    for (const key in newProps) {
      if (key !== 'children' && newProps[key] !== oldProps[key]) {
        payload[key] = newProps[key];
      }
    }
    return Object.keys(payload).length > 0 ? payload : null;
  },

  commitUpdate(
    instance: FabricElement,
    updatePayload: UpdatePayload,
  ): void {
    instance.set(updatePayload);
    instance.setCoords();
  },

  commitTextUpdate(): void {
    // Not supported.
  },

  resetTextContent(): void {
    // Not supported.
  },

  finalizeInitialChildren(): boolean {
    return true;
  },

  getPublicInstance(instance: FabricElement): FabricElement {
    return instance;
  },

  prepareForCommit(): Record<string, any> | null {
    return null;
  },

  resetAfterCommit(containerInfo: FabricRoot): void {
    // Batch renders for better performance
    requestAnimationFrame(() => containerInfo.canvas.renderAll());
  },

  shouldSetTextContent(): boolean {
    return false;
  },

  clearContainer(container: FabricRoot): void {
    if (container.canvas.contextContainer) {
      container.canvas.clear();
    }
  },

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  getRootHostContext() {
    return {};
  },

  getChildHostContext() {
    return {};
  },

  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: false,

  getCurrentEventPriority: () => DefaultEventPriority,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,
  detachDeletedInstance: () => {},
};

export const FabricReconciler = Reconciler(hostConfig);

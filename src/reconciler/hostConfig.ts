import * as fabric from "fabric";
import { HostConfig } from "react-reconciler";

type Container = fabric.Canvas | fabric.Group;
type Instance = fabric.Object;
type Props = Record<string, any>;
type TextInstance = never;

type UpdatePayload = Record<string, any>;

type PublicInstance = Instance;
type TimeoutHandle = number;
type NoTimeout = number;

type HostContext = {};

type HostConfigType = HostConfig<
  string,
  Props,
  Container,
  Instance,
  TextInstance,
  never,
  never,
  Instance,
  PublicInstance,
  NoTimeout,
  TimeoutHandle,
  () => TimeoutHandle,
  () => void
>;

const hostConfig: HostConfigType = {
  supportsMutation: true,

  createInstance: (type: string, props: Props, rootContainer: Container) => {
    const className = type[0].toUpperCase() + type.slice(1);
    const FabricClass = (fabric as any)[className] as new (
      props: any
    ) => Instance;

    if (!FabricClass) {
      throw new Error(`Fabric.js class not found for type: ${type}`);
    }

    const instance = new FabricClass(props);

    // Object.entries(props).forEach(([key, value]) => {
    //   if (typeof value === "function" && key.startsWith("on")) {
    //     const eventName = key[2].toLowerCase() + key.slice(3);
    //     instance.on(eventName as keyof fabric.ObjectEvents, (e: fabric.TEvent) =>
    //       (value as (e: fabric.TEvent) => void)(e)
    //     );
    //   }
    // });

    if (props.custom) {
      Object.assign(instance, props.custom);
    }

    return instance;
  },

  appendChild: (parentInstance: Container, child: Instance) => {
    if (parentInstance instanceof fabric.Canvas) {
      parentInstance.add(child);
    } else if (parent instanceof fabric.Group) {
      parent.addWithUpdate(child);
    }
  },

  removeChild: (parentInstance: Instance, child: Instance) => {
    if (parentInstance instanceof fabric.Canvas) {
      parentInstance.remove(child);
    } else if (parentInstance instanceof fabric.Group) {
      parentInstance.removeWithUpdate(child);
    }
  },

  commitUpdate: (
    instance: Instance,
    updatePayload: UpdatePayload,
    type: string,
    oldProps: Props,
    newProps: Props
  ) => {
    Object.entries(updatePayload).forEach(([key, value]) => {
      if (key.startsWith("on")) {
        const eventName = key[2].toLowerCase() + key.slice(3);
        instance.off(eventName);
        instance.on(eventName, (e: fabric.TEvent) =>
          (value as (e: fabric.TEvent) => void)(e)
        );
      } else if (key === "custom") {
        Object.assign(instance, value);
      } else {
        instance.set(key as any, value);
      }
    });

    instance.canvas?.requestRenderAll();
  },

  getRootHostContext: (): HostContext => ({}),
  getChildHostContext: (): HostContext => ({}),
  prepareForCommit: () => null,
  resetAfterCommit: () => {},
  shouldSetTextContent: () => false,
  createTextInstance: () => {
    throw new Error("Text not supported");
  },

  getPublicInstance: (instance: Instance) => instance,
  preparePortalMount: () => {},

  scheduleTimeout: (fn: () => void, delay?: number) => setTimeout(fn, delay),
  cancelTimeout: (id: TimeoutHandle) => clearTimeout(id),
  noTimeout: -1,
};

export default hostConfig;

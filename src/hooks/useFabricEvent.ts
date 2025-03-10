/**
 * Custom hook for attaching Fabric.js event handlers
 * Manages event listener lifecycle automatically
 */
import { useEffect } from "react";

export function useFabricEvent(
  object: fabric.Object | null | undefined,
  eventName: string,
  handler: (e: fabric.IEvent) => void
) {
  useEffect(() => {
    if (!object || !handler) return;

    object.on(eventName, handler);
    return () => {
      object.off(eventName, handler);
    };
  }, [object, eventName, handler]);
}

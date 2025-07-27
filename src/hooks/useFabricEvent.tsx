import { useEffect } from 'react';
import { useFabricCanvas } from './useFabricCanvas.js';
import type * as fabric from 'fabric';

/**
 * Custom hook for attaching event handlers to the Fabric.js canvas.
 *
 * @param eventName The name of the fabric event (e.g., 'mouse:down', 'object:moving').
 * @param eventHandler A memoized callback function (useCallback) to handle the event.
 */
export function useFabricCanvasEvent<T extends fabric.IEvent>(
  eventName: string,
  eventHandler: (e: T) => void,
) {
  const canvas = useFabricCanvas();

  useEffect(() => {
    if (!canvas) return;

    // The type assertion is necessary because Fabric.js's event system is not strongly typed.
    const handler = eventHandler as (e: fabric.IEvent) => void;

    canvas.on(eventName, handler);

    return () => {
      canvas.off(eventName, handler);
    };
  }, [canvas, eventName, eventHandler]);
}

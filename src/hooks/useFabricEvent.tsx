/**
 * Custom hook for attaching Fabric.js event handlers
 * Manages event listener lifecycle automatically
 */
import { useEffect } from 'react';
import { useFabricStore } from './fabricStore';
import * as fabric from 'fabric';

export function useFabricEvent(
  object: fabric.Object | null | undefined,
  eventName: string,
  handler: (e: fabric.IEvent) => void,
) {
  useEffect(() => {
    if (!object || !handler) return;

    object.on(eventName, handler);
    return () => {
      object.off(eventName, handler);
    };
  }, [object, eventName, handler]);
}

export function useFabricCanvasEvent(
  canvasEventHandler: (canvas: fabric.Canvas) => void,
) {
  const canvas = useFabricStore((state) => state.canvas);

  useEffect(() => {
    console.log('Adding canvas event handler');
    canvas && canvasEventHandler(canvas);
    return () => {
      canvas?.dispose();
    };
  }, [canvas]);
}

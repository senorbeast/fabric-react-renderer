/**
 * Custom hook for attaching Fabric.js event handlers
 * Manages event listener lifecycle automatically
 */
import { useEffect } from 'react';
import * as fabric from 'fabric';
import { useFabricStore } from './fabricStore.js';

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

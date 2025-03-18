import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { useFabricStore } from '../hooks/fabricStore.js';
import { render as fabricRender } from '../reconciler/hostConfig.js';

export interface FabricCanvasProps
  extends React.HTMLAttributes<HTMLCanvasElement> {}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({
  children,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const { setCanvas } = useFabricStore();

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      // Set the canvas in the store so that it can be accessed globally.
      fabricCanvasRef.current = fabricCanvas;
      setCanvas(fabricCanvas);
      fabricRender(children, fabricCanvas);
    }
    return () => {
      // Optionally reset the canvas in the store on unmount.
      fabricCanvasRef.current?.dispose();
      setCanvas(null);
    };
  }, [children]);

  return <canvas ref={canvasRef} {...rest} />;
};

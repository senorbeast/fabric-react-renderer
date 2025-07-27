import React, { useRef, useEffect, useMemo } from 'react';
import * as fabric from 'fabric';
import { FabricReconciler, type FabricRoot } from '../reconciler/hostConfig.js';
import { FabricContext, FabricContextValue } from './FabricContext.js';
import type { Root } from 'react-reconciler';

export interface FabricCanvasProps
  extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  onLoad?: (canvas: fabric.Canvas) => void;
  onError?: (error: Error) => void;
  fabricCanvasOptions?: fabric.ICanvasOptions;
}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({
  children,
  onLoad,
  onError,
  fabricCanvasOptions,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const rootRef = useRef<Root | null>(null);

  const contextValue = useMemo<FabricContextValue>(
    () => ({
      canvas: fabricCanvasRef.current,
    }),
    [fabricCanvasRef.current],
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasEl = canvasRef.current;
    const fabricCanvas = new fabric.Canvas(canvasEl, fabricCanvasOptions);
    fabricCanvasRef.current = fabricCanvas;

    const container: FabricRoot = { canvas: fabricCanvas };
    rootRef.current = FabricReconciler.createContainer(
      container,
      1, // LegacyRoot
      null,
      false,
      false,
      '',
      onError || ((error: Error) => console.error(error)),
      null,
    );

    if (onLoad) {
      onLoad(fabricCanvas);
    }

    return () => {
      FabricReconciler.updateContainer(null, rootRef.current, null, () => {
        fabricCanvas.dispose();
        rootRef.current = null;
        fabricCanvasRef.current = null;
      });
    };
  }, [fabricCanvasOptions, onLoad, onError]);

  useEffect(() => {
    if (rootRef.current) {
      FabricReconciler.updateContainer(children, rootRef.current, null);
    }
  }, [children]);

  return (
    <FabricContext.Provider value={contextValue}>
      <canvas ref={canvasRef} {...rest} />
      {contextValue.canvas && children}
    </FabricContext.Provider>
  );
};

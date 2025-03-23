import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { useFabricStore } from '../hooks/fabricStore.js';
import { FabricReconciler, type FabricRoot } from '../reconciler/hostConfig.js';

export interface FabricCanvasProps
  extends React.HTMLAttributes<HTMLCanvasElement> {}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({
  children,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const rootRef = useRef<any>(null); // Ref to hold the React-Fabric root
  const setCanvas = useFabricStore((state) => state.action.setCanvas);

  // Initialize Fabric canvas and React root once on mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current);
    fabricCanvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);

    // Create React-Fabric root
    const container: FabricRoot = { canvas: fabricCanvas };
    rootRef.current = FabricReconciler.createContainer(
      container,
      1, // LegacyRoot
      null,
      false,
      false,
      '',
      (error) => console.error(error),
      null,
    );

    // Initial render
    FabricReconciler.updateContainer(children, rootRef.current, null);

    return () => {
      // Cleanup on unmount
      fabricCanvas.dispose();
      setCanvas(null);

      // Unmount React tree
      if (rootRef.current) {
        FabricReconciler.updateContainer(null, rootRef.current, null);
        rootRef.current = null;
      }
    };
  }, []); // Empty deps: runs once on mount

  // Update React tree when children change
  useEffect(() => {
    if (rootRef.current) {
      FabricReconciler.updateContainer(children, rootRef.current, null);
    }
  }, [children]);

  return <canvas ref={canvasRef} {...rest} />;
};

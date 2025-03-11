import React, { useRef, useEffect } from "react";
import { render as fabricRender } from "./reconciler/hostConfig";
import * as fabric from "fabric";

export interface FabricCanvasProps
  extends React.HTMLAttributes<HTMLCanvasElement> {}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({
  children,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Create a Fabric canvas instance on the canvas element.
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);
      // Render the React tree into our Fabric canvas.
      fabricRender(children, fabricCanvasRef.current);
    }
    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, [children]);

  return <canvas ref={canvasRef} {...rest} />;
};

import { useMemo } from "react";
import { createResource } from "./createResource";

function loadCanvasJSONResource(canvas: fabric.Canvas, json: any) {
  return createResource(
    () =>
      new Promise<fabric.Canvas>((resolve) => {
        canvas.loadFromJSON(json, () => {
          // Optionally update object coordinates or any additional processing.
          resolve(canvas);
        });
      })
  );
}

function CanvasLoader({ canvas, json }: { canvas: fabric.Canvas; json: any }) {
  const canvasResource = useMemo(
    () => loadCanvasJSONResource(canvas, json),
    [canvas, json]
  );
  // This will suspend until the canvas is loaded.
  const loadedCanvas = canvasResource.read();

  // The component might return null as the canvas is being updated imperatively.
  return null;
}

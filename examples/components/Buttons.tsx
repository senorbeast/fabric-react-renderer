import * as fabric from "fabric";
import { useFabricCanvas } from "../../src/hooks/useFabricCanvas";
import { useFabricCanvasEvent } from "../../src/hooks/useFabricEvent";

const Buttons = () => {
  const canvas = useFabricCanvas();
  const handleClick = () => {
    if (canvas) {
      // e.g., add a new object or perform any canvas method
      console.log("Current objects on canvas:", canvas.getObjects());
    }
  };

  useFabricCanvasEvent((canvas) => {
    canvas.on("object:added", (options) => {});

    canvas.on("mouse:down", (options) => {
      console.log("Object mouse down:", options.target?.type);
    });
  });

  const addRect = () => {
    fabric.FabricImage.fromURL("https://via.placeholder.com/150", (img) => {
      img.set({ left: 100, top: 100 });
      canvas?.add(img);
    });

    new fabric.Polyline([], { left: 0 });
    new fabric.Rect();
    new fabric.Triangle();
  };

  const updateBackground = () => {
    const getRandomHexColor = () => {
      const n = (Math.random() * 0xfffff * 1000000).toString(16);
      return "#" + n.slice(0, 6);
    };
    const randomColor = getRandomHexColor();
    canvas?.set("backgroundColor", randomColor);
    canvas?.renderAll();
  };

  const logCanvasEvents = () => {
    console.log("Canvas events:", canvas?.__eventListeners);
  };

  const logCanvasObjects = () => {
    console.log("Current objects on canvas:", canvas?.getObjects());
  };

  const renderAll = () => {
    canvas?.renderAll();
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <button onClick={handleClick}>Log Canvas Objects</button>
      <button onClick={addRect}>Add Rect</button>
      <button onClick={updateBackground}>Update Background</button>
      <button onClick={logCanvasObjects}>Log Canvas Objects</button>
      <button onClick={logCanvasEvents}>Log Canvas Events</button>
      <button onClick={renderAll}>Render All</button>
    </div>
  );
};

export default Buttons;

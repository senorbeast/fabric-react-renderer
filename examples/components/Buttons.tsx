import React, { useEffect } from "react";
import { useFabricCanvas } from "../../src/hooks/useFabricStore/useFabricCanvas";
import * as fabric from "fabric";

const Buttons = () => {
  const canvas = useFabricCanvas();
  const handleClick = () => {
    if (canvas) {
      // e.g., add a new object or perform any canvas method
      console.log("Current objects on canvas:", canvas.getObjects());
    }
  };

  const addRect = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: "red",
    });
    canvas?.add(rect);
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

  const renderAll = () => {
    canvas?.renderAll();
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <button onClick={handleClick}>Log Canvas Objects</button>
      <button onClick={addRect}>Add Rect</button>
      <button onClick={updateBackground}>Update Background</button>
      <button onClick={renderAll}>Render All</button>
    </div>
  );
};

export default Buttons;

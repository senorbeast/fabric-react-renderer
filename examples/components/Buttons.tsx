import * as fabric from 'fabric';
import { useFabricCanvas } from '../../src/hooks/useFabricCanvas';
import { useFabricCanvasEvent } from '../../src/hooks/useFabricEvent';

const Buttons = () => {
  const canvas = useFabricCanvas();

  // useFabricCanvasEvent((canvas) => {
  //   canvas.on("object:added", (options) => {});

  //   canvas.on("mouse:down", (options) => {
  //     console.log("Object mouse down:", options.target?.type);
  //   });

  //   canvas.on("mouse:up", (options) => {
  //     console.log("Object mouse up:", options.target?.type);
  //   });

  //   canvas.on("mouse:over", (options) => {
  //     console.log("Object mouse over:", options.target?.type);
  //   });

  //   canvas.on("mouse:out", (options) => {
  //     console.log("Object mouse out:", options.target?.type);
  //   });
  // });

  const addImage = async () => {
    const image = await fabric.FabricImage.fromURL(
      'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png',
    );

    image.set({ left: 100, top: 100 });
    canvas?.add(image);
  };

  const updateBackground = () => {
    const getRandomHexColor = () => {
      const n = (Math.random() * 0xfffff * 1000000).toString(16);
      return '#' + n.slice(0, 6);
    };
    const randomColor = getRandomHexColor();
    canvas?.set('backgroundColor', randomColor);
    canvas?.renderAll();
  };

  const logCanvasEvents = () => {
    console.log('Canvas events:', canvas?.__eventListeners);
  };

  const logCanvasObjects = () => {
    console.log('Current objects on canvas:', canvas?.getObjects());
  };

  const renderAll = () => {
    canvas?.renderAll();
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <button onClick={addImage}>Add Image</button>
      <button onClick={updateBackground}>Update Background</button>
      <button onClick={logCanvasObjects}>Log Canvas Objects</button>
      <button onClick={logCanvasEvents}>Log Canvas Events</button>
      <button onClick={renderAll}>Render All</button>
    </div>
  );
};

export default Buttons;

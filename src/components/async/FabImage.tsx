import { useEffect } from 'react';
import * as fabric from 'fabric';
import { useFabricCanvas } from '../../hooks/useFabricCanvas';
import { FabImageProps } from '../../fabric-jsx';

const addImage = async (canvas: fabric.Canvas, props: FabImageProps) => {
  console.log('Adding Image');
  const { src, ...imageProps } = props;

  const image = await fabric.FabricImage.fromURL(src);
  image.set({ ...imageProps });
  canvas?.add(image);
};

function FabImage(props: FabImageProps) {
  const canvas = useFabricCanvas();
  useEffect(() => {
    if (!canvas) return;
    addImage(canvas, props);
  }, [canvas]);

  // This component does not render any DOM elements itself.
  return null;
}

export function FabImageWithFallback(props: FabImageProps) {
  return (
    <>
      <FabImage {...props} />
    </>
  );
}

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as fabric from 'fabric';
import { fab, useFabricCanvas } from '../../index.js';

//@ts-ignore
export type FabImageProps = { src: string } & fabric.IImageOptions;

const addImage = async (
  canvas: fabric.Canvas,
  props: FabImageProps,
  setLoaded: (loaded: boolean) => void,
): Promise<fabric.FabricImage> => {
  const { src, ...imageProps } = props;
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const image = await fabric.Image.fromURL(src);
  image.set({ ...imageProps });
  canvas.add(image);

  setLoaded(true);
  return image;
};

function FabImage({
  props,
  setLoaded,
}: {
  props: FabImageProps;
  setLoaded: (loaded: boolean) => void;
}) {
  const canvas = useFabricCanvas();
  const imageRef = useRef<fabric.Image | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if (!canvas) return;

    const addImageToCanvas = async () => {
      try {
        const image = await addImage(canvas, props, setLoaded);
        if (isMounted.current) {
          imageRef.current = image;
        }
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    console.log('Adding image');
    addImageToCanvas();

    return () => {
      isMounted.current = false;
      if (imageRef.current && canvas) {
        console.log('Removing image');
        canvas.remove(imageRef.current);
        canvas.renderAll();
      }
    };
  }, [canvas, props, setLoaded]);

  return null;
}

function FabImageWOuE({
  props,
  setLoaded,
}: {
  props: FabImageProps;
  setLoaded: (loaded: boolean) => void;
}) {
  const canvas = useFabricCanvas();
  const hasAdded = useRef(false);

  if (!canvas) return null;

  if (!hasAdded.current) {
    hasAdded.current = true;
    addImage(canvas, props, setLoaded);
  }

  return null;
}

export function FabImageWithFallback(props: FabImageProps) {
  const [loaded, setLoaded] = useState(false); // Local state for each image
  useEffect(() => {
    console.log('FabImageWithFallback mounted');

    return () => {
      console.log('FabImageWithFallback unmounted');
    };
  }, []);

  return (
    <>
      {!loaded && (
        <fab.text
          text="Loading..."
          fill="white"
          left={props.left}
          top={props.top}
        />
      )}
      <FabImageWOuE props={props} setLoaded={setLoaded} />
    </>
  );
}

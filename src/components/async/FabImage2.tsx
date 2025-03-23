// FabImage.tsx
import { useEffect, use, Suspense } from 'react';
import * as fabric from 'fabric';
import { fab, useFabricCanvas } from '../../index.js';
import type { FabImageProps } from './FabImage.js';

const imageCache = new Map<string, fabric.Image>();

async function loadImage(src: string): Promise<fabric.Image> {
  return await fabric.FabricImage.fromURL(src);
}

export function FabImage2(props: FabImageProps) {
  const canvas = useFabricCanvas();
  const { src, ...imageProps } = props;

  const image = use(loadImage(src));

  useEffect(() => {
    if (!canvas) return;
    let imageGen: fabric.Image | null = null;

    loadImage(src).then(async (img) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      imageGen = img;
      img.set(imageProps);
      canvas.add(img);
    });

    return () => {
      !!imageGen && canvas.remove(imageGen);
    };
  }, [image, imageProps]);

  return null;
}

export const FabImageWithFallback2 = (props: FabImageProps) => {
  return (
    <Suspense
      fallback={
        <fab.text
          text="Loading..."
          fill="white"
          left={props.left}
          top={props.top}
        />
      }
    >
      <fab.text
        text="Loading..."
        fill="white"
        left={props.left}
        top={props.top}
      />
      <FabImage2 {...props} />
    </Suspense>
  );
};

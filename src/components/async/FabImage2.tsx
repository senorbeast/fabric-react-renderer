// FabImage.tsx
import { useEffect, use, Suspense } from 'react';
import { useFabricCanvas } from '../../hooks/useFabricCanvas';
import * as fabric from 'fabric';
import { FabImageProps } from './FabImage';

const imageCache = new Map<string, fabric.Image>();

async function loadImage(src: string): Promise<fabric.Image> {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }
  return await fabric.FabricImage.fromURL(src);
}

export function FabImage2(props: FabImageProps) {
  const canvas = useFabricCanvas();
  const { src, ...imageProps } = props;

  // React 19's use() hook for Suspense
  const image = use(loadImage(src));

  useEffect(() => {
    if (!canvas) return;
    let imageGen: fabric.Image | null = null;

    loadImage(src).then((img) => {
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
    // <Suspense
    //   fallback={<fab.rect width={272} height={92} fill="rgba(0,0,0,0.1)" />}
    // >
    <FabImage2 {...props} />
    // </Suspense>
  );
};

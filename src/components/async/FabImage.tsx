import { useEffect, use } from "react";
import * as fabric from "fabric";

type FabricImageType = fabric.Image;

const imageCache = new Map<string, fabric.Image>();

function FabImage({ src, canvas }: { src: string; canvas: fabric.Canvas }) {
  // Create the resource once per source URL.
  // const imageResource = useMemo(
  //   () =>
  //     createResource<FabricImageType>(() => fabric.FabricImage.fromURL(src)),
  //   [src]
  // );

  async function loadImage(src: string): Promise<fabric.Image> {
    if (imageCache.has(src)) {
      return imageCache.get(src)!;
    }

    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(
        src,
        (img) => {
          imageCache.set(src, img);
          resolve(img);
        },
        { crossOrigin: "anonymous" }
      );
    });
  }

  // The read() method either returns the image or throws a promise to trigger Suspense.
  // const image = imageResource.read();

  const image = use(loadImage(src));

  useEffect(() => {
    if (image && canvas) {
      image.set({ left: 100, top: 100 });
      // canvas.add(image);
      canvas.requestRenderAll();
    }
  }, [image, canvas]);

  // This component does not render any DOM elements itself.
  return null;
}

export function FabImageWithFallback({
  canvas,
  imageUrl,
}: {
  canvas: fabric.Canvas;
  imageUrl: string;
}) {
  return (
    <>
      {/* <Suspense fallback={<fab.text text="Loading..." />}> */}
      <FabImage src={imageUrl} canvas={canvas} />
      {/* </Suspense> */}
    </>
  );
}

import React, { useState, useEffect, Fragment } from 'react';
import * as fabric from 'fabric';
import { fab } from '../../core/fab.js';

export type FabImageProps = {
  src: string;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode;
} & fabric.IImageOptions;

export const FabImage: React.FC<FabImageProps> = ({
  src,
  onError,
  fallback,
  ...imageProps
}) => {
  const [image, setImage] = useState<fabric.Image | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    fabric.Image.fromURL(src)
      .then((img) => {
        if (isMounted) {
          setImage(img);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          if (onError) {
            onError(err);
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src, onError]);

  if (error) {
    return fallback || null;
  }

  if (!image) {
    return (
      fallback || (
        <fab.text
          text="Loading..."
          fill="white"
          left={imageProps.left}
          top={imageProps.top}
        />
      )
    );
  }

  return <fab.image instance={image} {...imageProps} />;
};

// Note: FabImageWrapper and FabImageWithFallback have been removed in favor of a more declarative API.
// The new `FabImage` component handles its own loading and error states.
// The `fallback` prop can be used to render custom loading or error content.

import { createContext } from 'react';
import * as fabric from 'fabric';

export interface FabricContextValue {
  canvas: fabric.Canvas | null;
}

export const FabricContext = createContext<FabricContextValue>({
  canvas: null,
});

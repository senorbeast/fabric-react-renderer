import { useContext } from 'react';
import { FabricContext } from '../core/FabricContext.js';

export function useFabricCanvas() {
  const { canvas } = useContext(FabricContext);
  return canvas;
}

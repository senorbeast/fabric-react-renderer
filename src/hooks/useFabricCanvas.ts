import { useFabricStore } from './fabricStore.js';

export function useFabricCanvas() {
  return useFabricStore((state) => state.canvas);
}

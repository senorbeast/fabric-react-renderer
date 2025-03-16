import { useFabricStore } from "./fabricStore";

export function useFabricCanvas() {
  return useFabricStore((state) => state.canvas);
}

import { create } from "zustand";
import * as fabric from "fabric";

interface FabricStore {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
}

export const useFabricStore = create<FabricStore>((set) => ({
  canvas: null,
  setCanvas: (canvas: fabric.Canvas | null) => set({ canvas }),
}));

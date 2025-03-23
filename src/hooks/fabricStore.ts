import { create } from 'zustand';
import * as fabric from 'fabric';

interface FabricStore {
  canvas: fabric.Canvas | null;
  showImage: boolean;
  action: {
    setCanvas: (canvas: fabric.Canvas | null) => void;
    toggleImage: () => void;
  };
}

export const useFabricStore = create<FabricStore>((set) => ({
  canvas: null,
  showImage: true,
  action: {
    setCanvas: (canvas) => set({ canvas }),
    toggleImage: () => set((state) => ({ showImage: !state.showImage })),
  },
}));

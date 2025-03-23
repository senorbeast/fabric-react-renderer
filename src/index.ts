// src/index.ts

// Core
export { FabricCanvas } from './core/Canvas.js';
export { fab } from './core/fab.js';
export type { FabProxy } from './fabric-jsx.js';

// Hooks
export { useFabricCanvas } from './hooks/useFabricCanvas.js';
export { useFabricCanvasEvent } from './hooks/useFabricEvent.js';
export { useFabricStore } from './hooks/fabricStore.js';

// Components
export { FabImageWrapper } from './components/async/FabImage.js';
export { FabImageWrapper as FabImageWithFallback } from './components/async/FabImage.js';

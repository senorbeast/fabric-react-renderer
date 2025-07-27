// src/index.ts

// Core
export { FabricCanvas } from './core/Canvas.js';
export type { FabricCanvasProps } from './core/Canvas.js';
export { fab } from './core/fab.js';
export type { FabProxy } from './fabric-jsx.js';
export { FabricContext } from './core/FabricContext.js';
export type { FabricContextValue } from './core/FabricContext.js';

// Hooks
export { useFabricCanvas } from './hooks/useFabricCanvas.js';
export { useFabricCanvasEvent } from './hooks/useFabricEvent.js';

// Components
export { FabImage } from './components/async/FabImage.js';
export type { FabImageProps } from './components/async/FabImage.js';

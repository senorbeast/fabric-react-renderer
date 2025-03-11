declare global {
  namespace JSX {
    interface IntrinsicElements {
      rect: {
        left?: number;
        top?: number;
        fill?: string;
        width?: number;
        height?: number;
        // Allow additional props (such as event handlers, etc.)
        [key: string]: any;
      };
      // Add more elements (e.g., group, image) as needed.
    }
  }
}

export {};

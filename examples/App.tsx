import React from "react";
import { FabricCanvas } from "../src/Canvas";
import ErrorBoundary from "./ErrorBoundary";

declare global {
  namespace React {
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

const App: React.FC = () => {
  return (
    <>
      <div>Fabric React Renderer</div>
      <h1>Canvas</h1>
      <FabricCanvas
        width={800}
        height={600}
        style={{ border: "1px solid #ccc" }}
      >
        <rect left={50} top={50} width={200} height={100} fill="blue" />
      </FabricCanvas>
    </>
  );
};

export default App;

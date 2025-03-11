import React from "react";
import { FabricCanvas } from "../src/Canvas";
import ErrorBoundary from "./ErrorBoundary";
import Buttons from "./components/Buttons";

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
    <div
      style={{
        color: "white",
        backgroundColor: "black",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: "1rem",
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
        }}
      >
        <h1 style={{ margin: "0" }}>Fabric React Renderer</h1>
        <FabricCanvas
          width={800}
          height={600}
          style={{ border: "1px solid #ccc" }}
        >
          <rect left={50} top={50} width={200} height={100} fill="blue" />
          <rect left={50} top={50} width={200} height={100} fill="red" />
        </FabricCanvas>
        <Buttons />
      </div>
    </div>
  );
};

export default App;

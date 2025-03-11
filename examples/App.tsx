import React from "react";
import { FabricCanvas } from "../src/Canvas";
import ErrorBoundary from "./ErrorBoundary";
import Buttons from "./components/Buttons";
import { fab } from "../src/fab";

const ReactWrapped = () => {
  return (
    <>
      <fab.rect left={350} top={350} width={30} height={100} fill="green" />
      <fab.circle left={450} top={350} radius={60} fill="lightgrey" />
      <fab.triangle left={350} top={50} fill="purple" />
      <fab.path
        path={[
          ["M", 0, 0],
          ["L", 50, 50],
        ]}
        left={0}
        top={0}
        stroke="yellow"
        strokeWidth={2}
      />

      <fab.ellipse left={450} top={50} rx={60} ry={40} fill="orange" />
    </>
  );
};

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
          <fab.rect left={50} top={50} width={200} height={100} fill="blue" />
          <fab.rect left={250} top={250} width={100} height={100} fill="red" />
          <ReactWrapped />
        </FabricCanvas>
        <Buttons />
      </div>
    </div>
  );
};

export default App;

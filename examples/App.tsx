import { Canvas, Rect, Circle, Group } from "fabric-react-renderer";
import { useFabricEvent } from "../src/hooks/useFabricEvent";

function Demo() {
  const rectRef = useRef<fabric.Rect>();

  useFabricEvent(rectRef.current, "selected", (e) => {
    console.log("Rect selected!", e.target);
  });

  return (
    <Canvas width={800} height={600}>
      <Group>
        <Rect
          ref={rectRef}
          left={100}
          top={100}
          width={200}
          height={100}
          fill="red"
          custom={{ customId: "rect-1" }}
          onSelected={(e) => console.log("Selected via prop")}
        />
        <Circle
          left={400}
          top={300}
          radius={50}
          fill="blue"
          onMouseDown={(e) => console.log("Circle clicked")}
        />
      </Group>
    </Canvas>
  );
}

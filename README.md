# Fabric React Renderer

[Not Production Ready]

A React renderer for Fabric.js that allows you to render Fabric.js components as React components.

## Installation

You can install the package via npm:

`pnpm install fabric-react-renderer`

## Usage

```tsx
import { fab, FabricCanvas } from 'fabric-react-renderer';

import './styles.css';

export default function App() {
  return (
    <div className="App">
      <h1>Hello Fabric React Renderer</h1>
      <FabricCanvas width={500} height={500}>
        <fab.rect left={50} top={50} width={200} height={100} fill="blue" />
      </FabricCanvas>
    </div>
  );
}
```

fabric-react-renderer is a <a href="https://reactjs.org/docs/codebase-overview.html#renderers">React renderer</a> for fabricjs.

Build your scene declaratively with re-usable, self-contained components that react to state, are readily interactive and can participate in React's ecosystem.

---

#### Does it have limitations?

None. Everything that works in fabricjs will work here without exception.

#### Is it slower than plain fabricjs?

No. There is no overhead. Components render outside of React. It outperforms fabricjs in scale due to React's scheduling abilities.

#### Can it keep up with frequent feature updates to fabricjs?

Yes. It merely expresses fabricjs in JSX, `<fab.rect />` dynamically turns into `new fabric.Rect()`. If a new fabricjs version adds, removes or changes features, it will be available to you instantly without depending on updates to this library.

Inspired by <a href="https://github.com/pmndrs/react-three-fiber">@react-three/fiber</a>

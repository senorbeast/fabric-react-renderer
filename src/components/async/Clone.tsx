import { useMemo, useEffect } from 'react';
import { createResource } from './createResource.js';

function cloneObjectResource(obj: fabric.Object) {
  return createResource(async () => obj.clone(() => {}));
}

// Then use it in a component:
function CloneComponent({ obj }: { obj: fabric.Object }) {
  const cloneResource = useMemo(() => cloneObjectResource(obj), [obj]);
  const clonedObj = cloneResource.read();

  useEffect(() => {
    // Do something with the cloned object...
  }, [clonedObj]);

  return null;
}

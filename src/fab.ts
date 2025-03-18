import { FabProxy } from './fabric-jsx';

// fab.ts
export const fab: FabProxy = new Proxy({} as FabProxy, {
  get: (_target, prop: string) => `fab.${prop.toLowerCase()}`,
});

export function createResource<T>(promiseFactory: () => Promise<T>): {
  read: () => T;
} {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T | any;
  const suspender = promiseFactory()
    .then((r: T) => {
      status = 'success';
      result = r;
    })
    .catch((e: any) => {
      status = 'error';
      result = e;
    });
  return {
    read() {
      if (status === 'pending') {
        throw suspender; // Tells React to suspend.
      } else if (status === 'error') {
        throw result;
      }
      return result;
    },
  };
}

export const failProxy = <T extends object>(name: string, target: T = {} as T) => {
  const proxy = new Proxy<T>(target, {
    get: (_currentTarget, propertyKey) => {
      const key: string =
        typeof propertyKey === "string" || typeof propertyKey === "number"
          ? propertyKey.toString()
          : "[Symbol]";

      throw new Error(`failProxy: ${name}.${key} not implemented.`);
    }
  });
  return proxy;
};

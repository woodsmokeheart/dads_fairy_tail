

export interface DependencyFactory<T = unknown> {
  getInstance: (...args: unknown[]) => T;
}

export class DependencyRegistry<TDependencies extends Record<string, unknown> = Record<string, unknown>> {
  private readonly _dependencies = new Map<keyof TDependencies, DependencyFactory>();

  register<K extends keyof TDependencies>(
    name: K,
    factory: DependencyFactory<TDependencies[K]>
  ): void {
    this._dependencies.set(name, factory);
  }

  inject<K extends keyof TDependencies>(name: K): TDependencies[K] {
    const factory = this._dependencies.get(name);
    if (!factory) {
      throw new Error(`Dependency '${String(name)}' not found`);
    }
    return factory.getInstance() as TDependencies[K];
  }

  has<K extends keyof TDependencies>(name: K): boolean {
    return this._dependencies.has(name);
  }

  clear(): void {
    this._dependencies.clear();
  }
}

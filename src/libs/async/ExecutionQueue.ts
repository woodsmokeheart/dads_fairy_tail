export interface QueuedOperation<T = unknown> {
  key: string[];
  fn: () => Promise<T>;
  timestamp?: number;
}

export class ExecutionQueue {
  private static _instance?: ExecutionQueue;
  private readonly _queue = new Map<string, Promise<unknown>>();
  private readonly _cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly _cacheTimeout = 5 * 60 * 1000; // 5 минут

  static getInstance(): ExecutionQueue {
    if (!ExecutionQueue._instance) {
      ExecutionQueue._instance = new ExecutionQueue();
    }
    return ExecutionQueue._instance;
  }


  async run<T>(operation: QueuedOperation<T>): Promise<T> {
    const key = this._createKey(operation.key);
    
    const cached = this._getFromCache(key);
    if (cached) {
      return cached as T;
    }

    if (this._queue.has(key)) {
      return this._queue.get(key) as Promise<T>;
    }

    const promise = this._executeOperation(operation, key);
    this._queue.set(key, promise);

    try {
      const result = await promise;
      this._cache.set(key, { data: result, timestamp: Date.now() });
      return result as T;
    } finally {
      this._queue.delete(key);
    }
  }

  private async _executeOperation<T>(operation: QueuedOperation<T>, key: string): Promise<T> {
    try {
      return await operation.fn();
    } catch (error) {
      this._cache.delete(key);
      throw error;
    }
  }

  private _createKey(keys: string[]): string {
    return keys.join(':');
  }

  private _getFromCache(key: string): unknown | null {
    const cached = this._cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > this._cacheTimeout) {
      this._cache.delete(key);
      return null;
    }

    return cached.data;
  }


  clearCache(): void {
    this._cache.clear();
  }


  clearCacheForKey(key: string[]): void {
    const cacheKey = this._createKey(key);
    this._cache.delete(cacheKey);
  }

 
  clearCacheByPattern(pattern: string[]): void {
    const patternKey = this._createKey(pattern);
    const keysToDelete: string[] = [];
    
    for (const key of this._cache.keys()) {
      if (key.includes(patternKey)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this._cache.delete(key));
  }


  clearQueue(): void {
    this._queue.clear();
  }
}

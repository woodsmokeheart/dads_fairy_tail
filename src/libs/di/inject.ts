import { diRegistry } from './diRegistry';
import { Dependencies } from './types';

/**
 * Функция для внедрения зависимостей
 * @param name - имя зависимости
 * @returns экземпляр зависимости
 */
export function inject<K extends keyof Dependencies>(name: K): Dependencies[K] {
  return diRegistry.inject(name);
}

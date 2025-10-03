import { DependencyRegistry } from './DependencyRegistry';
import { Dependencies } from './types';
import { store } from '~/store';
import { StoriesService } from '~/services/stories';
import { StoriesRepository } from '~/repositories/StoriesRepository';
import { LoggerService } from '~/services/LoggerService';
import { FileUploadService } from '~/services/FileUploadService';
import { ExecutionQueue } from '~/libs/async/ExecutionQueue';


export const diRegistry = new DependencyRegistry<Dependencies>();

// Регистрация зависимостей
diRegistry.register('store', { getInstance: () => store });
diRegistry.register('executionQueue', ExecutionQueue);
diRegistry.register('logger', LoggerService);

// Repositories
diRegistry.register('storiesRepository', { getInstance: () => StoriesRepository.getInstance() });

// Services
diRegistry.register('storiesService', { getInstance: () => StoriesService.getInstance() });
diRegistry.register('fileUploadService', { getInstance: () => FileUploadService.getInstance() });

import { Store } from '~/store';
import { IStoriesService, ILogger } from '~/interfaces';
import { IStoriesRepository } from '~/interfaces';
import { IFileUploadService } from '~/services/FileUploadService';
import { ExecutionQueue } from '~/libs/async/ExecutionQueue';


export interface Dependencies extends Record<string, unknown> {
  // Store
  store: Store;
  
  // Services
  storiesService: IStoriesService;
  logger: ILogger;
  fileUploadService: IFileUploadService;
  
  // Repositories
  storiesRepository: IStoriesRepository;
  
  // Utils
  executionQueue: ExecutionQueue;
}

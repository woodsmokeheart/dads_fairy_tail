import { supabase } from '~/lib/supabase';
import { ILogger } from '~/interfaces';
import { inject } from '~/libs/di';

export interface IFileUploadService {
  uploadImage(file: File, folder: string): Promise<string>;
  deleteImage(url: string): Promise<void>;
}

export class FileUploadService implements IFileUploadService {
  private static _instance?: IFileUploadService;

  static getInstance(logger = inject('logger')): IFileUploadService {
    if (!FileUploadService._instance) {
      FileUploadService._instance = new FileUploadService(logger);
    }
    return FileUploadService._instance;
  }

  constructor(private readonly _logger: ILogger) {}

  async uploadImage(file: File, folder: string): Promise<string> {
    try {
      this._logger.debug('[FileUploadService] Uploading image:', file.name);

      if (!file.type.startsWith('image/')) {
        throw new Error('Файл должен быть изображением');
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Размер файла не должен превышать 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('story-covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        this._logger.error('[FileUploadService] Upload error:', error);
        throw new Error(`Ошибка загрузки файла: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('story-covers')
        .getPublicUrl(filePath);

      this._logger.debug('[FileUploadService] Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err) {
      this._logger.error('[FileUploadService] Upload error:', err);
      throw err;
    }
  }

  async deleteImage(url: string): Promise<void> {
    try {
      this._logger.debug('[FileUploadService] Deleting image:', url);

      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from('story-covers')
        .remove([filePath]);

      if (error) {
        this._logger.error('[FileUploadService] Delete error:', error);
        throw new Error(`Ошибка удаления файла: ${error.message}`);
      }

      this._logger.debug('[FileUploadService] Image deleted successfully');
    } catch (err) {
      this._logger.error('[FileUploadService] Delete error:', err);
      throw err;
    }
  }
}

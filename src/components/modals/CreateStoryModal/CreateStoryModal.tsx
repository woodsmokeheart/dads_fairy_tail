'use client';

import React, { useState, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Send } from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
import RichTextEditor from '@/components/story/RichTextEditor/RichTextEditor';
import styles from './CreateStoryModal.module.css';

const createStorySchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(100, 'Название слишком длинное'),
  content: z.string().min(1, 'Содержание обязательно').max(20000, 'Содержание слишком длинное (максимум 20000 символов)'),
  is_published: z.boolean(),
});

export type CreateStoryFormData = z.infer<typeof createStorySchema>;

export interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStoryFormData & { cover_image?: File }) => Promise<void>;
  loading?: boolean;
  magic?: boolean;
}


const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  magic = false
}) => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<CreateStoryFormData>({
    resolver: zodResolver(createStorySchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      is_published: false,
    },
  });

  const watchedContent = watch('content');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB');
        return;
      }
      
      setCoverImage(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearForm = () => {
    reset();
    setCoverImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmitForm: SubmitHandler<CreateStoryFormData> = async (data) => {
    try {
      await onSubmit({
        ...data,
        is_published: true,
        cover_image: coverImage || undefined,
      });
      clearForm();
    } catch (error) {
      console.error('Ошибка при создании сказки:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Создать новую сказку"
      size="large"
      magic={magic}
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
        <div className={styles.scrollableContent}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Основная информация</h3>
            <div className={styles.formRowSingle}>
              <Input
                label="Название сказки"
                placeholder="Введите название вашей сказки"
                error={errors.title?.message}
                {...register('title')}
                magic={magic}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Обложка</h3>
            <div className={styles.fileUpload}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className={`${styles.fileLabel} ${coverImage ? styles.hasFile : ''}`}
              >
                <Upload className={styles.fileIcon} />
                <div className={styles.fileInfo}>
                  {coverImage ? (
                    <>
                      <span className={styles.fileName}>{coverImage.name}</span>
                      <span className={styles.fileSize}>
                        {formatFileSize(coverImage.size)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Загрузить обложку</span>
                      <span>JPG, PNG до 5MB</span>
                    </>
                  )}
                </div>
              </label>
              {coverImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={removeCoverImage}
                  leftIcon={<X />}
                >
                  Удалить
                </Button>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Содержание</h3>
            <RichTextEditor
              content={watchedContent}
              onChange={(content) => setValue('content', content, { shouldValidate: true })}
              placeholder="Начните писать вашу сказку..."
              maxLength={20000}
              magic={magic}
            />
            {errors.content && (
              <span className={styles.error}>{errors.content.message}</span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            disabled={loading || !isValid}
            loading={loading}
            leftIcon={<Send />}
            magic={magic}
          >
            Опубликовать
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStoryModal;

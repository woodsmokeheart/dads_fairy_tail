'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import Color from '@tiptap/extension-color';
import { 
  Bold, 
  Italic, 
  Strikethrough,
  Heading1, 
  Heading2, 
  Heading3,
  List, 
  ListOrdered, 
  Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './RichTextEditor.module.css';

export interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  magic?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Начните писать вашу сказку...',
  maxLength = 10000,
  magic = false,
  className
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
      Typography,
      Color,
    ],
    content,
    immediatelyRender: false, 
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(JSON.stringify(json));
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
        'data-placeholder': placeholder,
      },
    },
  });


  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const wordCount = editor.storage.characterCount.words();
  const isOverLimit = characterCount > maxLength;

  const editorClasses = cn(
    styles.editorContainer,
    magic && styles.magic,
    className
  );

  const countClasses = cn(
    styles.count,
    characterCount > maxLength * 0.9 && styles.warning,
    isOverLimit && styles.danger
  );

  return (
    <div className={editorClasses}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(styles.toolbarButton, editor.isActive('bold') && styles.isActive)}
          >
            <Bold className={styles.toolbarIcon} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(styles.toolbarButton, editor.isActive('italic') && styles.isActive)}
          >
            <Italic className={styles.toolbarIcon} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(styles.toolbarButton, editor.isActive('strike') && styles.isActive)}
          >
            <Strikethrough className={styles.toolbarIcon} />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(styles.toolbarButton, editor.isActive('heading', { level: 1 }) && styles.isActive)}
          >
            <Heading1 className={styles.toolbarIcon} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(styles.toolbarButton, editor.isActive('heading', { level: 2 }) && styles.isActive)}
          >
            <Heading2 className={styles.toolbarIcon} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(styles.toolbarButton, editor.isActive('heading', { level: 3 }) && styles.isActive)}
          >
            <Heading3 className={styles.toolbarIcon} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(styles.toolbarButton, editor.isActive('bulletList') && styles.isActive)}
          >
            <List className={styles.toolbarIcon} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(styles.toolbarButton, editor.isActive('orderedList') && styles.isActive)}
          >
            <ListOrdered className={styles.toolbarIcon} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(styles.toolbarButton, editor.isActive('blockquote') && styles.isActive)}
          >
            <Quote className={styles.toolbarIcon} />
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />

      <div className={styles.characterCount}>
        <span>
          Слов: {wordCount}
        </span>
        <span className={countClasses}>
          Символов: {characterCount}
          {maxLength > 0 && ` / ${maxLength}`}
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;

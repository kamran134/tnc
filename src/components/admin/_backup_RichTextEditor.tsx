'use client';

import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
};

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!editorRef.current || isInitializing.current) return;
    
    isInitializing.current = true;

    // Динамически импортируем Quill только на клиенте
    import('quill').then((Quill) => {
      if (!editorRef.current || quillRef.current) return;

      const QuillClass = Quill.default;
      
      // Создаём экземпляр Quill
      const quill = new QuillClass(editorRef.current, {
        theme: 'snow',
        modules,
        placeholder: placeholder || 'Enter text...',
      });

      // Устанавливаем начальное значение
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      // Слушаем изменения
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        // Не вызываем onChange если контент пустой
        if (html === '<p><br></p>') {
          onChange('');
        } else {
          onChange(html);
        }
      });

      quillRef.current = quill;
    });

    // Cleanup
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
      isInitializing.current = false;
    };
  }, []);

  // Обновляем содержимое при изменении value извне
  useEffect(() => {
    if (!quillRef.current) return;
    
    const currentContent = quillRef.current.root.innerHTML;
    const normalizedCurrent = currentContent === '<p><br></p>' ? '' : currentContent;
    const normalizedValue = value || '';
    
    if (normalizedCurrent !== normalizedValue) {
      const selection = quillRef.current.getSelection();
      quillRef.current.clipboard.dangerouslyPasteHTML(normalizedValue);
      if (selection) {
        quillRef.current.setSelection(selection);
      }
    }
  }, [value]);

  return (
    <div className={`rich-text-editor ${className || ''}`}>
      <div ref={editorRef} />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          font-size: 14px;
          background-color: rgb(249 250 251);
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          color: rgb(17 24 39);
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgb(156 163 175);
        }
        .rich-text-editor .ql-toolbar {
          background-color: white;
          border: 1px solid rgb(209 213 219);
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .rich-text-editor .ql-container {
          border: 1px solid rgb(209 213 219);
          border-radius: 0 0 0.5rem 0.5rem;
        }
      `}</style>
    </div>
  );
}

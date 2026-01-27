'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

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

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link',
  'color', 'background',
  'align'
];

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  // Динамически импортируем ReactQuill только на клиенте
  const ReactQuill = useMemo(() => dynamic(
    () => import('react-quill'),
    { 
      ssr: false,
      loading: () => <div className="animate-pulse bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">Loading editor...</div>
    }
  ), []);

  return (
    <div className={`rich-text-editor ${className || ''}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
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

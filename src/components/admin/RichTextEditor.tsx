'use client';

import { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css';

// Register the style-based align attributor ONCE (module scope, runs on first import).
// This makes Quill output  style="text-align: right"  instead of  class="ql-align-right",
// which means alignment survives clipboard.dangerouslyPasteHTML round-trips reliably.
// Using a cached Promise instead of a mutable boolean ensures exactly one registration
// even under concurrent calls, and avoids module-level mutable state.
let alignPromise: Promise<void> | null = null;
function registerAlignStyle(): Promise<void> {
  if (!alignPromise) {
    alignPromise = import('quill').then((Quill) => {
      const AlignStyle = Quill.default.import('attributors/style/align') as any;
      Quill.default.register(AlignStyle, true);
    });
  }
  return alignPromise;
}

export type RichTextToolbarType = 'title' | 'subtitle' | 'full';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Controls which toolbar is rendered. Defaults to 'full'. */
  toolbarType?: RichTextToolbarType;
  /** When set, shows a character counter below the editor (counts plain-text length). */
  maxLength?: number;
}

// Title: size, bold, italic, underline, align, color
const TITLE_TOOLBAR = [
  [{ 'size': ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline'],
  [{ 'align': [] }],
  [{ 'color': [] }],
  ['clean'],
];

// Subtitle: same as title
const SUBTITLE_TOOLBAR = TITLE_TOOLBAR;

// Full: all options
const FULL_TOOLBAR = [
  [{ 'header': [1, 2, 3, false] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'align': [] }],
  ['link'],
  [{ 'color': [] }, { 'background': [] }],
  ['clean'],
];

function getToolbar(type: RichTextToolbarType) {
  if (type === 'title') return TITLE_TOOLBAR;
  if (type === 'subtitle') return SUBTITLE_TOOLBAR;
  return FULL_TOOLBAR;
}

function getMinHeight(type: RichTextToolbarType) {
  return type === 'full' ? 180 : 72;
}

/** Strip HTML tags to count visible characters */
function plainTextLength(html: string): number {
  if (!html || html === '<p><br></p>') return 0;
  return html.replace(/<[^>]*>/g, '').length;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  toolbarType = 'full',
  maxLength,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isInitializing = useRef(false);
  const isProgrammaticUpdate = useRef(false);
  // Always hold the latest onChange so the Quill listener never goes stale
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [charCount, setCharCount] = useState(() => plainTextLength(value));

  const minH = getMinHeight(toolbarType);

  useEffect(() => {
    if (!editorRef.current || isInitializing.current) return;

    isInitializing.current = true;

    import('quill').then(async (Quill) => {
      if (!editorRef.current || quillRef.current) return;

      await registerAlignStyle();

      const QuillClass = Quill.default;

      const quill = new QuillClass(editorRef.current, {
        theme: 'snow',
        modules: { toolbar: getToolbar(toolbarType) },
        placeholder: placeholder || 'Enter text...',
      });

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on('text-change', () => {
        if (isProgrammaticUpdate.current) return;
        const html = quill.root.innerHTML;
        const isEmpty = html === '<p><br></p>';
        const result = isEmpty ? '' : html;
        setCharCount(plainTextLength(result));
        onChangeRef.current(result);
      });

      quillRef.current = quill;
    });

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
      isInitializing.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync value when changed externally (e.g. language tab switch)
  useEffect(() => {
    if (!quillRef.current) return;

    const currentContent = quillRef.current.root.innerHTML;
    const normalizedCurrent = currentContent === '<p><br></p>' ? '' : currentContent;
    const normalizedValue = value || '';

    if (normalizedCurrent !== normalizedValue) {
      isProgrammaticUpdate.current = true;
      quillRef.current.clipboard.dangerouslyPasteHTML(normalizedValue);
      isProgrammaticUpdate.current = false;
      setCharCount(plainTextLength(normalizedValue));
    }
  }, [value]);

  const isOverLimit = maxLength !== undefined && charCount > maxLength;

  return (
    <div className={`rich-text-editor rte-${toolbarType} ${className || ''}`}>
      <div ref={editorRef} />

      {maxLength !== undefined && (
        <p className={`mt-1 text-xs text-right ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
          {charCount} / {maxLength}
        </p>
      )}

      <style jsx global>{`
        /* ── Shared ── */
        .rich-text-editor .ql-toolbar {
          background-color: white;
          border: 1px solid rgb(209 213 219);
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .rich-text-editor .ql-container {
          border: 1px solid rgb(209 213 219);
          border-radius: 0 0 0.5rem 0.5rem;
          font-size: 14px;
          background-color: rgb(249 250 251);
        }
        .rich-text-editor .ql-editor {
          color: rgb(17 24 39);
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgb(156 163 175);
        }

        /* ── Title / Subtitle (compact) ── */
        .rte-title .ql-container,
        .rte-title .ql-editor,
        .rte-subtitle .ql-container,
        .rte-subtitle .ql-editor {
          min-height: ${minH}px;
        }

        /* ── Full (description) ── */
        .rte-full .ql-container,
        .rte-full .ql-editor {
          min-height: 180px;
        }
      `}</style>
    </div>
  );
}

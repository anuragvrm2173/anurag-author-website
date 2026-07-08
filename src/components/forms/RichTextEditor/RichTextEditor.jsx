import "./RichTextEditor.css";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function RichTextEditor({ label, value, onChange, helperText }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-text-editor__content",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  return (
    <div className="rich-text-editor">
      {label ? <label className="rich-text-editor__label">{label}</label> : null}
      <div className="rich-text-editor__toolbar">
        <button type="button" className="rich-text-editor__button" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
        <button type="button" className="rich-text-editor__button" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
        <button type="button" className="rich-text-editor__button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className="rich-text-editor__button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>List</button>
        <button type="button" className="rich-text-editor__button" onClick={() => editor?.chain().focus().setParagraph().run()}>Paragraph</button>
      </div>
      <EditorContent editor={editor} />
      {helperText ? <p className="rich-text-editor__helper">{helperText}</p> : null}
    </div>
  );
}

export default RichTextEditor;
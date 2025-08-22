'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEffect, useRef } from 'react'
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaListUl,
    FaListOl,
    FaQuoteLeft,
    FaCode
} from 'react-icons/fa'

export const RichTextEditor = ({
    value,
    onChange
}: {
    value: string
    onChange: (value: string) => void
}) => {
    // Your original, correct refs for managing state
    const isInitialized = useRef(false)
    const lastValue = useRef(value)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            // Cleaned-up extensions. All list configuration is inside StarterKit.
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc pl-8',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal pl-8',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-gray-300 pl-4 italic my-4',
                    },
                },
            }),
            Underline,
        ],
        // Set initial content directly.
        content: value,
        // Your original onUpdate logic which prevents unnecessary re-renders.
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            if (html !== lastValue.current) {
                lastValue.current = html
                onChange(html)
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base min-h-[200px] w-full max-w-none p-4 focus:outline-none',
            },
        },
    })

    // This effect ensures content is set on mount, but only once.
    // This is the key to preventing the loop in your specific setup.
    useEffect(() => {
        if (editor && !isInitialized.current) {
            isInitialized.current = true
            // It's often good practice to reset the lastValue ref when
            // programmatically setting content to avoid stale state.
            lastValue.current = value
            editor.commands.setContent(value)
        }
    }, [editor, value])


    if (!editor) {
        return <div className="min-h-[200px] p-4 border rounded-lg">Loading editor...</div>
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
                {/* Adding type="button" to prevent form submissions */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    title="Bold"
                    type="button"
                >
                    <FaBold />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    title="Italic"
                    type="button"
                >
                    <FaItalic />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    title="Underline"
                    type="button"
                >
                    <FaUnderline />
                </button>
                <div className="border-l border-gray-300 mx-1 h-8"></div>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    title="Bullet List"
                    type="button"
                >
                    <FaListUl />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    title="Numbered List"
                    type="button"
                >
                    <FaListOl />
                </button>
                <div className="border-l border-gray-300 mx-1 h-8"></div>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    title="Blockquote"
                    type="button"
                >
                    <FaQuoteLeft />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    title="Code Block"
                    type="button"
                >
                    <FaCode />
                </button>
            </div>

            <EditorContent className='prose' editor={editor} />
        </div>
    )
}
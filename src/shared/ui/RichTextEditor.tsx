import { useEffect, useState, type ReactNode } from 'react'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Popover } from 'radix-ui'
import {
  Bold,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
  Unlink,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from './Button'
import { popoverSurface } from './styles'

interface RichTextEditorProps {
  id?: string
  /** The stored HTML (or plain text, which becomes a paragraph) */
  value: string
  onChange: (html: string) => void
  invalid?: boolean
}

/** Same allowlist as the display side (shared/lib/html): http(s), mailto and tel links only. */
const SAFE_HREF = /^(https?:\/\/|mailto:|tel:)/i

/**
 * Rich-text field for texts the app shows formatted (FAQ answers, About us, notification content,
 * News descriptions). It writes the same simple HTML u-code's editor wrote: paragraphs, bold,
 * italic, underline, headings, lists and links. Our own toolbar and link popover, no browser
 * prompts (DESIGN.md §3).
 */
export function RichTextEditor({ id, value, onChange, invalid }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // Not part of what the app renders
        code: false,
        codeBlock: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
          protocols: ['http', 'https', 'mailto', 'tel'],
          isAllowedUri: (url) => SAFE_HREF.test(url),
          HTMLAttributes: { target: '_blank', rel: 'noreferrer' },
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class:
          'min-h-40 px-3 py-2.5 outline-none space-y-2 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5',
      },
    },
    // Only the user's edits report a change, so loading a text never marks the form as edited
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  })

  // A value changed from outside (e.g. the form was reset): show it, without reporting an edit
  useEffect(() => {
    if (!editor || editor.isFocused) return
    const current = editor.isEmpty ? '' : editor.getHTML()
    if (value !== current) editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  return (
    <div
      aria-invalid={invalid || undefined}
      className="overflow-hidden rounded-md border border-line bg-surface focus-within:border-fg-muted aria-invalid:border-danger-text"
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  // Re-renders the toolbar when the selection's formatting changes
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      heading: e.isActive('heading', { level: 2 }),
      bullets: e.isActive('bulletList'),
      numbers: e.isActive('orderedList'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })
  const chain = () => editor.chain().focus()

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-surface-muted px-1.5 py-1">
      <Tool
        icon={Bold}
        label="Bold"
        active={state.bold}
        onClick={() => chain().toggleBold().run()}
      />
      <Tool
        icon={Italic}
        label="Italic"
        active={state.italic}
        onClick={() => chain().toggleItalic().run()}
      />
      <Tool
        icon={Underline}
        label="Underline"
        active={state.underline}
        onClick={() => chain().toggleUnderline().run()}
      />
      <Divider />
      <Tool
        icon={Heading2}
        label="Heading"
        active={state.heading}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      />
      <Tool
        icon={List}
        label="Bulleted list"
        active={state.bullets}
        onClick={() => chain().toggleBulletList().run()}
      />
      <Tool
        icon={ListOrdered}
        label="Numbered list"
        active={state.numbers}
        onClick={() => chain().toggleOrderedList().run()}
      />
      <Divider />
      <LinkTool editor={editor} active={state.link} />
      <div className="ml-auto flex items-center gap-0.5">
        <Tool
          icon={Undo2}
          label="Undo"
          disabled={!state.canUndo}
          onClick={() => chain().undo().run()}
        />
        <Tool
          icon={Redo2}
          label="Redo"
          disabled={!state.canRedo}
          onClick={() => chain().redo().run()}
        />
      </div>
    </div>
  )
}

function Tool({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the caret in the text: a button that took focus would swallow what's typed next
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'grid size-8 place-items-center rounded-xs text-fg-muted transition-colors hover:bg-surface hover:text-fg disabled:pointer-events-none disabled:opacity-40',
        active && 'bg-surface text-fg shadow-[inset_0_0_0_1px_var(--color-line)]',
      )}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  )
}

const Divider = () => <span aria-hidden className="mx-1 h-5 w-px bg-line" />

/** Add, change or remove the link on the selected text, in our own popover. */
function LinkTool({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false)
  const [href, setHref] = useState('')
  const [error, setError] = useState<ReactNode>(null)

  const apply = () => {
    const url = href.trim()
    if (!SAFE_HREF.test(url)) {
      setError('Use a full address: https://…, mailto: or tel:')
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    setOpen(false)
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) {
          setHref((editor.getAttributes('link').href as string | undefined) ?? '')
          setError(null)
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Link"
          title="Link"
          aria-pressed={active}
          className={cn(
            'grid size-8 place-items-center rounded-xs text-fg-muted transition-colors hover:bg-surface hover:text-fg',
            active && 'bg-surface text-fg shadow-[inset_0_0_0_1px_var(--color-line)]',
          )}
        >
          <Link2 size={16} strokeWidth={2} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={6} align="start" className={cn(popoverSurface, 'w-80 p-3')}>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              apply()
            }}
          >
            <label htmlFor="rich-link" className="font-medium">
              Link address
            </label>
            <input
              id="rich-link"
              autoFocus
              value={href}
              onChange={(e) => {
                setHref(e.target.value)
                setError(null)
              }}
              placeholder="https://"
              className="h-10 rounded-sm border border-line bg-surface px-3 outline-none focus:border-fg-muted"
            />
            {error && <p className="text-xs text-danger-text">{error}</p>}
            <div className="mt-1 flex items-center justify-between gap-2">
              {active ? (
                <Button
                  type="button"
                  variant="danger-ghost"
                  icon={Unlink}
                  onClick={() => {
                    editor.chain().focus().extendMarkRange('link').unsetLink().run()
                    setOpen(false)
                  }}
                >
                  Remove link
                </Button>
              ) : (
                <span />
              )}
              <Button type="submit">{active ? 'Update' : 'Add link'}</Button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

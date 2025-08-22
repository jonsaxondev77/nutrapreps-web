import { RichTextEditor } from "@/lib/fields/RichTextEditor";

export const richTextField = (label: string) => ({
  type: 'custom' as const,
  label,
  render: ({ value, onChange }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <RichTextEditor 
        value={value || ''}
        onChange={onChange}
      />
    </div>
  )
})
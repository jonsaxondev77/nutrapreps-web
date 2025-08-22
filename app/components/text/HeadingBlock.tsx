import { ComponentConfig } from "@measured/puck";

export type HeadingBlockProps = {
    title: string;
    headingLevel?: string;
};

const headingStyles = {
    Heading1: {
        tag: "h1" as const,
        className: "text-6xl md:text-5xl font-bold text-gray-900 tracking-tight",
    },
    Heading2: {
        tag: "h2" as const,
        className: "text-5xl md:text-4xl font-bold text-gray-800 tracking-tight",
    },
    Heading3: {
        tag: "h3" as const,
        className: "text-4xl md:text-3xl font-bold text-gray-800",
    },
    Heading4: {
        tag: "h4" as const,
        className: "text-3xl md:text-2xl font-bold text-gray-700",
    },
    Heading5: {
        tag: "h5" as const,
        className: "text-2xl md:text-xl font-bold text-gray-700",
    },
    Heading6: {
        tag: "h6" as const,
        className: "text-xl md:text-lg font-bold text-gray-600",
    },
};

export const HeadingBlock: ComponentConfig<HeadingBlockProps> = {
    fields: {
        title: { label: "Heading text", type: "text" },
        headingLevel: { 
            label: "Heading level",
            type: "select",
            options: [
                { label: "Heading 1", value: "Heading1" },
                { label: "Heading 2", value: "Heading2" },
                { label: "Heading 3", value: "Heading3" },
                { label: "Heading 4", value: "Heading4" },
                { label: "Heading 5", value: "Heading5" },
                { label: "Heading 6", value: "Heading6" }
            ]
        }
    },
    defaultProps: {
        title: "Your Meal Prep, Perfected",
        headingLevel: "Heading2"
    },
    render: ({ title, headingLevel }) => {
        const { tag: Tag, className } = headingStyles[headingLevel] || headingStyles.Heading2;
        return (
            <div className="py-16 px-4 text-center bg-gray-50">
                <Tag className={className}>{title}</Tag>
            </div>
        )
    }
}
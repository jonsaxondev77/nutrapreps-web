import { ComponentConfig } from "@measured/puck";

export type SectionHeadingBlockProps = {
    title: string;
    headingLevel?: string;
    subtitle: string;
};

const headingStyles = {
    Heading1: {
        tag: "h1" as const,
        className: "text-6xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2",
    },
    Heading2: {
        tag: "h2" as const,
        className: "text-5xl md:text-4xl font-bold text-gray-800 tracking-tight mb-2",
    },
    Heading3: {
        tag: "h3" as const,
        className: "text-4xl md:text-3xl font-bold text-gray-800 mb-2",
    },
    Heading4: {
        tag: "h4" as const,
        className: "text-3xl md:text-2xl font-bold text-gray-700 mb-2",
    },
    Heading5: {
        tag: "h5" as const,
        className: "text-2xl md:text-xl font-bold text-gray-700 mb-2",
    },
    Heading6: {
        tag: "h6" as const,
        className: "text-xl md:text-lg font-bold text-gray-600 mb-2",
    },
};

export const SectionHeadingBlock: ComponentConfig<SectionHeadingBlockProps> = {
    fields: {
        title: { label: "Section hading content", type: "text" },
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
        },
        subtitle: { label: "Section subheading", type: "text" }
    },
    defaultProps: {
        title: "A clear and bold heading",
        headingLevel: "Heading1",
        subtitle: "A more subdued subheading"
    },
    render: ({ title, headingLevel, subtitle }) => {
        const { tag: Tag, className } = headingStyles[headingLevel] || headingStyles.Heading2;
        return (
            <div className="py-20 px-6 text-center bg-white">
                <Tag className={className}>{title}</Tag>
                 <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-xl">
                    {subtitle}
                </p>
            </div>
        )
    }
}
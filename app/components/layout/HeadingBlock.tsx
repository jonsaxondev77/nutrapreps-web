import { ComponentConfig } from "@measured/puck";

export type HeadingBlockProps = {
    title: string;
    subtitle?: string;
};

export const HeadingBlock: ComponentConfig<HeadingBlockProps> = {
    fields: {
        title: { type: "text" },
        subtitle: { type: "text" }
    },
    defaultProps: {
        title: "Your Meal Prep, Perfected",
        subtitle: "Fresh, healthy, and delicious meals delivered to your door."
    },
    render: ({ title, subtitle }) => {
        return (
            <div className="py-16 px-4 text-center bg-gray-50">
                <h1 className="text-6xl md:text-5xl font-bold text-gray-900 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
            </div>
        )
    }
}
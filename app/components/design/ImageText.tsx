import { richTextField } from "@/lib/fields/RichTextField";
import { ComponentConfig } from "@measured/puck"
import classNames from "classnames";

export type ImageTextBlockProps = {
    imageUrl: string;
    title: string;
    content: string;
    imagePosition: "left" | "right";
}

export const ImageTextBlock: ComponentConfig<ImageTextBlockProps> = {
    fields: {
        imageUrl: { type: "text", label: "Image URL" },
        title: { type: "text", label: "Title" },
        content: richTextField("Content"),
        imagePosition: {
            type: "radio",
            options: [
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
            ],
        },
    },
    defaultProps: {
        imageUrl: "https://placehold.co/600x400/EEE/31343C?text=Feature+Image",
        title: "Feature Title",
        content:
            "<p>Describe the feature in detail here. Explain the benefits and how it helps the user achieve their goals.</p>",
        imagePosition: "left",
    },
    render: ({ imageUrl, title, content, imagePosition }) => {
        const image = (
            <div className="w-full md:w-1/2">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
        );

        const text = (
            <div className="w-full md:w-1/2 flex items-center p-8">
                <div>
                    <h2 className="text-3xl font-bold mb-4">{title}</h2>
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </div>
        );

        return (
            <div className="py-12 px-4">
                <div
                    className={classNames("flex flex-col md:flex-row gap-8 max-w-7xl mx-auto", {
                        "md:flex-row-reverse": imagePosition === "right",
                    })}
                >
                    {image}
                    {text}
                </div>
            </div>
        );
    },
}
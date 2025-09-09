import { NonceContext } from "@/app/context/NonceContext";
import { bunnyImageField } from "@/lib/fields/BunnyImageField";
import { richTextField } from "@/lib/fields/RichTextField";
import { ComponentConfig } from "@measured/puck"
import classNames from "classnames";
import { useContext } from "react";

export type HeroBlockProps = {
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
    align: "left" | "center" | "right";
}

export const HeroBlock: ComponentConfig<HeroBlockProps> = {
    fields: {
        title: { type: "text" },
        subtitle: richTextField("Subtitle"),
        backgroundImageUrl: bunnyImageField("Background Image"),
        align: {
            type: "radio",
            options: [
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" }
            ]
        }
    },
    defaultProps: {
        title: "Healthy Meals, Delivered.",
        subtitle: "Stop stressing about what to eat. We deliver fresh, delicious, and healthy meals right to your doorstep. Ready in minutes.",
        backgroundImageUrl: "https://placehold.co/1920x1080/cccccc/666666?text=Hero+Background",
        align: "left",
    },
    render: ({ title, subtitle, backgroundImageUrl, align }) => {

        const nonce = useContext(NonceContext);

        function getBackgroundImage(srcOrSrcSet = '') {
            if (!srcOrSrcSet.includes(' ')) {
                return `url("${srcOrSrcSet}")`;
            }

            const imageSet = srcOrSrcSet
                .split(', ')
                .map((str) => {
                    const [url, dpi] = str.split(' ');
                    return `url("${url}") ${dpi}`;
                })
                .join(', ');

            return `image-set(${imageSet})`;
        }

        const containerAlignClasses = {
            left: "items-start",
            center: "items-center",
            right: "items-end",
        };

        const textAlignClasses = {
            left: "text-left",
            center: "text-center",
            right: "text-right",
        };

        const backgroundImage = getBackgroundImage(backgroundImageUrl);

        return (
           <>
            <div
                className="relative w-full h-[70vh] min-h-[400px] text-white"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                    nonce={nonce}
                />
            
               

                <div
                    className={classNames(
                        "relative z-20 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                        containerAlignClasses[align] || containerAlignClasses.left
                    )}
                >
                    <div
                        className={classNames(
                            "max-w-2xl",
                            textAlignClasses[align] || textAlignClasses.left
                        )}
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            {title}
                        </h1>
                        <div
                            className="mt-6 text-xl prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: subtitle }}
                        />
                    </div>
                </div>
            </div>
        </>
        );
    }
}
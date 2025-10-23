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
    // 1. ADD NEW PROP
    textStyle: "light" | "dark";
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
        },
        // 2. ADD NEW FIELD
        textStyle: {
            type: "radio",
            label: "Text Style",
            options: [
                { label: "Light Text (Dark Background)", value: "light" },
                { label: "Dark Text (Light Background)", value: "dark" }
            ],
            default: "light", // Default to light text, as is common for hero blocks
        }
    },
    defaultProps: {
        title: "Healthy Meals, Delivered.",
        subtitle: "Stop stressing about what to eat. We deliver fresh, delicious, and healthy meals right to your doorstep. Ready in minutes.",
        backgroundImageUrl: "https://placehold.co/1920x1080/cccccc/666666?text=Hero+Background",
        align: "left",
        // 2. ADD DEFAULT PROP
        textStyle: "light",
    },
    render: ({ title, subtitle, backgroundImageUrl, align, textStyle }) => { // Update props destructuring

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

        // 3. TEXT AND OVERLAY CLASSES
        const isDarkText = textStyle === 'dark';

        const textColorClass = isDarkText ? "text-gray-900" : "text-white";

        // This overlay is useful when the background image is too busy/light
        // It's applied over the background image but under the content
        const overlayClass = isDarkText ? 
            "bg-black/20" : // Subtle dark overlay for light text
            "bg-white/20";  // Subtle light overlay for dark text (or you can use a fixed dark one like bg-black/40)


        const backgroundImage = getBackgroundImage(backgroundImageUrl);

        return (
            <>
            <div
                className={classNames(
                    "relative w-full h-[70vh] min-h-[400px]",
                    textColorClass // Apply the main text color
                )}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: backgroundImage }}
                    nonce={nonce}
                />
                
                {/* Add a subtle background overlay for contrast */}
                <div 
                    className={classNames(
                        "absolute inset-0 z-10",
                        isDarkText ? "bg-white/50" : "bg-black/50" // You may need to tweak these for best visibility
                    )}
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
                        {/* Adjust h1 text color utility if needed, but it should inherit */}
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            {title}
                        </h1>
                        <div
                            // Adjust prose class based on text style
                            className={classNames(
                                "mt-6 text-xl prose max-w-none",
                                isDarkText ? "prose-gray" : "prose-invert"
                            )}
                            dangerouslySetInnerHTML={{ __html: subtitle }}
                        />
                    </div>
                </div>
            </div>
        </>
        );
    }
}
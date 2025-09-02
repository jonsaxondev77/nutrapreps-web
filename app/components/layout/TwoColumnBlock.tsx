import {Slot} from "@measured/puck";
import { ComponentConfig } from "@measured/puck"
import classNames from "classnames";

export type TwoColumnBlockProps = {
    distribution: "50/50" | "33/67" | "67/37";
    column1: Slot;
    column2: Slot;
    backgroundColor: "white" | "gray" | "green";
    padding: "none" | "small" | "medium" | "large";
}

export const TwoColumnBlock: ComponentConfig<TwoColumnBlockProps> = {
    fields: {
        distribution: {
            type: "select",
            options: [
                { label: "50/50", value: "50/50" },
                { label: "33/67", value: "33/67" },
                { label: "67/33", value: "67/33" },
            ]
        },
        column1: { type: "slot" },
        column2: { type: "slot" },
        backgroundColor: {
            label: "Background Color",
            type: "select",
            options: [
                { label: "White", value: "white" },
                { label: "Light Gray", value: "gray" },
                { label: "Green", value: "green" },
            ],
        },
        padding: {
            label: "Padding",
            type: "select",
            options: [
                { label: "None", value: "none" },
                { label: "Small", value: "small" },
                { label: "Medium", value: "medium" },
                { label: "Large", value: "large" },
            ],
        },
    },
    defaultProps: {
        distribution: "50/50",
        backgroundColor: "white",
        padding: "medium",
        column1: [],
        column2: []
    },
    render: ({distribution, column1: Column1, column2: Column2, backgroundColor, padding}) => {
        const distributionClasses = {
          "50/50": ["w-full md:w-1/2", "w-full md:w-1/2"],
          "33/67": ["w-full md:w-1/3", "w-full md:w-2/3"],
          "67/33": ["w-full md:w-2/3", "w-full md:w-1/3"],
        };

        const backgroundClasses = {
          white: "bg-white text-gray-800",
          gray: "bg-gray-50 text-gray-800",
          green: "bg-green-600 text-white",
        };

        const paddingClasses = {
            none: "py-0",
            small: "py-8",
            medium: "py-20",
            large: "py-32",
        };

        const [leftClasses, rightClasses] =
          distributionClasses[distribution] || distributionClasses["50/50"];

        return (
          <div className={classNames(paddingClasses[padding], backgroundClasses[backgroundColor])}>
            <div className="container mx-auto px-6">
              <div className="flex flex-wrap md:flex-nowrap">
                <div className={classNames(leftClasses, "p-5 min-h-[100px]")}>
                  <Column1 />
                </div>
                <div className={classNames(rightClasses, "p-5 min-h-[100px]")}>
                  <Column2 />
                </div>
              </div>
            </div>
          </div>
        );
    }
}


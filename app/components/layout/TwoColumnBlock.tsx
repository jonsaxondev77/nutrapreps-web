import {Slot} from "@measured/puck";
import { ComponentConfig, Content } from "@measured/puck"
import classNames from "classnames";

export type TwoColumnBlockProps = {
    distribution: "50/50" | "33/67" | "67/37";
    column1: Slot;
    column2: Slot;
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
        column2: { type: "slot" }
    },    
    render: ({distribution, column1: Column1, column2: Column2}) => {
        const distributionClasses = {
          "50/50": ["w-full md:w-1/2", "w-full md:w-1/2"],
          "33/67": ["w-full md:w-1/3", "w-full md:w-2/3"],
          "67/33": ["w-full md:w-2/3", "w-full md:w-1/3"],
        };

        const [leftClasses, rightClasses] =
          distributionClasses[distribution] || distributionClasses["50/50"];

        return (
          <div className="flex">
            <div className={classNames(leftClasses, "p-5 min-h-[100px]")}>
              <Column1 />
            </div>
            <div className={classNames(rightClasses, "p-5 min-h-[100px]")}>
              <Column2 />
            </div>
          </div>
        );
    }
}
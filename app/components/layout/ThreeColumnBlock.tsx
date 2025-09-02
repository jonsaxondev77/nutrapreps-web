import { Slot } from "@measured/puck";
import { ComponentConfig } from "@measured/puck"
import classNames from "classnames";

export type ThreeColumnBlockProps = {
  column1: Slot;
  column2: Slot;
  column3: Slot;
  backgroundColor: "white" | "gray" | "green";
  padding: "none" | "small" | "medium" | "large";
}

export const ThreeColumnBlock: ComponentConfig<ThreeColumnBlockProps> = {
  fields: {
    column1: { type: "slot" },
    column2: { type: "slot" },
    column3: { type: "slot" },
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
    backgroundColor: "white",
    padding: "none",
    column1: [],
    column2: [],
    column3: [],
  },
  render: ({ column1: Column1, column2: Column2, column3: Column3, backgroundColor, padding }) => {
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
    return (
      <div className={classNames("py-20", paddingClasses[padding], backgroundClasses[backgroundColor])}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="min-h-[100px]"><Column1 /></div>
            <div className="min-h-[100px]"><Column2 /></div>
            <div className="min-h-[100px]"><Column3 /></div>
          </div>
        </div>
      </div>
    );
  }
}

import { Slot } from "@measured/puck";
import { ComponentConfig } from "@measured/puck"
import classNames from "classnames";

export type FourColumnBlockProps = {
  column1: Slot;
  column2: Slot;
  column3: Slot;
  column4: Slot;
  backgroundColor: "white" | "gray" | "green";
  padding: "none" | "small" | "medium" | "large";
}

export const FourColumnBlock: ComponentConfig<FourColumnBlockProps> = {
  fields: {
    column1: { type: "slot" },
    column2: { type: "slot" },
    column3: { type: "slot" },
    column4: { type: "slot" },
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
      padding: "medium",
      column1: [],
      column2: [],
      column3: [],
      column4: [],
  },
  render: ({ column1: Column1, column2: Column2, column3: Column3, column4: Column4, backgroundColor, padding }) => {
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
      <div className={classNames(paddingClasses[padding], backgroundClasses[backgroundColor])}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            <div className="h-full flex [&>*]:w-full">
              <Column1 />
            </div>
            <div className="h-full flex [&>*]:w-full">
              <Column2 />
            </div>
            <div className="h-full flex [&>*]:w-full">
              <Column3 />
            </div>
            <div className="h-full flex [&>*]:w-full">
              <Column4 />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


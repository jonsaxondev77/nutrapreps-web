import { Slot } from "@measured/puck";
import { ComponentConfig } from "@measured/puck";
import classNames from "classnames";

export type OneColumnBlockProps = {
  content: Slot;
  backgroundColor: "white" | "gray" | "green";
  padding: "none" | "small" | "medium" | "large";
};

export const OneColumnBlock: ComponentConfig<OneColumnBlockProps> = {
  fields: {
    content: {
      type: "slot",
    },
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
    content: [],
  },
  render: ({ content: Content, backgroundColor, padding }) => {
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
          <Content />
        </div>
      </div>
    );
  },
};
import { Slot } from "@measured/puck";
import { ComponentConfig } from "@measured/puck";
import classNames from "classnames";

export type OneColumnBlockProps = {
  content: Slot;
  backgroundColor: "white" | "gray" | "green";
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
  },
  defaultProps: {
    backgroundColor: "white",
    content: [], // Add default for the required 'content' slot
  },
  render: ({ content: Content, backgroundColor }) => {
    const backgroundClasses = {
      white: "bg-white text-gray-800",
      gray: "bg-gray-50 text-gray-800",
      green: "bg-green-600 text-white",
    };

    return (
      <div className={classNames("pt-0 pb-20", backgroundClasses[backgroundColor])}>
        <div className="container mx-auto px-6">
          <Content />
        </div>
      </div>
    );
  },
};

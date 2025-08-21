import { Slot } from "@measured/puck";
import { ComponentConfig, Content } from "@measured/puck"
import classNames from "classnames";

export type ThreeColumnBlockProps = {
  column1: Slot;
  column2: Slot;
  column3: Slot;
}

export const ThreeColumnBlock: ComponentConfig<ThreeColumnBlockProps> = {
  fields: {
    column1: { type: "slot" },
    column2: { type: "slot" },
    column3: { type: "slot" }
  },
  render: ({ column1: Column1, column2: Column2, column3: Column3 }) => {
    return (
      <div className="flex">
        <div className="w-full md:w-1/3 p-5 min-h-[100px]">
          <Column1 />
        </div>
        <div className="w-full md:w-1/3 p-5 min-h-[100px]">
          <Column2 />
        </div>
        <div className="w-full md:w-1/3 p-5 min-h-[100px]">
          <Column3 />
        </div>
      </div>
    );
  }
}
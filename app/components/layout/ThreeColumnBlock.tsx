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
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="min-h-[100px]"><Column1 /></div>
          <div className="min-h-[100px]"><Column2 /></div>
          <div className="min-h-[100px]"><Column3 /></div>
        </div>
      </div>
    );
  }
}
import { Slot } from "@measured/puck";
import { ComponentConfig, Content } from "@measured/puck"
import classNames from "classnames";

export type FourColumnBlockProps = {
  column1: Slot;
  column2: Slot;
  column3: Slot;
  column4: Slot;
}

export const FourColumnBlock: ComponentConfig<FourColumnBlockProps> = {
  fields: {
    column1: { type: "slot" },
    column2: { type: "slot" },
    column3: { type: "slot" },
    column4: { type: "slot" }
  },
  render: ({ column1: Column1, column2: Column2, column3: Column3, column4: Column4 }) => {
    return (
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          <div className="h-full flex">
            <Column1 />
          </div>
          <div className="h-full flex">
            <Column2 />
          </div>
          <div className="h-full flex">
            <Column3 />
          </div>
          <div className="h-full flex">
            <Column4 />
          </div>
        </div>
      </div>
    );
  }
}
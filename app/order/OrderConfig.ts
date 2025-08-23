import type { ComponentConfig } from "@measured/puck";
import Order from "./Order";

export type OrderProps = {
  title: string;
};

export const OrderConfig: ComponentConfig<OrderProps> = {
  render: Order,
  fields: {
    title: {
      type: 'text',
      label: 'Menu Title'
    },
  },
  defaultProps: {
    title: "Order",
  },
  label: "Ordering",
};

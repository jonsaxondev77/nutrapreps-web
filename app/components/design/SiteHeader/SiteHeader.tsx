import type { ComponentConfig } from "@measured/puck";
import Link from "next/link";
import { HeaderClient } from "./HeaderClient";

export type SiteHeaderProps = {
  logoUrl: string;
  links: {
    label: string;
    url: string;
  }[];
};

export const SiteHeader: ComponentConfig<SiteHeaderProps> = {
  fields: {
    logoUrl: {
      type: "text",
      label: "Logo URL",
    },
    links: {
      type: "array",
      arrayFields: {
        label: { type: "text" },
        url: { type: "text" },
      },
      defaultItemProps: {
        label: "Link",
        url: "#",
      },
    },
  },
  defaultProps: {
    logoUrl: "https://placehold.co/120x50/31343C/FFFFFF?text=Logo",
    links: [
      { label: "How It Works", url: "/" },
      { label: "Our Menu", url: "/about" },
      { label: "Pricing", url: "/menu" },
      { label: "FAQ", url: "/contact" },
    ],
  },
  render: (props) => {
    return <HeaderClient {...props} />;
  },
};

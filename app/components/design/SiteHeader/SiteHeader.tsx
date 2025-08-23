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
    logoUrl: "/images/logo.png",
    links: [
      { label: "How It Works", url: "#SectionHeadingBlock-4a88a956-532f-4711-a31d-66420d296d22" },
      { label: "Our Menu", url: "#SectionHeadingBlock-9ff6afb0-6ba4-4da2-8e6b-49e5864ab207" },
      { label: "Pricing", url: "#SectionHeadingBlock-98c75c65-28d6-4f8d-abb3-ecd20c90a440" },
      { label: "FAQ", url: "#SectionHeadingBlock-0aa24c29-c8f2-46d1-b7f6-68247ac6b56d" },
    ],
  },
  render: (props) => {
    return <HeaderClient {...props} />;
  },
};

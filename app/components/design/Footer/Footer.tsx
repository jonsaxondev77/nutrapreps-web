import type { ComponentConfig } from "@measured/puck";
import { FooterClient } from "./FooterClient";

// Define the structure for a single link
type LinkItem = {
  label: string;
  url: string;
};

// Define the structure for a column of links
type LinkColumn = {
  title: string;
  links: LinkItem[];
};

// Define the structure for a social media link
type SocialLink = {
  platform: "Facebook" | "Instagram" | "Twitter";
  url: string;
};

export type FooterProps = {
  logoText: string;
  tagline: string;
  linkColumns: LinkColumn[];
  socialLinks: SocialLink[];
  copyrightText: string;
};

export const Footer: ComponentConfig<FooterProps> = {
  fields: {
    logoText: { type: "text" },
    tagline: { type: "text" },
    linkColumns: {
      type: "array",
      label: "Link Columns",
      arrayFields: {
        title: { type: "text" },
        links: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            url: { type: "text" },
          },
        },
      },
    },
    socialLinks: {
      type: "array",
      label: "Social Media Links",
      arrayFields: {
        platform: {
          type: "select",
          options: [
            { label: "Facebook", value: "Facebook" },
            { label: "Instagram", value: "Instagram" },
            { label: "Twitter", value: "Twitter" },
          ],
        },
        url: { type: "text" },
      },
    },
    copyrightText: { type: "text" },
  },
  defaultProps: {
    logoText: "Nutrapreps",
    tagline: "Healthy eating, made easy.",
    linkColumns: [
      {
        title: "Company",
        links: [
          { label: "About Us", url: "/about" },
          { label: "Careers", url: "/careers" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Contact Us", url: "/contact-us" },
          { label: "FAQ", url: "/faqs" },
          { label: "Terms of Service", url: "/terms-of-service" },
        ],
      },
    ],
    socialLinks: [
      { platform: "Facebook", url: "#" },
      { platform: "Instagram", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
    copyrightText: "© 2024 Nutrapreps. All rights reserved.",
  },
  render: (props) => {
    return <FooterClient {...props} />;
  },
};
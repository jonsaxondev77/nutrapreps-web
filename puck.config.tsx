import type { Config } from "@measured/puck";
import { components } from "./app/components";

export const config: Config<any> = {
  categories: {
    layout: {
      title: "Layout",
      components: ["OneColumnBlock", "TwoColumnBlock", "ThreeColumnBlock", "FourColumnBlock"]
    },
    design: {
      title: "Design",
      components: ["Button", "AccordionBlock", "Card", "Divider","ImageTextBlock", "PricingCard", "TestimonialCard"]
    },
    text: {
      title: "Text",
      components: ["HeadingBlock", "SectionHeadingBlock", "RichTextBlock"]
    },
    media: {
      title: "Media",
      components: ["HeroBlock"]
    }
  },
  components: components
};

export default config;

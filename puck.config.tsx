import type { Config } from "@measured/puck";
import { components } from "./app/components";

export const config: Config<any> = {
  categories: {
    layout: {
      title: "Layout",
      components: ["HeadingBlock", "OneColumnBlock", "TwoColumnBlock", "ThreeColumnBlock", "FourColumnBlock"]
    }
  },
  components: components
};

export default config;

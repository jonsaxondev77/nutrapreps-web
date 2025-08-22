import type { ComponentConfig } from "@measured/puck";

export type ButtonProps = {
  buttonText: string;
  buttonLink: string;
  style: "primary" | "secondary";
  align: "left" | "center" | "right";
};

export const Button: ComponentConfig<ButtonProps> = {
  fields: {
    buttonText: { type: "text" },
    buttonLink: { type: "text" },
    style: {
      type: "radio",
      options: [
        { label: "Primary (Green)", value: "primary" },
        { label: "Secondary (Dark)", value: "secondary" },
      ],
    },
    align: {
        type: "radio",
        options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
        ]
    }
  },
  defaultProps: {
    buttonText: "Get Started",
    buttonLink: "#pricing",
    style: "primary",
    align: "center",
  },
  render: ({ buttonText, buttonLink, style, align }) => {
    const primaryClasses = "bg-green-600 text-white hover:bg-green-700";
    const secondaryClasses = "bg-gray-800 text-white hover:bg-gray-700";

    const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }

    return (
      <div className={`container mx-auto px-6 py-12 ${alignClasses[align]}`}>
        <a
          href={buttonLink}
          className={`inline-block px-8 py-4 rounded-full text-lg font-semibold transition duration-300 ${style === 'primary' ? primaryClasses : secondaryClasses}`}
        >
          {buttonText}
        </a>
      </div>
    );
  },
};

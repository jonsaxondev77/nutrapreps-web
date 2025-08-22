import type { ComponentConfig } from "@measured/puck";
import classNames from "classnames";

export type PricingCardProps = {
  planName: string;
  price: string;
  features: {
    text: string;
  }[];
  buttonText: string;
  buttonLink: string;
  highlight: boolean;
};

// A simple CheckIcon SVG to replace the Heroicon
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="h-5 w-5 text-green-500 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

export const PricingCard: ComponentConfig<PricingCardProps> = {
  fields: {
    planName: { type: "text" },
    price: { type: "text" },
    features: {
      type: "array",
      arrayFields: {
        text: { type: "text" },
      },
      defaultItemProps: {
        text: "Feature description",
      },
    },
    buttonText: { type: "text" },
    buttonLink: { type: "text" },
    highlight: {
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
  defaultProps: {
    planName: "Basic Plan",
    price: "$10/mo",
    features: [
      { text: "Feature One" },
      { text: "Feature Two" },
      { text: "Feature Three" },
    ],
    buttonText: "Get Started",
    buttonLink: "#",
    highlight: false,
  },
  render: ({
    planName,
    price,
    features,
    buttonText,
    buttonLink,
    highlight,
  }) => {
    const cardClasses = classNames(
      "bg-white rounded-xl shadow-lg flex flex-col h-full transition-all duration-300 ease-in-out",
      {
        "ring-2 ring-green-500 scale-105": highlight,
        "border border-gray-200": !highlight,
      }
    );

    const buttonClasses = classNames(
      "w-full py-3 px-6 rounded-lg text-lg font-semibold transition-colors duration-200 mt-auto",
      {
        "bg-green-500 text-white hover:bg-green-600": highlight,
        "bg-gray-800 text-white hover:bg-gray-700": !highlight,
      }
    );

    return (
      <div className={cardClasses}>
        <div className="p-8 pb-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{planName}</h3>
          <div className="flex items-baseline justify-center mb-6">
            <span className="text-5xl font-extrabold text-gray-900">
              {price}
            </span>
          </div>
        </div>

        <div className="px-8 flex-grow">
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <CheckIcon />
                {feature.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 pt-0">
          <a href={buttonLink} className={buttonClasses}>
            {buttonText}
          </a>
        </div>
      </div>
    );
  },
};

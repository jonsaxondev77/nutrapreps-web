import type { ComponentConfig } from "@measured/puck";
import { Check } from "lucide-react";

export type PricingCardProps = {
  planName: string;
  description: string;
  price: string;
  priceFreq: string;
  priceDescription: string;
  features: {
    text: string;
  }[];
  buttonText: string;
  buttonLink: string;
  popular: boolean;
};

export const PricingCard: ComponentConfig<PricingCardProps> = {
  fields: {
    planName: { type: "text" },
    description: { type: "text" },
    price: { type: "text" },
    priceFreq: { type: "text" },
    priceDescription: { type: "text" },
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
    popular: {
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
  defaultProps: {
    planName: "Pro",
    description: "Ideal for individuals.",
    price: "8",
    priceFreq: "meals/week",
    priceDescription: "$10.99 / meal",
    features: [
      { text: "Choose from 20+ meals" },
      { text: "Weekly delivery" },
      { text: "Save 15% per meal" },
    ],
    buttonText: "Choose Plan",
    buttonLink: "#",
    popular: true,
  },
  render: ({
    planName,
    description,
    price,
    priceFreq,
    priceDescription,
    features,
    buttonText,
    buttonLink,
    popular,
  }) => {
    // Corrected card classes
    const cardClasses = popular
      ? "border-2 border-green-600 rounded-lg p-8 flex flex-col relative shadow-2xl h-full"
      : "border border-gray-200 rounded-lg p-8 flex flex-col h-full";
    const buttonClasses = popular
      ? "w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
      : "w-full text-center bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300";

    return (
      <div className={cardClasses}>
        {popular && (
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-4 left-1/2 -translate-x-1/2">
            MOST POPULAR
          </span>
        )}
        <h3 className="text-2xl font-semibold mb-2">{planName}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        <p className="text-4xl font-bold mb-4">
          {price} <span className="text-lg font-medium text-gray-500">{priceFreq}</span>
        </p>
        <p className="text-green-600 font-semibold mb-6">{priceDescription}</p>
        <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              {feature.text}
            </li>
          ))}
        </ul>
        <a href={buttonLink} className={buttonClasses}>
          {buttonText}
        </a>
      </div>
    );
  },
};

import type { ComponentConfig } from "@measured/puck";
import { Star } from "lucide-react";
import React from "react";

export type TestimonialCardProps = {
  quote: string;
  authorName: string;
  authorTitle: string;
  rating: number;
};

export const TestimonialCard: ComponentConfig<TestimonialCardProps> = {
  fields: {
    quote: { type: "textarea" },
    authorName: { type: "text" },
    authorTitle: { type: "text" },
    rating: {
        type: "select",
        label: "Star Rating",
        options: [
            { label: "5 Stars", value: 5 },
            { label: "4 Stars", value: 4 },
            { label: "3 Stars", value: 3 },
            { label: "2 Stars", value: 2 },
            { label: "1 Star", value: 1 },
        ],
    },
  },
  defaultProps: {
    quote:
      "This service has been a game-changer for me. I&apos;m eating healthier than ever and I&apos;ve saved so much time on cooking and cleaning. The food is always delicious!",
    authorName: "Sarah J.",
    authorTitle: "Marketing Manager",
    rating: 5,
  },
  render: ({ quote, authorName, authorTitle, rating }) => {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg h-full flex flex-col">
        {/* Star Rating Display */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating ? "text-yellow-400" : "text-gray-300"
              } fill-current`}
            />
          ))}
        </div>
        <div className="flex-grow">
          <p className="text-gray-600 mb-6 italic">&quot;{quote}&quot;</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{authorName}</p>
          <p className="text-sm text-gray-500">{authorTitle}</p>
        </div>
      </div>
    );
  },
};
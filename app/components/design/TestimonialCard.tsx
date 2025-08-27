import type { ComponentConfig } from "@measured/puck";

export type TestimonialCardProps = {
  quote: string;
  authorName: string;
  authorTitle: string;
};

export const TestimonialCard: ComponentConfig<TestimonialCardProps> = {
  fields: {
    quote: { type: "textarea" },
    authorName: { type: "text" },
    authorTitle: { type: "text" },
  },
  defaultProps: {
    quote:
      "This service has been a game-changer for me. I&apos;m eating healthier than ever and I&apos;ve saved so much time on cooking and cleaning. The food is always delicious!",
    authorName: "Sarah J.",
    authorTitle: "Marketing Manager",
  },
  render: ({ quote, authorName, authorTitle }) => {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg h-full flex flex-col">
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

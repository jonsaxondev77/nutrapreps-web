import { richTextField } from "@/lib/fields/RichTextField";
import type { ComponentConfig } from "@measured/puck";
import { Slot } from "@measured/puck";

export type AccordionBlockProps = {
  items: {
    title: string;
    content: string;
  }[];
};

export const AccordionBlock: ComponentConfig<AccordionBlockProps> = {
  fields: {
    items: {
      type: "array",
      arrayFields: {
        title: { type: "text" },
        content: richTextField("Content"),
      },
      defaultItemProps: {
        title: "Question",
        content: "<p>Answer to the question.</p>",
      },
    },
  },
  defaultProps: {
    items: [
      {
        title: "Is this meal plan right for me?",
        content:
          "<p>Our plans are perfect for busy individuals looking to eat healthy without the hassle of cooking. We offer a variety of options to suit different dietary needs.</p>",
      },
      {
        title: "How does delivery work?",
        content:
          "<p>We deliver twice a week to ensure freshness. You'll receive a notification on the day of delivery with an estimated arrival time.</p>",
      },
    ],
  },
  render: ({ items }) => {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {items.map((item, i) => (
            <details
              key={i}
              className="group bg-gray-50 p-6 rounded-lg"
              
            >
              <summary className="flex items-center justify-between cursor-pointer font-medium text-lg text-gray-900">
                {item.title}
                <span className="ml-4 h-6 w-6 flex items-center justify-center transform transition-transform duration-200 group-open:rotate-180">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div
                className="mt-4 prose"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </details>
          ))}
        </div>
      </div>
    );
  },
};

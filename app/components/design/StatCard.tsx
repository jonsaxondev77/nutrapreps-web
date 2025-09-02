import { ComponentConfig } from "@measured/puck";

export type StatCardProps = {
  figure: string;
  label: string;
};

export const StatCard: ComponentConfig<StatCardProps> = {
  fields: {
    figure: { type: "text" },
    label: { type: "text" },
  },
  defaultProps: {
    figure: "10,000+",
    label: "Meals Delivered",
  },
  render: ({ figure, label }) => {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full flex flex-col justify-center">
        <p className="text-5xl font-bold text-green-600 mb-2">{figure}</p>
        <p className="text-lg text-gray-500">{label}</p>
      </div>
    );
  },
};


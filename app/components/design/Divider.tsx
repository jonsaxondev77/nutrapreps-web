import { ComponentConfig } from "@measured/puck"

export type DividerProps = {
    thickness: number;
    style: "solid" | "dotted" | "dashed";
    color: string;
}

export const Divider: ComponentConfig<DividerProps> = {
    fields: {
        thickness: {
            type: "number",
            label: "Thickness (px)"
        },
        style: {
            type: "select",
            options: [
                { label: "Solid", value: "solid" },
                { label: "Dotted", value: "dotted" },
                { label: "Dashed", value: "dashed" },
            ],
        },
        color: {
            type: "text",
            label: "Color (e.g., #cccccc or gray-200)",
        },
    },
    defaultProps: {
        thickness: 1,
        style: "solid",
        color: "#cccccc",
    },
    render: ({thickness, style, color}) => {
        return (
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <hr
                    style={{
                        borderTopWidth: `${thickness}px`,
                        borderTopStyle: style,
                        borderTopColor: color,
                    }}
                />
            </div>
        )
    }
}
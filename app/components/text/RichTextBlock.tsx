import { richTextField } from "@/lib/fields/RichTextField"
import { ComponentConfig } from "@measured/puck"

export type RichTextProps = {
    content: string;
}

export const RichTextBlock: ComponentConfig<RichTextProps> = {
    fields: {
        content: richTextField('Content')
    },
    defaultProps: {
        content: `
                    <h2>Something Powerful</h2>
                    <h3>Tell The Reader More</h3>
                    <p>The heading and subheading tells us what you're <a href="#">offering</a>, and the form heading closes the deal. Over here you can explain why your offer is so great it's worth filling out a form for.</p>
                    <p>Remember:</p>
                    <ul>
                    <li>Bullets are great</li>
                    <li>For spelling out <a href="#">benefits</a> and</li>
                    <li>Turning visitors into leads.</li>
                    </ul>
                `
    },
    render: ({ content }) => {
        return (
            <div className="container mx-auto px-6">
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="prose lg:prose-7xl max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div>
        )
    }
}
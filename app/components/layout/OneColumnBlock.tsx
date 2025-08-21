import {Slot} from "@measured/puck";
import { ComponentConfig, Content } from "@measured/puck"

export type OneColumnBlockProps = {
    content: Slot
}

export const OneColumnBlock: ComponentConfig<OneColumnBlockProps> = {
    fields: {
        content: {
            type: "slot"
        }
    },    
    render: ({content: Content}) => {
        return (
           <Content/>
        )
    }
}
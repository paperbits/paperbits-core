import { TextblockModel } from "./textblockModel";
import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";

export const nodeName = "paperbits-text";

export class TextblockHandlers implements IWidgetHandler {
    public async getWidgetOrderByConfig(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "text-block",
            displayName: "Text block",
            iconClass: "paperbits-edit-2",
            createModel: async () => {
                return new TextblockModel([
                    {
                        type: "heading1",
                        content: [{ type: "text", text: "Heading" }]
                    },
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: "Yeah, sure, okay. This is it. This is the answer. It says here that a bolt of lightning is gonna strike the clock tower precisely at 10:04 p.m. next Saturday night. If we could somehow harness this bolt of lightning, channel it into the flux capacitor, it just might work. Next Saturday night, we're sending you back to the future. Will you take care of that? Stand tall, boy, have some respect for yourself. Don't you know that if you let people walk all over you know, they'll be walking all over you for the rest of your life? Listen to me, do you think I'm gonna spend the rest of my life in this slop house? Well, you mean, it makes perfect sense." }]
                    }
                ]);
            }
        };

        return widgetOrder;
    }

    public async getWidgetOrder(): Promise<IWidgetOrder> {
        return await this.getWidgetOrderByConfig();
    }
}
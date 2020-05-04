import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { CalendlyButtonModel } from "./calendlyButtonModel";


export class CalendlyButtonHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "calendlyButton",
            displayName: "CalendlyButton",
            iconClass: "paperbits-calendlyButton-2",
            requires: [],
            createModel: async () => {
                return new CalendlyButtonModel();
            }
        };

        return widgetOrder;
    }
}
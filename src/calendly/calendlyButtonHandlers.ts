import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { CalendlyButtonModel } from "./calendlyCalendlyButtonModel";


export class CalendlyButtonHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "calendlyCalendlyButton",
            displayName: "CalendlyButton",
            iconClass: "paperbits-calendlyCalendlyButton-2",
            requires: [],
            createModel: async () => {
                return new CalendlyButtonModel();
            }
        };

        return widgetOrder;
    }
}
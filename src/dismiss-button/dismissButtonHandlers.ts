import { IWidgetHandler } from "@paperbits/common/editing";
import { DismissButtonModel } from "./dismissButtonModel";


export class DismissButtonHandlers implements IWidgetHandler {
    public async getWidgetModel(): Promise<DismissButtonModel> {
        return new DismissButtonModel();
    }
}
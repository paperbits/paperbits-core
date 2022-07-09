import { IWidgetHandler } from "@paperbits/common/editing";

export class WidgetItem {
    public name: string;
    public css: string;
    public iconUrl: string;
    public displayName: string;
    public category?: string;
    public createModel: <TModel>()=> TModel
}

import { IWidgetHandler } from "@paperbits/common/editing";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { GridHandlers } from "../gridHandlers";
import { GridLayoutSelector } from "./gridLayoutSelector";


export class GridEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("gridLayoutSelector", GridLayoutSelector);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", GridHandlers, "gridHandler");
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { GridLayoutSelector } from "./gridLayoutSelector";
// import { GridEditor } from "./gridEditor";
import { GridHandlers } from "../gridHandlers";


export class GridEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("gridLayoutSelector", GridLayoutSelector);
        // injector.bind("gridEditor", GridEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", GridHandlers, "gridHandler");
    }
}
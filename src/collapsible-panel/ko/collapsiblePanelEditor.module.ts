import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CollapsiblePanelEditor } from "./collapsiblePanelEditor";
import { CollapsiblePanelHandlers } from "../collapsiblePanelHandlers";

export class CollapsiblePanelEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("collapsiblePanelEditor", CollapsiblePanelEditor);
        injector.bindToCollection("widgetHandlers", CollapsiblePanelHandlers, "collapsiblePanelHandler");
    }
}
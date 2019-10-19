import styleTemplate from "./styleGuideTemplate.html";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { MenuEditor } from "./menuEditor";
import { MenuHandlers } from "../menuHandlers";
import { IStyleGroup } from "@paperbits/common/styles";

export class MenuEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("menuEditor", MenuEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", MenuHandlers, "menuHandler");

        const styleGroup: IStyleGroup = { 
            name: "components_menu", 
            groupName: "Menus", 
            selectorTemplate: `<h1>TODO</h1>`,
            styleTemplate: styleTemplate
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}
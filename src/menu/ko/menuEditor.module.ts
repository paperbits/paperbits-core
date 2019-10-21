import styleTemplate from "./styleGuideSnippet.html";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { IStyleGroup } from "@paperbits/common/styles";
import { MenuEditor } from "./menuEditor";
import { MenuHandlers } from "../menuHandlers";


export class MenuEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("menuEditor", MenuEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", MenuHandlers, "menuHandler");

        const styleGroup: IStyleGroup = {
            key: "menu",
            name: "components_menu",
            groupName: "Menus",
            selectorTemplate: null,
            styleTemplate: styleTemplate
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}
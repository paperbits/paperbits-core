import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CardEditor } from "./cardEditor";
import { IWidgetHandler } from "@paperbits/common/editing";
import { CardHandlers } from "../cardHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";

export class CardEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("cardEditor", CardEditor);
        const styleGroup: IStyleGroup = { 
            key: "card",
            name: "components_card", 
            groupName: "Cards", 
            selectorTemplate: undefined,
            styleTemplate: `<div class="no-pointer-events" data-bind="stylePreview: variation.key" style="width: 340px"><h1>Card</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...</p></div>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", CardHandlers, "cardHandler");
    }
}
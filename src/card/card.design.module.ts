import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CardEditor } from "./ko/cardEditor";
import { ComponentFlow, IWidgetHandler } from "@paperbits/common/editing";
import { CardHandlers } from "./cardHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";
import { IWidgetService } from "@paperbits/common/widgets";
import { CardModel } from "./cardModel";
import { CardViewModel } from "./ko/cardViewModel";
import { CardModelBinder } from "./cardModelBinder";
import { CardViewModelBinder } from "./ko/cardViewModelBinder";

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

        const registry = injector.resolve<IWidgetService>("widgetService");

        registry.registerWidget("card", {
            modelClass: CardModel,
            componentFlow: ComponentFlow.Inline,
            componentBinder: "knockout", // ReactComponentBinder,
            componentBinderArguments: CardViewModel,
            modelBinder: CardModelBinder,
            viewModelBinder: CardViewModelBinder
        });

        registry.registerWidgetEditor("card", {
            displayName: "Card",
            editorComponent: CardEditor,
            handlerComponent: CardHandlers,
            iconClass: "widget-icon widget-icon-card",
            requires: [],
            draggable: true
        });
    }
}
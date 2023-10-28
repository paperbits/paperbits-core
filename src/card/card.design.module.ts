import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CardEditor } from "./ko/cardEditor";
import { IWidgetHandler } from "@paperbits/common/editing";
import { CardHandlers } from "./cardHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";
import { IWidgetService } from "@paperbits/common/widgets";
import { CardModel } from "./cardModel";
import { CardViewModel } from "./ko/cardViewModel";
import { CardModelBinder } from "./cardModelBinder";
import { CardViewModelBinder } from "./ko/cardViewModelBinder";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";


export class CardEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("cardEditor", CardEditor);
        injector.bindSingleton("cardModelBinder", CardModelBinder);
        injector.bindSingleton("cardViewModelBinder", CardViewModelBinder)
        injector.bindSingleton("cardHandler", CardHandlers);

        const styleGroup: IStyleGroup = {
            key: "card",
            name: "components_card",
            groupName: "Card",
            styleTemplate: `<div data-bind="stylePreview: variation.key, styleableGlobal: variation" style="width: 340px"><h1>Card</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...</p></div>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("card", {
            componentBinder: KnockoutComponentBinder,
            componentDefinition: CardViewModel,
            modelBinder: CardModelBinder,
            modelDefinition: CardModel,
            viewModelBinder: CardViewModelBinder
        });

        widgetService.registerWidgetEditor("card", {
            displayName: "Card",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: CardEditor,
            handlerComponent: CardHandlers,
            iconClass: "widget-icon widget-icon-card",
            draggable: true
        });
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { CardViewModel } from "./ko/cardViewModel";
import { CardModelBinder } from "./cardModelBinder";
import { CardViewModelBinder } from "./ko/cardViewModelBinder";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";
import { CardModel } from "./cardModel";

export class CardPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("card", CardViewModel);
        injector.bindSingleton("cardModelBinder", CardModelBinder);
        injector.bindSingleton("cardViewModelBinder", CardViewModelBinder)

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("card", {
            componentBinder: KnockoutComponentBinder,
            componentDefinition: CardViewModel,
            modelBinder: CardModelBinder,
            modelDefinition: CardModel,
            viewModelBinder: CardViewModelBinder
        });
    }
}
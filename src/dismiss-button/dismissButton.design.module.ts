import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { DismissButtonEditor } from "./ko/dismissButtonEditor";
import { DismissButtonHandlers } from "./dismissButtonHandlers";
import { DismissButton, DismissButtonViewModelBinder } from "./ko";
import { DismissButtonModelBinder } from "./dismissButtonModelBinder";
import { IWidgetService } from "@paperbits/common/widgets";
import { DismissButtonModel } from "./dismissButtonModel";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";

export class DismissButtonDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("dismissButton", DismissButton);
        injector.bind("dismissButtonEditor", DismissButtonEditor);
        injector.bindSingleton("dismissButtonModelBinder", DismissButtonModelBinder);
        injector.bindSingleton("dismissButtonViewModelBinder", DismissButtonViewModelBinder);
        injector.bindSingleton("dismissButtonHandler", DismissButtonHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("dismiss-button", {
            modelDefinition: DismissButtonModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: DismissButton,
            modelBinder: DismissButtonModelBinder,
            viewModelBinder: DismissButtonViewModelBinder
        });

        widgetService.registerWidgetEditor("dismiss-button", {
            displayName: "Dismiss button",
            category: "Popups",
            iconClass: "widget-icon widget-icon-button",
            requires: ["popup"],
            componentBinder: KnockoutComponentBinder,
            componentDefinition: DismissButtonEditor,
            handlerComponent: DismissButtonHandlers
        });
    }
}
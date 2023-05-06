import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";
import { ButtonHandlers } from "./buttonHandlers";
import { ButtonModel } from "./buttonModel";
import { ButtonModelBinder } from "./buttonModelBinder";
import { Button } from "./ko/button";
import { ButtonEditor } from "./ko/buttonEditor";
import { ButtonViewModelBinder } from "./ko/buttonViewModelBinder";

export class ButtonDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("button", Button);
        injector.bind("buttonEditor", ButtonEditor);
        injector.bindSingleton("buttonModelBinder", ButtonModelBinder);
        injector.bindSingleton("buttonViewModelBinder", ButtonViewModelBinder)
        injector.bindSingleton("buttonHandler", ButtonHandlers);

        const styleGroup: IStyleGroup = {
            key: "button",
            name: "components_button",
            groupName: "Buttons",
            selectorTemplate: `<a role="button" data-bind="css: classNames" style="display: inline-block">Button</a>`,
            styleTemplate: `<a role="button" data-bind="stylePreview: variation.key" style="display: inline-block">Button</button>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("button", {
            modelDefinition: ButtonModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: Button,
            modelBinder: ButtonModelBinder,
            viewModelBinder: ButtonViewModelBinder
        });

        widgetService.registerWidgetEditor("button", {
            displayName: "Button",
            iconClass: "widget-icon widget-icon-button",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: ButtonEditor,
            handlerComponent: ButtonHandlers
        });
    }
}
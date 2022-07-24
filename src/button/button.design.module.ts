import { ComponentFlow } from "@paperbits/common/editing";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { IWidgetService } from "@paperbits/common/widgets";
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
            selectorTemplate: `<a data-bind="css: classNames" style="display: inline-block">Button</a>`,
            styleTemplate: `<a data-bind="stylePreview: variation.key" style="display: inline-block">Button</button>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        // TODO: Move registrations to separate file?
        widgetService.registerWidget("button", {
            modelClass: ButtonModel,
            componentFlow: ComponentFlow.Contents,
            componentBinder: "knockout",
            componentBinderArguments: Button,
            modelBinder: ButtonModelBinder,
            viewModelBinder: ButtonViewModelBinder
        });

        widgetService.registerWidgetEditor("button", {
            displayName: "Button",
            iconClass: "widget-icon widget-icon-button",
            draggable: true,
            editorComponent: ButtonEditor,
            handlerComponent: ButtonHandlers
        });
    }
}
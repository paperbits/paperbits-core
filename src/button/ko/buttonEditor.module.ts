import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { ButtonEditor } from "./buttonEditor";
import { ButtonHandlers } from "../buttonHandlers";
import { WidgetRegistry } from "@paperbits/common/editing/widgetRegistry";
import { ButtonModel } from "../buttonModel";
import { ComponentFlow } from "@paperbits/common/editing";
import { Button } from "./button";
import { ButtonModelBinder } from "../buttonModelBinder";
import { ButtonViewModelBinder } from "./buttonViewModelBinder";

export class ButtonEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("buttonEditor", ButtonEditor);
        injector.bindToCollection("widgetHandlers", ButtonHandlers, "buttonHandler");

        const styleGroup: IStyleGroup = { 
            key: "button",
            name: "components_button", 
            groupName: "Buttons", 
            selectorTemplate: `<a data-bind="css: classNames" style="display: inline-block">Button</a>`,
            styleTemplate: `<a data-bind="stylePreview: variation.key" style="display: inline-block">Button</button>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);



        const registry = injector.resolve<WidgetRegistry>("widgetRegistry");

        registry.register("button",
            {
                name: "button",
                modelClass: ButtonModel,
                flow: ComponentFlow.Contents,
                componentBinder: "knockout", // ReactComponentBinder,
                componentBinderArguments: Button,
                modelBinder: ButtonModelBinder,
                viewModelBinder: ButtonViewModelBinder
            },
            {
                displayName: "Button",
                editorComponent: "button-editor",
                handlerComponent: ButtonHandlers,
                iconClass:  "widget-icon widget-icon-button",
                requires: [],
                draggable: true
            }
        );
    }
}
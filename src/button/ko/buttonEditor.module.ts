import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { ButtonEditor } from "./buttonEditor";
import { ButtonHandlers } from "../buttonHandlers";

export class ButtonEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("buttonEditor", ButtonEditor);
        injector.bindToCollection("widgetHandlers", ButtonHandlers, "buttonHandler");

        const styleGroup: IStyleGroup = { 
            key: "button",
            name: "components_button", 
            groupName: "Buttons", 
            selectorTemplate: `<a href="#" data-bind="css: classNames" style="display: inline-block">Button</a>`,
            styleTemplate: `<a href="#" data-bind="stylePreview: variation.key" style="display: inline-block">Button</button>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}
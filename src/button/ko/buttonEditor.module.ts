import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";
import { ButtonEditor } from "./buttonEditor";
import { ButtonHandlers } from "../buttonHandlers";

export class ButtonEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("buttonEditor", ButtonEditor);

        const styleGroup: IStyleGroup = { 
            name: "components_button", 
            groupName: "Buttons", 
            selectorTemplate: `<button data-bind="css: classNames, text: displayName"></button>`,
            styleTemplate: `<button data-bind="stylePreview:variant">Button</button>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
        
        injector.bindToCollection("widgetHandlers", ButtonHandlers, "buttonHandler");
    }
}
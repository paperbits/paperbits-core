import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { CalendlyButtonEditor } from "./calendlyButtonEditor";
import { CalendlyButtonHandlers } from "../calendlyButtonHandlers";

export class CalendlyButtonEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("calendlyButtonEditor", CalendlyButtonEditor);
        injector.bindToCollection("widgetHandlers", CalendlyButtonHandlers, "calendlyButtonHandler");

        const styleGroup: IStyleGroup = { 
            key: "calendlyButton",
            name: "components_calendlyButton", 
            groupName: "CalendlyButtons", 
            selectorTemplate: `<a href="#" data-bind="css: classNames" style="display: inline-block">CalendlyButton</a>`,
            styleTemplate: `<a href="#" data-bind="stylePreview: variation.key" style="display: inline-block">CalendlyButton</calendlyButton>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}
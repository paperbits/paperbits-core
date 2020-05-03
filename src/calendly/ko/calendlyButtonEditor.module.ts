import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { CalendlyButtonEditor } from "./calendlyCalendlyButtonEditor";
import { CalendlyButtonHandlers } from "../calendlyCalendlyButtonHandlers";

export class CalendlyButtonEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("calendlyCalendlyButtonEditor", CalendlyButtonEditor);
        injector.bindToCollection("widgetHandlers", CalendlyButtonHandlers, "calendlyCalendlyButtonHandler");

        const styleGroup: IStyleGroup = { 
            key: "calendlyCalendlyButton",
            name: "components_calendlyCalendlyButton", 
            groupName: "CalendlyButtons", 
            selectorTemplate: `<a href="#" data-bind="css: classNames" style="display: inline-block">CalendlyButton</a>`,
            styleTemplate: `<a href="#" data-bind="stylePreview: variation.key" style="display: inline-block">CalendlyButton</calendlyCalendlyButton>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}
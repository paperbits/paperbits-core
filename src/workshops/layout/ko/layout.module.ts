import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { LayoutsWorkshop } from "./layouts";
import { LayoutDetails } from "./layoutDetails";
import { LayoutSelector } from "./layoutSelector";
import { LayoutsWorkshopSection } from "./layoutsSection";

export class LayoutWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("layoutsWorkshop", LayoutsWorkshop);
        injector.bind("layoutDetails", LayoutDetails);
        injector.bind("layoutSelector", LayoutSelector);
        injector.bindToCollection("workshopSections", LayoutsWorkshopSection);
    }
}
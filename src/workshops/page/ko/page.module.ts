import { PagesWorkshopSection } from "./pagesSection";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PagesWorkshop } from "./pages";
import { PageDetailsWorkshop } from "./pageDetails";
import { PageSelector } from "./pageSelector";

export class PageWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("pagesWorkshop", PagesWorkshop);
        injector.bind("pageDetailsWorkshop", PageDetailsWorkshop);
        injector.bind("pageSelector", PageSelector);
        injector.bindToCollection("workshopSections", PagesWorkshopSection);
    }
}
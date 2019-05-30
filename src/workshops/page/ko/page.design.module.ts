import { PagesToolButton } from "./pagesToolButton";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PagesWorkshop } from "./pages";
import { PageDetailsWorkshop } from "./pageDetails";
import { PageSelector } from "./pageSelector";
import { PageHyperlinkProvider } from "@paperbits/common/pages";

export class PageDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("pagesWorkshop", PagesWorkshop);
        injector.bind("pageDetailsWorkshop", PageDetailsWorkshop);
        injector.bind("pageSelector", PageSelector);
        injector.bindToCollection("hyperlinkProviders", PageHyperlinkProvider);
        injector.bindToCollection("workshopSections", PagesToolButton);
    }
}
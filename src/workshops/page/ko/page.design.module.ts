import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PagesWorkshop } from "./pages";
import { PageDetailsWorkshop } from "./pageDetails";
import { PageSelector } from "./pageSelector";
import { PageHyperlinkProvider } from "@paperbits/common/pages";
import { BrowserNotSupported } from "./browserNotSupported";
import { PageHost } from "./pageHost";
import { PagesToolButton } from "./pagesToolButton";
import { PageHyperlinkDetails } from "./pageHyperlinkDetails";


export class PageDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("browserNotSupported", BrowserNotSupported);
        injector.bind("pageHost", PageHost);
        injector.bind("pagesWorkshop", PagesWorkshop);
        injector.bind("pageDetailsWorkshop", PageDetailsWorkshop);
        injector.bind("pageSelector", PageSelector);
        injector.bind("pageHyperlinkDetails", PageHyperlinkDetails);
        injector.bindToCollection("hyperlinkProviders", PageHyperlinkProvider);
        injector.bindToCollection("workshopSections", PagesToolButton);
        injector.bind("pageHyperlinkProvider", PageHyperlinkProvider);
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { UrlsWorkshop } from "./urls";
import { UrlDetailsWorkshop } from "./urlDetails";
import { UrlSelector } from "./urlSelector";
import { UrlHyperlinkProvider } from "@paperbits/common/urls";
import { UrlsToolButton } from "./urlsToolButton";
import { UrlHyperlinkDetails } from "./urlHyperlinkDetails";


export class UrlDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("urlsWorkshop", UrlsWorkshop);
        injector.bind("urlDetailsWorkshop", UrlDetailsWorkshop);
        injector.bind("urlSelector", UrlSelector);
        injector.bind("urlHyperlinkDetails", UrlHyperlinkDetails);
        injector.bindToCollection("hyperlinkProviders", UrlHyperlinkProvider);
        injector.bindToCollection("workshopSections", UrlsToolButton);
        injector.bind("urlHyperlinkProvider", UrlHyperlinkProvider);
    }
}
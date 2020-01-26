import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { BlogHost } from ".";
import { BlogWorkshop } from "./blogs";
import { BlogPostDetailsWorkshop } from "./blogPostDetails";
import { BlogSelector } from "./blogSelector";
import { BlogWorkshopToolButton } from "./blogToolButton";
import { BlogHyperlinkProvider } from "@paperbits/common/blogs";


export class BlogDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("blogHost", BlogHost);
        injector.bind("blogWorkshop", BlogWorkshop);
        injector.bind("blogPostDetailsWorkshop", BlogPostDetailsWorkshop);
        injector.bind("blogSelector", BlogSelector);
        injector.bindToCollection("hyperlinkProviders", BlogHyperlinkProvider);
        injector.bindToCollection("workshopSections", BlogWorkshopToolButton);
    }
}
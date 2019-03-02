import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { BlogWorkshop } from "./blogs";
import { BlogPostDetailsWorkshop } from "./blogPostDetails";
import { BlogSelector } from "./blogSelector";
import { BlogWorkshopSection } from "./blogSection";

export class BlogWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("blogWorkshop", BlogWorkshop);
        injector.bind("blogPostDetailsWorkshop", BlogPostDetailsWorkshop);
        injector.bind("blogSelector", BlogSelector);
        // injector.bindToCollection("workshopSections", BlogWorkshopSection);
    }
}
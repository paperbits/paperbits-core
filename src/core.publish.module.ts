import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { AssetPublisher } from "./publishing/assetPublisher";
import { PagePublisher } from "./publishing/pagePublisher";
import { SitePublisher } from "./publishing/sitePublisher";
import { MediaPublisher } from "./publishing/mediaPublisher";


export class CorePublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindCollection("publishers");
        injector.bindToCollection("publishers", AssetPublisher);
        injector.bindToCollection("publishers", PagePublisher);
        // injector.bindToCollection("publishers", BlogPublisher);
        injector.bindToCollection("publishers", MediaPublisher);
        injector.bindSingleton("sitePublisher", SitePublisher);
    }
}
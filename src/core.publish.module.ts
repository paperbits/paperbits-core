import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { AssetPublisher } from "./publishing/assetPublisher";
import { PagePublisher } from "./publishing/pagePublisher";
import { SitePublisher } from "./publishing/sitePublisher";
import { MediaPublisher } from "./publishing/mediaPublisher";
import { KnockoutHtmlPagePublisherPlugin } from "./publishing/knockoutHtmlPagePublisherPlugin";
import { HtmlPagePublisher } from "@paperbits/common/publishing";
import { DominoHtmlDocumentProvider } from "./publishing/dominoHtmlDocumentProvider";
import { OpenGraphHtmlPagePublisherPlugin } from "./publishing/openGraphHtmlPagePublisherPlugin";
import { StructuredDataHtmlPagePublisherPlugin } from "./publishing/structuredDataHtmlPagePublisherPlugin";


export class CorePublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindCollection("publishers");
        injector.bindToCollection("publishers", AssetPublisher);
        injector.bindToCollection("publishers", PagePublisher);
        // injector.bindToCollection("publishers", BlogPublisher);
        injector.bindToCollection("publishers", MediaPublisher);
        injector.bindSingleton("sitePublisher", SitePublisher);
        injector.bind("htmlPagePublisher", HtmlPagePublisher);
        injector.bind("htmlDocumentProvider", DominoHtmlDocumentProvider);
        injector.bindCollection("htmlPagePublisherPlugins");
        injector.bindToCollection("htmlPagePublisherPlugins", KnockoutHtmlPagePublisherPlugin);
        injector.bindToCollection("htmlPagePublisherPlugins", StructuredDataHtmlPagePublisherPlugin);
        injector.bindToCollection("htmlPagePublisherPlugins", OpenGraphHtmlPagePublisherPlugin);
    }
}
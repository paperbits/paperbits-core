import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { AssetPublisher } from "./publishing/assetPublisher";
import { PagePublisher } from "./publishing/pagePublisher";
import { SitePublisher } from "./publishing/sitePublisher";
import { MediaPublisher } from "./publishing/mediaPublisher";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver.publish";
import { KnockoutHtmlPagePublisherPlugin } from "./publishing/knockoutHtmlPagePublisherPlugin";
import {
    HtmlPagePublisher,
    HtmlPageOptimizer,
    OpenGraphHtmlPagePublisherPlugin,
    LinkedDataHtmlPagePublisherPlugin,
    SocialShareDataHtmlPagePublisherPlugin,
    DominoHtmlDocumentProvider,
    SitemapBuilder,
    SearchIndexBuilder
} from "@paperbits/common/publishing";
import { MemoryCache } from "@paperbits/common/caching";
import { MapPublishModule } from "./map/ko";
import { DividerPublishModule } from "./divider/divider.publish.module";


export class CorePublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindModule(new DividerPublishModule());
        injector.bindCollection("publishers");
        injector.bindToCollection("publishers", AssetPublisher);
        injector.bindToCollection("publishers", MediaPublisher);
        injector.bindToCollection("publishers", PagePublisher);
        // injector.bindToCollection("publishers", BlogPublisher);
        injector.bindSingleton("sitePublisher", SitePublisher);
        injector.bindSingleton("sitemapBuilder", SitemapBuilder);
        injector.bindSingleton("searchIndexBuilder", SearchIndexBuilder);
        injector.bindSingleton("htmlPagePublisher", HtmlPagePublisher);
        injector.bindSingleton("htmlPageOptimizer",  HtmlPageOptimizer);
        injector.bindSingleton("htmlDocumentProvider", DominoHtmlDocumentProvider);
        injector.bindCollection("htmlPagePublisherPlugins");
        injector.bindToCollection("permalinkResolvers", MediaPermalinkResolver, "mediaPermalinkResolver");
        injector.bindToCollection("htmlPagePublisherPlugins", KnockoutHtmlPagePublisherPlugin);
        injector.bindToCollection("htmlPagePublisherPlugins", LinkedDataHtmlPagePublisherPlugin);
        injector.bindToCollection("htmlPagePublisherPlugins", OpenGraphHtmlPagePublisherPlugin);
        injector.bindToCollection("htmlPagePublisherPlugins", SocialShareDataHtmlPagePublisherPlugin);
        injector.bindInstance("changesCache", new MemoryCache());
        injector.bindModule(new MapPublishModule());
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MemoryCache } from "@paperbits/common/caching";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver.publish";
import { AssetPublisher } from "./publishing/assetPublisher";
import { PagePublisher } from "./publishing/pagePublisher";
import { SitePublisher } from "./publishing/sitePublisher";
import { MediaPublisher } from "./publishing/mediaPublisher";
import { KnockoutHtmlPagePublisherPlugin } from "./publishing/knockoutHtmlPagePublisherPlugin";
import {
    HtmlPagePublisher,
    HtmlPageOptimizer,
    OpenGraphHtmlPagePublisherPlugin,
    LinkedDataHtmlPagePublisherPlugin,
    SocialShareDataHtmlPagePublisherPlugin,
    JsDomHtmlDocumentProvider,
    SitemapBuilder,
    SearchIndexBuilder
} from "@paperbits/common/publishing";
import { MapPublishModule } from "./map/map.publish.module";
import { DividerPublishModule } from "./divider/divider.publish.module";
import { CarouselPublishModule } from "./carousel/carousel.publish.module";
import { TabPanelPublishModule } from "./tabs/tabPanel.publish.module";
import { TablePublishModule } from "./table/table.publish.module";
import { TableCellPublishModule } from "./table-cell/tableCell.publish.module";
import { Bag } from "@paperbits/common";
import { ComponentBinder } from "@paperbits/common/editing/componentBinder";
import { PopupPublishModule } from "./popup/popup.publish.module";
import { DismissButtonPublishModule } from "./dismiss-button/dismissButton.publish.module";
import { ConsoleLogger } from "@paperbits/common/logging";


export class CorePublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindInstance<Bag<ComponentBinder>>("componentBinders", {});
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
        injector.bindSingleton("htmlDocumentProvider", JsDomHtmlDocumentProvider);
        injector.bindCollection("htmlPagePublisherPlugins");
        injector.bindSingleton("logger", ConsoleLogger);
        injector.bindToCollection("permalinkResolvers", MediaPermalinkResolver, "mediaPermalinkResolver");
        injector.bindToCollection("htmlPagePublisherPlugins", KnockoutHtmlPagePublisherPlugin);
        injector.bindToCollection("htmlPagePublisherPlugins", LinkedDataHtmlPagePublisherPlugin);
        injector.bindToCollection("htmlPagePublisherPlugins", OpenGraphHtmlPagePublisherPlugin);
        injector.bindToCollection("htmlPagePublisherPlugins", SocialShareDataHtmlPagePublisherPlugin);
        injector.bindInstance("stateCache", new MemoryCache());
        injector.bindInstance("changesCache", new MemoryCache());
        injector.bindModule(new MapPublishModule());
        injector.bindModule(new CarouselPublishModule());
        injector.bindModule(new TabPanelPublishModule());
        injector.bindModule(new TablePublishModule());
        injector.bindModule(new TableCellPublishModule());
        injector.bindModule(new PopupPublishModule());
        injector.bindModule(new DismissButtonPublishModule());
    }
}
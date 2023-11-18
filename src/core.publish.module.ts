import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver.publish";
import { AssetPublisher } from "./publishing/assetPublisher";
import { PagePublisher } from "./publishing/pagePublisher";
import { SitePublisher } from "./publishing/sitePublisher";
import { MediaPublisher } from "./publishing/mediaPublisher";
import { KnockoutHtmlPagePublisherPlugin } from "./publishing";
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
import { ButtonPublishModule } from "./button/button.publish.module";
import { MapPublishModule } from "./map/map.publish.module";
import { DividerPublishModule } from "./divider/divider.publish.module";
import { CarouselPublishModule } from "./carousel/carousel.publish.module";
import { TabPanelPublishModule } from "./tabs/tabPanel.publish.module";
import { TablePublishModule } from "./table/table.publish.module";
import { TableCellPublishModule } from "./table-cell/tableCell.publish.module";
import { PopupPublishModule } from "./popup/popup.publish.module";
import { DismissButtonPublishModule } from "./dismiss-button/dismissButton.publish.module";
import { ConsoleLogger } from "@paperbits/common/logging";
import { CardPublishModule } from "./card/card.publish.module";
import { TextblockPublishModule } from "./textblock/textblock.publish.module";
import { ProseMirrorPublishModule } from "@paperbits/prosemirror/prosemirror.publish.module";
import { VideoPlayerModule } from "./video-player/videoPlayer.publish.module";
import { YoutubePlayerPublishModule } from "./youtube-player/youtubePlayer.publish.module";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { UrlPermalinkResolver } from "@paperbits/common/urls/urlPermalinkResolver";
import { Bag } from "@paperbits/common";
import { ComponentBinder } from "@paperbits/common/components";
import { CollectionModelBinder } from "@paperbits/common/editing";
import { DefaultSettingsProvider } from "@paperbits/common/configuration";
import { XmlHttpRequestClient } from "@paperbits/common/http";
import { DefaultEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { ModelBinderSelector, WidgetService } from "@paperbits/common/widgets";
import { DefaultPermalinkService, PermalinkResolver } from "@paperbits/common/permalinks";
import { LayoutService } from "@paperbits/common/layouts";
import { PageService } from "@paperbits/common/pages";
import { BlogService } from "@paperbits/common/blogs";
import { MediaService } from "@paperbits/common/media";
import { BlockService } from "@paperbits/common/blocks";
import { NavigationService } from "@paperbits/common/navigation";
import { SiteService } from "@paperbits/common/sites";
import { UrlService } from "@paperbits/common/urls";
import { LocaleService } from "@paperbits/common/localization";
import { KnockoutModule, ViewModelBinderSelector } from "./ko";
import { BackgroundModelBinder } from "@paperbits/common/widgets/background";
import { ContentModule } from "./content/ko";
import { ColumnModule } from "./column/ko";
import { RowModule } from "./row/ko";
import { SectionModule } from "./section/ko";
import { GridModule } from "./grid-layout-section/ko";
import { GridCellModule } from "./grid-cell/ko";
import { MenuModule } from "./menu/ko";
import { PicturePublishModule } from "./picture/picture.publish.module";
import { TestimonialsModule } from "./testimonials/ko";
import { CollapsiblePanelModule } from "./collapsible-panel/ko";
import { BackgroundBindingHandler, WidgetBindingHandler } from "./ko/bindingHandlers";
import { DefaultChangeCommitter } from "@paperbits/common/persistence";
import { ContainerPublishModule } from "./container/container.publish.module";

export class CorePublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindInstance("injector", injector);
        injector.bindCollection("autostart");
        injector.bindCollection("styleHandlers");
        injector.bindCollectionLazily("widgetHandlers");
        injector.bindCollectionLazily("routeGuards");
        injector.bindCollectionLazily("modelBinders");
        injector.bindCollectionLazily("viewModelBinders");
        injector.bindCollectionLazily("permalinkResolvers");
        injector.bindInstance<Bag<ComponentBinder>>("componentBinders", {});
        injector.bind("containerModelBinder", CollectionModelBinder);

        /*** Core ***/
        injector.bindSingleton("settingsProvider", DefaultSettingsProvider);
        injector.bindSingleton("httpClient", XmlHttpRequestClient);
        injector.bindSingleton("eventManager", DefaultEventManager);
        injector.bindSingleton("globalEventHandler", GlobalEventHandler);
        injector.bindSingleton("logger", ConsoleLogger);
        injector.bindSingleton("changeCommitter", DefaultChangeCommitter);

        /*** Services ***/
        injector.bindSingleton("widgetService", WidgetService);
        injector.bindSingleton("permalinkService", DefaultPermalinkService);
        injector.bindSingleton("layoutService", LayoutService);
        injector.bindSingleton("pageService", PageService);
        injector.bindSingleton("blogService", BlogService);
        injector.bindSingleton("mediaService", MediaService);
        injector.bindSingleton("blockService", BlockService);
        injector.bindSingleton("navigationService", NavigationService);
        injector.bindSingleton("siteService", SiteService);
        injector.bindSingleton("urlService", UrlService);
        injector.bindSingleton("localeService", LocaleService);

        /*** Permalink resolvers ***/
        injector.bindSingleton("permalinkResolver", PermalinkResolver);
        injector.bindToCollectionAsSingletone("permalinkResolvers", PagePermalinkResolver, "pagePermalinkResolver");
        injector.bindToCollectionAsSingletone("permalinkResolvers", UrlPermalinkResolver, "urlPermalinkResolver");
        injector.bindToCollectionAsSingletone("permalinkResolvers", MediaPermalinkResolver, "mediaPermalinkResolver");

        injector.bindSingleton("modelBinderSelector", ModelBinderSelector);
        injector.bindSingleton("viewModelBinderSelector", ViewModelBinderSelector);
        injector.bindSingleton("backgroundModelBinder", BackgroundModelBinder);

        /* Knockout */
        injector.bindModule(new KnockoutModule());

        /* Widgets */
        injector.bindModule(new ContentModule());
        injector.bindModule(new ColumnModule());
        injector.bindModule(new RowModule());
        injector.bindModule(new SectionModule());
        injector.bindModule(new GridModule());
        injector.bindModule(new GridCellModule());
        injector.bindModule(new MenuModule());
        injector.bindModule(new PicturePublishModule());
        injector.bindModule(new TestimonialsModule());
        injector.bindModule(new CollapsiblePanelModule());
        injector.bindModule(new DividerPublishModule());
        injector.bindModule(new MapPublishModule());
        injector.bindModule(new CarouselPublishModule());
        injector.bindModule(new TabPanelPublishModule());
        injector.bindModule(new TablePublishModule());
        injector.bindModule(new TableCellPublishModule());
        injector.bindModule(new PopupPublishModule());
        injector.bindModule(new DismissButtonPublishModule());
        injector.bindModule(new ButtonPublishModule());
        injector.bindModule(new CardPublishModule());
        injector.bindModule(new ContainerPublishModule());
        injector.bindModule(new ProseMirrorPublishModule());
        injector.bindModule(new TextblockPublishModule());
        injector.bindModule(new VideoPlayerModule());
        injector.bindModule(new YoutubePlayerPublishModule());

        injector.bindToCollection("autostart", WidgetBindingHandler);
        injector.bindToCollection("autostart", BackgroundBindingHandler);

        /*** Publishers ***/
        injector.bindCollection("publishers");
        injector.bindToCollectionAsSingletone("publishers", AssetPublisher);
        injector.bindToCollectionAsSingletone("publishers", MediaPublisher);
        injector.bindToCollectionAsSingletone("publishers", PagePublisher);
        injector.bindSingleton("sitePublisher", SitePublisher);
        injector.bindSingleton("sitemapBuilder", SitemapBuilder);
        injector.bindSingleton("searchIndexBuilder", SearchIndexBuilder);
        injector.bindSingleton("htmlPagePublisher", HtmlPagePublisher);
        injector.bindSingleton("htmlPageOptimizer", HtmlPageOptimizer);
        injector.bindSingleton("htmlDocumentProvider", JsDomHtmlDocumentProvider);

        /*** Publisher plugins ***/
        injector.bindCollection("htmlPagePublisherPlugins");
        injector.bindToCollectionAsSingletone("htmlPagePublisherPlugins", KnockoutHtmlPagePublisherPlugin);
        injector.bindToCollectionAsSingletone("htmlPagePublisherPlugins", LinkedDataHtmlPagePublisherPlugin);
        injector.bindToCollectionAsSingletone("htmlPagePublisherPlugins", OpenGraphHtmlPagePublisherPlugin);
        injector.bindToCollectionAsSingletone("htmlPagePublisherPlugins", SocialShareDataHtmlPagePublisherPlugin);
    }
}
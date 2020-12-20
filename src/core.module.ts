import { BlockService } from "@paperbits/common/blocks";
import { BlogService } from "@paperbits/common/blogs";
import { DefaultSettingsProvider } from "@paperbits/common/configuration";
import { DefaultEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { XmlHttpRequestClient } from "@paperbits/common/http";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { LayoutService } from "@paperbits/common/layouts/layoutService";
import { LocaleService } from "@paperbits/common/localization";
import { MediaService } from "@paperbits/common/media";
import { DefaultChangeCommitter } from "@paperbits/common/persistence";
import { NavigationService } from "@paperbits/common/navigation";
import { PageService } from "@paperbits/common/pages";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { DefaultPermalinkService, PermalinkResolver } from "@paperbits/common/permalinks";
import { DefaultRouteGuard, DefaultRouter } from "@paperbits/common/routing";
import { SiteService } from "@paperbits/common/sites";
import { UrlService } from "@paperbits/common/urls";
import { UrlPermalinkResolver } from "@paperbits/common/urls/urlPermalinkResolver";
import { ModelBinderSelector, WidgetService } from "@paperbits/common/widgets";
import { BackgroundModelBinder } from "@paperbits/common/widgets/background";
import { ButtonModule } from "./button/ko/button.module";
import { CardModule } from "./card/ko/card.module";
import { CollapsiblePanelModule } from "./collapsible-panel/ko";
import { ColumnModule } from "./column/ko/column.module";
import { ContentModule } from "./content/ko";
import { GridCellModule } from "./grid-cell/ko/gridCell.module";
import { GridModule } from "./grid-layout-section/ko/grid.module";
import { BackgroundBindingHandler } from "./ko/bindingHandlers/bindingHandlers.background";
import { SecuredBindingHandler } from "./ko/bindingHandlers/bindingHandlers.secured";
import { WidgetBindingHandler } from "./ko/bindingHandlers/bindingHandlers.widget";
import { KnockoutRegistrationLoaders } from "./ko/knockout.loaders";
import { KoModule } from "./ko/ko.module";
import { ViewModelBinderSelector } from "./ko/viewModelBinderSelector";
import { MenuModule } from "./menu/ko";
import { NavbarModule } from "./navbar/ko/navbar.module";
import { PictureModule } from "./picture/picture.module";
import { RowModule } from "./row/ko/row.module";
import { SectionModule } from "./section/ko/section.module";
import { TestimonialsModule } from "./testimonials/ko/testimonials.module";
import { TextblockModule } from "./textblock/ko/textblock.module";
import { VideoPlayerModule } from "./video-player/videoPlayer.publish.module";
import { YoutubePlayerPublishModule } from "./youtube-player/youtubePlayer.publish.module";
import { CarouselDesignModule } from "./carousel/carousel.design.module";


/**
 * Module registering core components.
 */
export class CoreModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindCollection("autostart");
        injector.bindCollection("styleHandlers");
        injector.bindCollectionLazily("widgetHandlers");
        injector.bindCollectionLazily("routeGuards");
        injector.bindCollectionLazily("modelBinders");
        injector.bindCollectionLazily("viewModelBinders");
        injector.bindCollectionLazily("permalinkResolvers");
        
        /*** Core ***/
        injector.bindSingleton("settingsProvider", DefaultSettingsProvider);
        injector.bindSingleton("router", DefaultRouter);
        injector.bindSingleton("httpClient", XmlHttpRequestClient);
        injector.bindSingleton("eventManager", DefaultEventManager);
        injector.bindSingleton("globalEventHandler", GlobalEventHandler);
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
        injector.bindSingleton("permalinkResolver", PermalinkResolver);
        injector.bindToCollection("permalinkResolvers", PagePermalinkResolver, "pagePermalinkResolver");
        injector.bindToCollection("permalinkResolvers", UrlPermalinkResolver, "urlPermalinkResolver");

        injector.bind("modelBinderSelector", ModelBinderSelector);
        injector.bind("viewModelBinderSelector", ViewModelBinderSelector);
        injector.bind("backgroundModelBinder", BackgroundModelBinder);

        injector.bindModule(new KnockoutRegistrationLoaders());
        injector.bindModule(new KoModule());
        injector.bindModule(new ContentModule());
        injector.bindModule(new ColumnModule());
        injector.bindModule(new RowModule());
        injector.bindModule(new TextblockModule());
        injector.bindModule(new SectionModule());
        injector.bindModule(new GridModule());
        injector.bindModule(new GridCellModule());
        injector.bindModule(new NavbarModule());
        injector.bindModule(new ButtonModule());
        // injector.bindModule(new MapModule());
        injector.bindModule(new MenuModule());
        injector.bindModule(new PictureModule());
        injector.bindModule(new VideoPlayerModule());
        injector.bindModule(new YoutubePlayerPublishModule());
        injector.bindModule(new TestimonialsModule());
        injector.bindModule(new CardModule());
        injector.bindModule(new CollapsiblePanelModule());

        injector.bindToCollection("routeGuards", DefaultRouteGuard);
        injector.bindToCollection("autostart", WidgetBindingHandler);
        injector.bindToCollection("autostart", BackgroundBindingHandler);
        injector.bindToCollection("autostart", SecuredBindingHandler);
    }
}
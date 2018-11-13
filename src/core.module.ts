import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder, ModelBinderSelector, WidgetService } from "@paperbits/common/widgets";
import { PictureModule } from "./picture/ko/picture.module";
import { VideoPlayerModule } from "./video-player/ko/videoPlayer.module";
import { YoutubePlayerModule } from "./youtube-player/ko/youtubePlayer.module";
import { NavbarModule } from "./navbar/ko/navbar.module";
import { TableOfContentsModule } from "./table-of-contents/ko/tableOfContents.module";
import { MapModule } from "./map/ko/map.module";
import { ButtonModule } from "./button/ko/button.module";
import { TestimonialsModule } from "./testimonials/ko/testimonials.module";
import { KoModule } from "./ko/ko.module";
import { LayoutModule } from "./layout/ko/layout.module";
import { PageModule } from "./page/ko/page.module";
import { BlogModule } from "./blog/blog.module";
import { ColumnModule } from "./column/ko/column.module";
import { SectionModule } from "./section/ko/section.module";
import { RowModule } from "./row/ko/row.module";
import { SliderModule } from "./slider/ko/slider.module";
import { SearchResultsModule } from "./search-results/ko/searchResults.module";
import { GoogleTagManager } from "./gtm/ko/gtm";
import { IntercomViewModel } from "./intercom/ko/intercomViewModel";
import { TextblockModule } from "./textblock/ko/textblock.module";
import { BackgroundModelBinder } from "@paperbits/common/widgets/background";
import { IntercomService } from "./intercom/intercomService";
import { KnockoutRegistrationLoaders } from "./ko/knockout.loaders";
import { IModelBinder } from "@paperbits/common/editing";
import { ViewModelBinderSelector } from "./ko/viewModelBinderSelector";
import { SavingHandler, OfflineObjectStorage, AnchorMiddleware } from "@paperbits/common/persistence";
import { PermalinkService, IPermalinkService, IPermalinkResolver, PermalinkResolver } from "@paperbits/common/permalinks";
import { XmlHttpRequestClient } from "@paperbits/common/http";
import { DefaultEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { LocalCache } from "@paperbits/common/caching";
import { LayoutService } from "@paperbits/common/layouts/layoutService";
import { PageService, PagePermalinkResolver } from "@paperbits/common/pages";
import { BlogService, BlogPermalinkResolver } from "@paperbits/common/blogs";
import { MediaService, MediaPermalinkResolver } from "@paperbits/common/media";
import { BlockService } from "@paperbits/common/blocks";
import { NavigationService } from "@paperbits/common/navigation";
import { SiteService } from "@paperbits/common/sites";
import { UrlService, UrlPermalinkResolver } from "@paperbits/common/urls";
import { UnhandledErrorHandler } from "@paperbits/common/errors";
import { PricingTableModule } from "./pricing-table/ko";

export class CoreModule implements IInjectorModule {
    public register(injector: IInjector): void {
        /*** Core ***/
        injector.bindSingleton("httpClient", XmlHttpRequestClient);
        // injector.bindSingleton("settingsProvider", SettingsProvider);
        injector.bindSingleton("eventManager", DefaultEventManager);
        injector.bindSingleton("globalEventHandler", GlobalEventHandler);
        injector.bindSingleton("localCache", LocalCache);
        injector.bindSingleton("offlineObjectStorage", OfflineObjectStorage);
        injector.bindSingleton("anchorMiddleware", AnchorMiddleware);

        /*** Services ***/
        injector.bindSingleton("permalinkService", PermalinkService);
        injector.bindSingleton("widgetService", WidgetService);
        injector.bindSingleton("layoutService", LayoutService);
        injector.bindSingleton("pageService", PageService);
        injector.bindSingleton("blogService", BlogService);
        injector.bindSingleton("mediaService", MediaService);
        injector.bindSingleton("blockService", BlockService);
        injector.bindSingleton("navigationService", NavigationService);
        injector.bindSingleton("siteService", SiteService);
        injector.bindSingleton("urlService", UrlService);
        injector.bindSingleton("savingHandler", SavingHandler);
        injector.bindSingleton("errorHandler", UnhandledErrorHandler);

        /*** Model binders ***/
        injector.bind("mediaPermalinkResolver", MediaPermalinkResolver);
        injector.bind("pagePermalinkResolver", PagePermalinkResolver);
        injector.bind("blogPermalinkResolver", BlogPermalinkResolver);
        injector.bind("urlPermalinkResolver", UrlPermalinkResolver);

        injector.bindSingletonFactory("permalinkResolver", (ctx: IInjector) => {
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            const mediaPermalinkResolver = ctx.resolve<IPermalinkResolver>("mediaPermalinkResolver");
            const pagePermalinkResolver = ctx.resolve<IPermalinkResolver>("pagePermalinkResolver");
            const blogPermalinkResolver = ctx.resolve<IPermalinkResolver>("blogPermalinkResolver");
            const urlPermalinkResolver = ctx.resolve<IPermalinkResolver>("urlPermalinkResolver");

            return new PermalinkResolver(permalinkService, [
                mediaPermalinkResolver,
                pagePermalinkResolver,
                blogPermalinkResolver,
                urlPermalinkResolver
            ]);
        });

        injector.bindModule(new KnockoutRegistrationLoaders());

        injector.bindSingletonFactory<IModelBinder[]>("modelBinders", () => {
            return new Array<IModelBinder>();
        });
        injector.bindSingletonFactory<IViewModelBinder<any, any>[]>("viewModelBinders", () => {
            return new Array<IViewModelBinder<any, any>>();
        });

        injector.bindSingleton("modelBinderSelector", ModelBinderSelector);
        injector.bindSingleton("viewModelBinderSelector", ViewModelBinderSelector);
        injector.bind("gtm", GoogleTagManager);
        injector.bind("intercom", IntercomViewModel);
        injector.bindSingleton("intercomService", IntercomService);
        injector.bind("backgroundModelBinder", BackgroundModelBinder);

        injector.bindModule(new KoModule());
        injector.bindModule(new LayoutModule());
        injector.bindModule(new PageModule());
        injector.bindModule(new BlogModule());
        injector.bindModule(new ColumnModule());
        injector.bindModule(new RowModule());
        injector.bindModule(new TextblockModule());
        injector.bindModule(new SectionModule());
        injector.bindModule(new NavbarModule());
        injector.bindModule(new ButtonModule());
        injector.bindModule(new MapModule());
        injector.bindModule(new TableOfContentsModule());
        injector.bindModule(new PictureModule());
        injector.bindModule(new VideoPlayerModule());
        injector.bindModule(new YoutubePlayerModule());
        injector.bindModule(new TestimonialsModule());
        injector.bindModule(new SliderModule());
        injector.bindModule(new SearchResultsModule());
        injector.bindModule(new PricingTableModule());
    }
}
import { Hinter } from "@paperbits/common/tutorials/hinter";
import { Confirmation } from "./workshops/confirmation/ko/confirmation";
import { LightboxBindingHandler } from "./ko/bindingHandlers/bindingHandlers.lightbox";
import { GridBindingHandler } from "./ko/bindingHandlers/bindingHandlers.grid";
import { DraggablesBindingHandler } from "./ko/bindingHandlers/bindingHandlers.draggables";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { VideoPlayerDesignModule } from "./video-player/videoPlayer.design.module";
import { PictureDesignModule } from "./picture/picture.design.module";
import { YoutubePlayerDesignModule } from "./youtube-player/youtubePlayer.design.module";
import { ButtonDesignModule } from "./button/button.design.module";
import { Dropdown } from "./dropdown/ko/dropdown";
import { TestimonialsEditorModule } from "./testimonials/ko/testimonialsEditor.module";
import { ColumnEditorModule } from "./column/ko/columnEditor.module";
import { SectionEditorModule } from "./section/ko/sectionEditor.module";
import { RowEditorModule } from "./row/ko/rowEditor.module";
import { BlockWorkshopModule } from "./workshops/block/ko/block.module";
import { PageDesignModule } from "./workshops/page/ko/page.design.module";
import { MediaWorkshopModule } from "./workshops/media/ko/media.module";
import { NavigationWorkshopModule } from "./workshops/navigation/ko/navigation.module";
import { SettingsWorkshopModule } from "./workshops/settings/ko/settings.module";
import { Workshops } from "./workshops/workshops";
import { TextblockDesignModule } from "./textblock/textblock.design.module";
import { DropbucketModule } from "./workshops/dropbucket/ko/dropbucket.module";
import { ViewportSelector } from "./workshops/viewports/ko/viewport-selector";
import { DefaultRouteGuard, DefaultRouter, JavaScriptRouteGuard, MailtoRouteGuard } from "@paperbits/common/routing";
import { LocaleEditor, LocaleSelector } from "./workshops/localization/ko";
import {
    BackgroundBindingHandler,
    BalloonBindingHandler,
    ContextualCommandBindingHandler,
    HostBindingHandler,
    ResizableBindingHandler,
    SurfaceBindingHandler,
    WidgetBindingHandler,
} from "./ko/bindingHandlers";
import { ComponentBinder } from "@paperbits/common/components";
import { ContainerModelBinder, HtmlEditorProvider, MediaHandlers } from "@paperbits/common/editing";
import { HyperlinkSelector } from "./workshops/hyperlinks/ko/hyperlinkSelector";
import { WidgetSelector } from "./workshops/widgets/ko/widgetSelector";
import { UrlHyperlinkDetails, UrlSelector } from "./workshops/urls/ko";
import { LayoutDesignModule } from "./layout/ko/layout.design.module";
import { UrlHyperlinkProvider } from "@paperbits/common/urls/urlHyperlinkProvider";
import { MediaHyperlinkProvider, MediaService } from "@paperbits/common/media";
import { DragManager } from "@paperbits/common/ui/draggables";
import { UnhandledErrorHandler } from "@paperbits/common/errors";
import { PlaceholderViewModel } from "./placeholder/ko/placeholderViewModel";
import { DefaultViewManager, Tooltip } from "./ko/ui";
import { CropperBindingHandler } from "./workshops/cropper/cropper";
import { GridEditor } from "./grid/ko";
import { CardEditorModule } from "./card/card.design.module";
import { MediaPermalinkResolver } from "@paperbits/common/media/mediaPermalinkResolver.design";
import { GridEditorModule } from "./grid-layout-section/ko/gridEditor.module";
import { GridCellEditorModule } from "./grid-cell/ko/gridCellEditor.module";
import { Tray } from "./workshops/tray/tray";
import { CollapsiblePanelEditorModule, CollapsiblePanelModule } from "./collapsible-panel/ko";
import { MenuEditorModule, MenuModule } from "./menu/ko";
import { KnockoutModule, Spinner, ViewModelBinderSelector } from "./ko";
import { DesignerUserService } from "./ko/ui/designerUserService";
import { RoleInput, RoleSelector } from "./workshops/roles/ko";
import "./ko/bindingHandlers/bindingHandlers.dialog";
import "./ko/bindingHandlers/bindingHandlers.activate";
import "./ko/bindingHandlers/bindingHandlers.attr2way";
import "./ko/bindingHandlers/bindingHandlers.whenInView";
import "./ko/bindingHandlers/bindingHandlers.listbox";
import "./ko/bindingHandlers/bindingHandlers.markdown";
import "./ko/bindingHandlers/bindingHandlers.view";
import { ContentEditorModule, ContentModule } from "./content/ko";
import { ViewStack } from "@paperbits/common/ui/viewStack";
import { MediaDisplay } from "./workshops/media/ko/mediaDisplay";
import { Lightbox } from "./workshops/media/ko/lightbox";
import { MapDesignModule } from "./map/map.design.module";
import { MemoryCache } from "@paperbits/common/caching";
import { DefaultHelpService } from "@paperbits/common/tutorials/defaultHelpService";
import { CarouselDesignModule } from "./carousel/ko";
import { TabPanelDesignModule } from "./tabs/tabPanel.design.module";
import { TableDesignModule } from "./table/ko";
import { TableCellDesignModule } from "./table-cell/tableCell.design.module";
// import { DividerDesignModule } from "./divider/divider.design.module";
import { DefaultSettingsProvider, LocalStorageSettingsProvider } from "@paperbits/common/configuration";
import { PopupHandlers, PopupModelBinder } from "./popup";
import { PopupHostViewModelBinder } from "./popup/ko/popupHostViewModelBinder";
import { PopupEditor, PopupViewModel, PopupViewModelBinder } from "./popup/ko";
import { PopupHost } from "./popup/ko/popupHost";
import { PopupSelector } from "./workshops/popups/ko";
import { PopupPermalinkResolver, PopupService } from "@paperbits/common/popups";
import { PopupHostModelBinder } from "./popup/popupHostModelBinder";
import { DismissButtonDesignModule } from "./dismiss-button/dismissButton.design.module";
import { StickToBindingHandler } from "./ko/bindingHandlers/bindingHandlers.stickTo";
import { KnockoutDesignModule } from "./ko/knockout.design.module";
import { HelpCenterBindingHandler } from "./ko/bindingHandlers/bindingHandlers.helpCenter";
import { HelpCenter } from "./workshops/helpCenter/helpCenter";
import { ConsoleLogger } from "@paperbits/common/logging";
import { DefaultChangeCommitter } from "@paperbits/common/persistence";
import { Bag } from "@paperbits/common";
import { XmlHttpRequestClient } from "@paperbits/common/http";
import { DefaultEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { ModelBinderSelector, WidgetService } from "@paperbits/common/widgets";
import { DefaultPermalinkService, PermalinkResolver } from "@paperbits/common/permalinks";
import { LayoutService } from "@paperbits/common/layouts";
import { PageService } from "@paperbits/common/pages";
import { BlogService } from "@paperbits/common/blogs";
import { BlockService } from "@paperbits/common/blocks";
import { NavigationService } from "@paperbits/common/navigation";
import { SiteService } from "@paperbits/common/sites";
import { UrlService } from "@paperbits/common/urls";
import { LocaleService } from "@paperbits/common/localization";
import { BackgroundModelBinder } from "@paperbits/common/widgets/background";
import { ColumnModule } from "./column/ko";
import { RowModule } from "./row/ko";
import { SectionModule } from "./section/ko";
import { GridModule } from "./grid-layout-section/ko";
import { GridCellModule } from "./grid-cell/ko";
import { TestimonialsModule } from "./testimonials/ko";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { UrlPermalinkResolver } from "@paperbits/common/urls/urlPermalinkResolver";


export class CoreDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindInstance("injector", injector);
        injector.bindCollection("autostart");
        injector.bindCollection("styleHandlers");
        injector.bindCollection("styleGroups");
        injector.bindCollection("dropHandlers");
        injector.bindCollection("trayCommands");
        injector.bindCollection("hyperlinkProviders");
        injector.bindCollectionLazily("widgetHandlers");
        injector.bindCollectionLazily("routeGuards");
        injector.bindCollectionLazily("modelBinders");
        injector.bindCollectionLazily("viewModelBinders");
        injector.bindCollectionLazily("permalinkResolvers");
        injector.bindCollectionLazily("workshopSections");
        injector.bindInstance<Bag<ComponentBinder>>("componentBinders", {});

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
        injector.bindSingleton("helpService", DefaultHelpService);

        /* Permalink resolvers */
        injector.bindSingleton("permalinkResolver", PermalinkResolver);
        injector.bindToCollectionAsSingletone("permalinkResolvers", PagePermalinkResolver, "pagePermalinkResolver");
        injector.bindToCollectionAsSingletone("permalinkResolvers", UrlPermalinkResolver, "urlPermalinkResolver");

        injector.bindSingleton("modelBinderSelector", ModelBinderSelector);
        injector.bindSingleton("viewModelBinderSelector", ViewModelBinderSelector);
        injector.bindSingleton("backgroundModelBinder", BackgroundModelBinder);

        /* Knockout */
        injector.bindModule(new KnockoutModule());
        injector.bindModule(new KnockoutDesignModule());

        /* Widgets */
        injector.bindSingleton("containerModelBinder", ContainerModelBinder);
        injector.bindModule(new ContentModule());
        injector.bindModule(new ColumnModule());
        injector.bindModule(new RowModule());
        injector.bindModule(new SectionModule());
        injector.bindModule(new GridModule());
        injector.bindModule(new GridCellModule());
        injector.bindModule(new MenuModule());
        injector.bindModule(new PictureDesignModule());
        injector.bindModule(new TestimonialsModule());
        injector.bindModule(new CollapsiblePanelModule());
        injector.bindModule(new TextblockDesignModule());
        injector.bindModule(new PictureDesignModule());
        injector.bindModule(new ButtonDesignModule());
        injector.bindModule(new VideoPlayerDesignModule());
        injector.bindModule(new YoutubePlayerDesignModule());
        injector.bindModule(new TestimonialsEditorModule());
        injector.bindModule(new MenuEditorModule());
        injector.bindModule(new DropbucketModule());
        injector.bindModule(new PageDesignModule());
        injector.bindModule(new MediaWorkshopModule());
        injector.bindModule(new LayoutDesignModule());
        injector.bindModule(new BlockWorkshopModule());
        injector.bindModule(new NavigationWorkshopModule());
        injector.bindModule(new SettingsWorkshopModule());
        injector.bindModule(new ColumnEditorModule());
        injector.bindModule(new RowEditorModule());
        injector.bindModule(new SectionEditorModule());
        injector.bindModule(new GridEditorModule());
        injector.bindModule(new GridCellEditorModule());
        injector.bindModule(new ContentEditorModule());
        injector.bindModule(new CardEditorModule());
        injector.bindModule(new CollapsiblePanelEditorModule());
        injector.bindModule(new CarouselDesignModule());
        injector.bindModule(new TabPanelDesignModule());
        injector.bindModule(new TableDesignModule());
        injector.bindModule(new TableCellDesignModule());
        injector.bindModule(new DismissButtonDesignModule());
        // injector.bindModule(new DividerDesignModule());
        // injector.bindModule(new BlogDesignModule());


        injector.bindSingleton("viewManager", DefaultViewManager);
        injector.bindSingleton("tray", Tray);
        injector.bindSingleton("viewStack", ViewStack);
        injector.bind("mediaDisplay", MediaDisplay);
        injector.bindSingleton("stateCache", MemoryCache);
        injector.bindSingleton("changesCache", MemoryCache);
        injector.bind("mediaHyperlinkProvider", MediaHyperlinkProvider);
        injector.bind("urlHyperlinkProvider", UrlHyperlinkProvider);
        injector.bind("gridEditor", GridEditor);
        injector.bindToCollection("autostart", ResizableBindingHandler);
        injector.bindToCollection("autostart", CropperBindingHandler);
        injector.bindToCollection("autostart", BalloonBindingHandler);
        injector.bindToCollection("autostart", UnhandledErrorHandler);
        injector.bindToCollection("autostart", SurfaceBindingHandler);
        injector.bindToCollection("autostart", HelpCenterBindingHandler);
        injector.bindToCollection("autostart", ContextualCommandBindingHandler);
        injector.bind("tooltip", Tooltip);
        injector.bindSingleton("dragManager", DragManager);
        injector.bindSingleton("lightbox", Lightbox);
        injector.bind("placeholderWidget", PlaceholderViewModel);
        injector.bindSingleton("htmlEditorProvider", HtmlEditorProvider);
        injector.bindSingleton("mediaHandler", MediaHandlers);
        injector.bind("workshops", Workshops);
        injector.bind("viewportSelector", ViewportSelector);
        injector.bind("localeSelector", LocaleSelector);
        injector.bind("localeEditor", LocaleEditor);
        injector.bind("hyperlinkSelector", HyperlinkSelector);
        injector.bind("widgetSelector", WidgetSelector);
        injector.bind("urlSelector", UrlSelector);
        injector.bind("urlHyperlinkDetails", UrlHyperlinkDetails);
        injector.bind("confirmation", Confirmation);
        injector.bind("roleSelector", RoleSelector);
        injector.bind("roleInput", RoleInput);
        injector.bind("spinner", Spinner);
        injector.bind("helpCenter", HelpCenter);
        injector.bind("localSettings", LocalStorageSettingsProvider);
        injector.bind("dropdown", Dropdown);
        injector.bindModule(new MapDesignModule());
        injector.bindToCollection("permalinkResolvers", MediaPermalinkResolver, "mediaPermalinkResolver");

        /* Popups */
        injector.bind("popup", PopupViewModel);
        injector.bind("popupHost", PopupHost);
        injector.bind("popupEditor", PopupEditor);
        injector.bind("popupSelector", PopupSelector);
        injector.bindSingleton("popupService", PopupService);
        injector.bindToCollection("modelBinders", PopupHostModelBinder, "popupHostModelBinder");
        injector.bindToCollection("permalinkResolvers", PopupPermalinkResolver, "popupPermalinkResolver");
        injector.bindToCollection("viewModelBinders", PopupViewModelBinder);
        injector.bindToCollection("widgetHandlers", PopupHandlers);
        injector.bindToCollection("modelBinders", PopupModelBinder, "popupModelBinder");
        injector.bindToCollection("viewModelBinders", PopupHostViewModelBinder, "popupHostViewModelBinder");



        /* Router */
        injector.bindSingleton("router", DefaultRouter);
        injector.bindToCollection("routeGuards", DefaultRouteGuard);
        injector.bindToCollection("routeGuards", MailtoRouteGuard);
        injector.bindToCollection("routeGuards", JavaScriptRouteGuard);


        injector.bindToCollection("hyperlinkProviders", UrlHyperlinkProvider);
        injector.bindToCollection("autostart", HostBindingHandler);
        injector.bindToCollection("autostart", DraggablesBindingHandler);
        injector.bindToCollection("autostart", GridBindingHandler);
        injector.bindToCollection("autostart", LightboxBindingHandler);
        injector.bindToCollection("autostart", StickToBindingHandler);
        injector.bindToCollection("autostart", Hinter);
        injector.bindToCollection("autostart", WidgetBindingHandler);
        injector.bindToCollection("autostart", BackgroundBindingHandler);

        injector.bindInstance("reservedPermalinks", ["/", "/404", "/500"]);
        injector.resolve("workshopSections");

        const userService = new DesignerUserService();
        injector.bindInstance("userService", userService);
        injector.bindInstance("designerUserService", userService);
    }
}

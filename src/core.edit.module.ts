import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { VideoPlayerEditorModule } from "./video-player/ko/videoPlayerEditor.module";
import { PictureEditorModule } from "./picture/ko/pictureEditor.module";
import { YoutubePlayerEditorModule } from "./youtube-player/ko/youtubePlayerEditor.module";
import { NavbarEditorModule } from "./navbar/ko/navbarEditor.module";
import { TableOfContentsEditorModule } from "./table-of-contents/ko/tableOfContentsEditor.module";
import { MapEditorModule } from "./map/ko/mapEditor.module";
import { ButtonEditorModule } from "./button/ko/buttonEditor.module";
import { TestimonialsEditorModule } from "./testimonials/ko/testimonialsEditor.module";
import { ColumnEditorModule } from "./column/ko/columnEditor.module";
import { SectionEditorModule } from "./section/ko/sectionEditor.module";
import { RowEditorModule } from "./row/ko/rowEditor.module";
import { BlockWorkshopModule } from "./workshops/block/ko/block.module";
import { BlogWorkshopModule } from "./workshops/blog/ko/blog.module";
import { SliderEditorModule } from "./slider/ko/sliderEditor.module";
import { LayoutWorkshopModule } from "./workshops/layout/ko/layout.module";
import { PageWorkshopModule } from "./workshops/page/ko/page.module";
import { SettingsWorkshop } from "./workshops/settings/ko/settings";
import { MediaWorkshopModule } from "./workshops/media/ko/media.module";
import { NavigationWorkshopModule } from "./workshops/navigation/ko/navigation.module";
import { Workshops } from "./workshops/ko/workshops";
import { TextblockEditorModule } from "./textblock/ko/textblockEditor.module";
import { DropbucketModule } from "./workshops/dropbucket/ko/dropbucket.module";
import { ViewportSelector } from "./workshops/viewports/ko/viewport-selector";
import { HostBindingHandler } from "./ko/bindingHandlers";
import { IContentDropHandler, IWidgetHandler, MediaHandlers, HtmlEditorProvider } from "@paperbits/common/editing";
import { DefaultRouteHandler } from "@paperbits/common/routing";
import { SettingsProvider } from "@paperbits/common/configuration";
import { ColorSelector } from "./workshops/colors/ko/colorSelector";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { IHyperlinkProvider, IViewManager, LityLightbox } from "@paperbits/common/ui";
import { HyperlinkSelector } from "./workshops/hyperlinks/ko/hyperlinkSelector";
import { WidgetSelector } from "./workshops/widgets/ko/widgetSelector";
import { UrlSelector } from "./workshops/urls/ko/urlSelector";
import { IUrlService } from "@paperbits/common/urls/IUrlService";
import { PageHyperlinkProvider } from "@paperbits/common/pages";
import { BlogHyperlinkProvider } from "@paperbits/common/blogs/blogHyperlinkProvider";
import { UrlHyperlinkProvider } from "@paperbits/common/urls/urlHyperlinkProvider";
import { MediaHyperlinkProvider } from "@paperbits/common/media";
import { DragManager } from "@paperbits/common/ui/draggables";
import { PlaceholderViewModel } from "./placeholder/ko/placeholderViewModel";

export class CoreEditModule implements IInjectorModule {

    constructor() {}

    register(injector: IInjector): void {
        // injector.bindSingleton("settingsProvider", SettingsProvider);
        // injector.bindSingleton("routeHandler", DefaultRouteHandler); 

        injector.bind("pageHyperlinkProvider", PageHyperlinkProvider);
        injector.bind("blogHyperlinkProvider", BlogHyperlinkProvider);
        injector.bind("mediaHyperlinkProvider", MediaHyperlinkProvider);
        injector.bind("urlHyperlinkProvider", UrlHyperlinkProvider);

        injector.bindFactory<IHyperlinkProvider[]>("resourcePickers", (ctx: IInjector) => {
            let pageReourcePicker = ctx.resolve<IHyperlinkProvider>("pageHyperlinkProvider");
            let blogReourcePicker = ctx.resolve<IHyperlinkProvider>("blogHyperlinkProvider");
            let mediaReourcePicker = ctx.resolve<IHyperlinkProvider>("mediaHyperlinkProvider");
            let urlHyperlinkProvider = ctx.resolve<IHyperlinkProvider>("urlHyperlinkProvider");

            return [
                pageReourcePicker,
                blogReourcePicker,
                mediaReourcePicker,
                urlHyperlinkProvider
            ]
        });

        /*** UI ***/
        injector.bindSingleton("dragManager", DragManager);
        injector.bindSingleton("lightbox", LityLightbox);
        injector.bind("placeholderWidget", PlaceholderViewModel);


        /*** Editors ***/
        injector.bindSingleton("htmlEditorProvider", HtmlEditorProvider);
        injector.bindSingletonFactory<Array<IContentDropHandler>>("dropHandlers", (ctx: IInjector) => {
            return new Array<IContentDropHandler>();
        });
        injector.bindSingletonFactory<Array<IWidgetHandler>>("widgetHandlers", (ctx: IInjector) => {
            return new Array<IWidgetHandler>();
        });
       
        injector.bindSingleton("mediaHandler", MediaHandlers);

        injector.bind("workshops", Workshops);
        injector.bind("viewportSelector", ViewportSelector);
        injector.bindSingleton("hostBindingHandler", HostBindingHandler);
        injector.bind("settingsWorkshop", SettingsWorkshop);        

        injector.bindComponent("colorSelector", (ctx: IInjector, params: {}) => {
            return new ColorSelector(params["onSelect"], params["selectedColor"]);
        });        

        injector.bindComponent("hyperlinkSelector", (ctx: IInjector, params: {}) => {
            let permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            let resourcePickers = ctx.resolve<IHyperlinkProvider[]>("resourcePickers");

            return new HyperlinkSelector(permalinkService, resourcePickers, params["hyperlink"], params["onChange"]);
        });

        injector.bindComponent("widgetSelector", (ctx: IInjector, params: {}) => {
            const viewManager = ctx.resolve<IViewManager>("viewManager");
            const widgetService = ctx.resolve<IWidgetService>("widgetService");
            return new WidgetSelector(viewManager, widgetService, params["onSelect"], params["onRequest"]);
        });

        injector.bindComponent("urlSelector", (ctx: IInjector, params: {}) => {
            const urlService = ctx.resolve<IUrlService>("urlService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            return new UrlSelector(urlService, permalinkService, params["onSelect"]);
        });
        
        injector.bindModule(new DropbucketModule());
        injector.bindModule(new LayoutWorkshopModule());
        injector.bindModule(new PageWorkshopModule());
        injector.bindModule(new BlogWorkshopModule());
        injector.bindModule(new BlockWorkshopModule());
        injector.bindModule(new MediaWorkshopModule());
        injector.bindModule(new NavigationWorkshopModule());
        injector.bindModule(new ColumnEditorModule());
        injector.bindModule(new RowEditorModule());
        injector.bindModule(new TextblockEditorModule());
        injector.bindModule(new SectionEditorModule());
        injector.bindModule(new NavbarEditorModule());
        injector.bindModule(new ButtonEditorModule());
        injector.bindModule(new MapEditorModule());
        injector.bindModule(new TableOfContentsEditorModule());
        injector.bindModule(new PictureEditorModule());
        injector.bindModule(new VideoPlayerEditorModule());
        injector.bindModule(new YoutubePlayerEditorModule());
        injector.bindModule(new TestimonialsEditorModule());
        injector.bindModule(new SliderEditorModule());
 
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
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
import { CoreModule } from "./core.module";

export class CoreEditModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bindModule(new CoreModule(this.modelBinders, this.viewModelBinders)); 

        injector.bind("workshops", Workshops);
        injector.bind("viewportSelector", ViewportSelector);
        injector.bindSingleton("hostBindingHandler", HostBindingHandler);
        injector.bind("settingsWorkshop", SettingsWorkshop);
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
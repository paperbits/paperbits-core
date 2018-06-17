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
import { KoModule } from "./ko/ko.module";
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
import { Workshops } from "./workshops/ko/workshops";

export class CoreEditModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bind("workshops", Workshops);
        injector.bind("settingsWorkshop", SettingsWorkshop);
        injector.bindModule(new KoModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new LayoutWorkshopModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new PageWorkshopModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new BlogWorkshopModule(this.modelBinders));
        injector.bindModule(new BlockWorkshopModule());
        injector.bindModule(new MediaWorkshopModule());
        injector.bindModule(new ColumnEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new RowEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new SectionEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new NavbarEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new ButtonEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new MapEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TableOfContentsEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new PictureEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new VideoPlayerEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new YoutubePlayerEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TestimonialsEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new SliderEditorModule(this.modelBinders, this.viewModelBinders));
    }
}
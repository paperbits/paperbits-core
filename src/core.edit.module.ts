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

export class CoreEditModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bindModule(new NavbarEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new ButtonEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new MapEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TableOfContentsEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new PictureEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new VideoPlayerEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new YoutubePlayerEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TestimonialsEditorModule(this.modelBinders, this.viewModelBinders));
    }
}
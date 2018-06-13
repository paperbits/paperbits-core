import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { PictureModule } from "./picture/ko/picture.module";
import { VideoPlayerModule } from "./video-player/ko/videoPlayer.module";
import { YoutubePlayerModule } from "./youtube-player/ko/youtubePlayer.module";
import { NavbarModule } from "./navbar/ko/navbar.module";
import { TableOfContentsModule } from "./table-of-contents/ko/tableOfContents.module";
import { MapModule } from "./map/ko/map.module";
import { ButtonModule } from "./button/ko/button.module";
import { TestimonialsModule } from "./testimonials/ko/testimonials.module";

export class CoreModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bindModule(new NavbarModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new ButtonModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new MapModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TableOfContentsModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new PictureModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new VideoPlayerModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new YoutubePlayerModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TestimonialsModule(this.modelBinders, this.viewModelBinders));
    }
}
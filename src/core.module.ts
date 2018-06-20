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
import { KoModule } from "./ko/ko.module";
import { LayoutModule } from "./layout/ko/layout.module";
import { PageModule } from "./page/ko/page.module";
import { BlogModule } from "./blog/blog.module";
import { ColumnModule } from "./column/ko/column.module";
import { SectionModule } from "./section/ko/section.module";
import { RowModule } from "./row/ko/row.module";
import { SliderModule } from "./slider/ko/slider.module";
import { GoogleTagManager } from "./gtm/ko/gtm";
import { IntercomViewModel } from "./intercom/ko/intercomViewModel";
import { TextblockModule } from "./textblock/ko/textblock.module";

export class CoreModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>
    ) { }

    register(injector: IInjector): void {        
        injector.bind("gtm", GoogleTagManager);
        injector.bind("intercom", IntercomViewModel);
        injector.bindModule(new KoModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new LayoutModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new PageModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new BlogModule(this.modelBinders));
        injector.bindModule(new ColumnModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new RowModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TextblockModule(this.viewModelBinders));
        injector.bindModule(new SectionModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new NavbarModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new ButtonModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new MapModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TableOfContentsModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new PictureModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new VideoPlayerModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new YoutubePlayerModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new TestimonialsModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new SliderModule(this.modelBinders, this.viewModelBinders));
    }
}
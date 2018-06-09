import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { VideoPlayerEditorModule } from "./video-player/ko/video-player.editor.module";
import { PictureEditorModule } from "./picture/ko/picture.editor.module";

export class CoreEditModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bindModule(new PictureEditorModule(this.modelBinders, this.viewModelBinders));
        injector.bindModule(new VideoPlayerEditorModule(this.modelBinders, this.viewModelBinders));
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { VideoPlayerViewModel } from "./ko/videoPlayerViewModel";
import { VideoPlayerModelBinder } from "./videoPlayerModelBinder";
import { VideoPlayerViewModelBinder } from "./ko/videoPlayerViewModelBinder";

export class VideoPlayerModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayer", VideoPlayerViewModel);
        injector.bindToCollection("modelBinders", VideoPlayerModelBinder);
        injector.bindToCollection("viewModelBinders", VideoPlayerViewModelBinder);
    }
}
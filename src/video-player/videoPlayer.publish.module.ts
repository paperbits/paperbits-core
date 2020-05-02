import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { VideoPlayer } from "./ko/videoPlayer";
import { VideoPlayerModelBinder } from "./videoPlayerModelBinder";
import { VideoPlayerViewModelBinder } from "./ko/videoPlayerViewModelBinder";

export class VideoPlayerModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayer", VideoPlayer);
        injector.bindToCollection("modelBinders", VideoPlayerModelBinder);
        injector.bindToCollection("viewModelBinders", VideoPlayerViewModelBinder);
    }
}
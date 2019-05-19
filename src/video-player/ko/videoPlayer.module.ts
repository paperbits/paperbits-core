import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { VideoPlayerViewModel } from "./videoPlayerViewModel";
import { VideoPlayerModelBinder } from "../videoPlayerModelBinder";
import { VideoPlayerViewModelBinder } from "./videoPlayerViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class VideoPlayerModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("videoPlayer", VideoPlayerViewModel);
        injector.bindToCollection("modelBinders", VideoPlayerModelBinder);
        injector.bindToCollection("viewModelBinders", VideoPlayerViewModelBinder);
    }
}
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { VideoPlayerViewModel } from "./videoPlayerViewModel";
import { VideoPlayerModelBinder } from "../videoPlayerModelBinder";
import { VideoPlayerViewModelBinder } from "./videoPlayerViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class VideoPlayerModule implements IInjectorModule {
    register(injector: IInjector): void {        
        injector.bind("videoPlayer", VideoPlayerViewModel);
        injector.bind("videoPlayerModelBinder", VideoPlayerModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("videoPlayerModelBinder"));

        injector.bind("videoPlayerViewModelBinder", VideoPlayerViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("videoPlayerViewModelBinder"));
    }
}
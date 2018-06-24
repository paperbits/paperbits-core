import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { YoutubeModelBinder } from "../youtubeModelBinder";
import { YoutubePlayerViewModel } from "./youtubePlayerViewModel";
import { YoutubePlayerViewModelBinder } from "./youtubePlayerViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class YoutubePlayerModule implements IInjectorModule {

    register(injector: IInjector): void {
        injector.bind("youtubePlayer", YoutubePlayerViewModel); 
        injector.bind("youtubeModelBinder", YoutubeModelBinder);
        const modelBinders = injector.resolve<Array<IModelBinder>>("modelBinders");
        modelBinders.push(injector.resolve("youtubeModelBinder"));

        injector.bind("youtubePlayerViewModelBinder", YoutubePlayerViewModelBinder);
        const viewModelBinders = injector.resolve<Array<IViewModelBinder<any, any>>>("viewModelBinders");
        viewModelBinders.push(injector.resolve("youtubePlayerViewModelBinder"));
    }
}
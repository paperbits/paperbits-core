import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { YoutubeModelBinder } from "../youtubeModelBinder";
import { YoutubePlayerViewModel } from "./youtubePlayerViewModel";
import { YoutubePlayerViewModelBinder } from "./youtubePlayerViewModelBinder";
import { IModelBinder } from "@paperbits/common/editing";

export class YoutubePlayerModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("youtubePlayer", YoutubePlayerViewModel); 
        injector.bindToCollection("modelBinders", YoutubeModelBinder);
        injector.bindToCollection("viewModelBinders", YoutubePlayerViewModelBinder);
    }
}
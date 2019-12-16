import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { YoutubeModelBinder } from "../youtubeModelBinder";
import { YoutubePlayerViewModel } from "./youtubePlayerViewModel";
import { YoutubePlayerViewModelBinder } from "./youtubePlayerViewModelBinder";

export class YoutubePlayerModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("youtubePlayer", YoutubePlayerViewModel); 
        injector.bindToCollection("modelBinders", YoutubeModelBinder);
        injector.bindToCollection("viewModelBinders", YoutubePlayerViewModelBinder);
    }
}
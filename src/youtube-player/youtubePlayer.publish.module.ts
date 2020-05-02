import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { YoutubeModelBinder } from "./youtubeModelBinder";
import { YoutubePlayerViewModel } from "./ko/youtubePlayer";
import { YoutubePlayerViewModelBinder } from "./ko/youtubePlayerViewModelBinder";

export class YoutubePlayerPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("youtubePlayer", YoutubePlayerViewModel); 
        injector.bindToCollection("modelBinders", YoutubeModelBinder);
        injector.bindToCollection("viewModelBinders", YoutubePlayerViewModelBinder);
    }
}
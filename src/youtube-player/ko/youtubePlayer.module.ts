import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { YoutubeModelBinder } from "../youtubeModelBinder";
import { YoutubePlayerViewModel } from "./youtubePlayerViewModel";
import { YoutubePlayerViewModelBinder } from "./youtubePlayerViewModelBinder";

export class YoutubePlayerModule implements IInjectorModule {
    constructor(
        private modelBinders:any,
        private viewModelBinders:Array<IViewModelBinder<any, any>>,
    ) { }

    register(injector: IInjector): void {
        injector.bind("youtubePlayer", YoutubePlayerViewModel); 
        injector.bind("youtubeModelBinder", YoutubeModelBinder);
        
        this.modelBinders.push(injector.resolve("youtubeModelBinder"));

        injector.bind("youtubePlayerViewModelBinder", YoutubePlayerViewModelBinder);
        this.viewModelBinders.push(injector.resolve("youtubePlayerViewModelBinder"));
    }
}
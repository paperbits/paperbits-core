import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { Picture } from "./ko/picture";
import { PictureViewModelBinder } from "./ko/pictureViewModelBinder";
import { PictureHandlers } from "./pictureHandlers";
import { PictureModel } from "./pictureModel";
import { PictureModelBinder } from "./pictureModelBinder";


export class PicturePublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("picture", Picture);
        injector.bindSingleton("pictureModelBinder", PictureModelBinder);
        injector.bindSingleton("pictureViewModelBinder", PictureViewModelBinder)
        injector.bindSingleton("pictureHandler", PictureHandlers);

        const registry = injector.resolve<IWidgetService>("widgetService");

        registry.registerWidget("picture", {
            modelDefinition: PictureModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: Picture,
            modelBinder: PictureModelBinder,
            viewModelBinder: PictureViewModelBinder
        });
    }
}
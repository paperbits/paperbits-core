import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ContainerViewModel } from "./ko/containerViewModel";
import { ContainerModelBinder } from "./containerModelBinder";
import { ContainerViewModelBinder } from "./ko/containerViewModelBinder";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";
import { ContainerModel } from "./containerModel";

export class ContainerPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("container", ContainerViewModel);
        injector.bindSingleton("containerModelBinder", ContainerModelBinder);
        injector.bindSingleton("containerViewModelBinder", ContainerViewModelBinder)

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("container", {
            componentBinder: KnockoutComponentBinder,
            componentDefinition: ContainerViewModel,
            modelBinder: ContainerModelBinder,
            modelDefinition: ContainerModel,
            viewModelBinder: ContainerViewModelBinder
        });
    }
}
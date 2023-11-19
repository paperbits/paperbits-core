import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ContainerEditor } from "./ko/containerEditor";
import { ContainerHandlers } from "./containerHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";
import { IWidgetService } from "@paperbits/common/widgets";
import { ContainerModel } from "./containerModel";
import { ContainerViewModel } from "./ko/containerViewModel";
import { ContainerModelBinder } from "./containerModelBinder";
import { ContainerViewModelBinder } from "./ko/containerViewModelBinder";
import { KnockoutComponentBinder } from "../ko/knockoutComponentBinder";


export class ContainerEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("containerEditor", ContainerEditor);
        injector.bindSingleton("containerModelBinder", ContainerModelBinder);
        injector.bindSingleton("containerViewModelBinder", ContainerViewModelBinder)
        injector.bindSingleton("containerHandler", ContainerHandlers);

        const styleGroup: IStyleGroup = {
            key: "container",
            name: "components_container",
            groupName: "Container",
            styleTemplate: `<div data-bind="stylePreview: variation.key, styleableGlobal: variation" style="width: 340px"><h1>Container</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...</p></div>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("container", {
            componentBinder: KnockoutComponentBinder,
            componentDefinition: ContainerViewModel,
            modelBinder: ContainerModelBinder,
            modelDefinition: ContainerModel,
            viewModelBinder: ContainerViewModelBinder
        });

        widgetService.registerWidgetEditor("container", {
            displayName: "Container",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: ContainerEditor,
            handlerComponent: ContainerHandlers,
            iconClass: "widget-icon widget-icon-component",
            draggable: true
        });
    }
}
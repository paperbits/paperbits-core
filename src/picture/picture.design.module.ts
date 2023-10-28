import template from "./ko/styleGuideCard.html";
import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { IWidgetService } from "@paperbits/common/widgets";
import { PictureModel, PictureModelBinder } from ".";
import { KnockoutComponentBinder } from "../ko";
import { Picture, PictureViewModelBinder } from "./ko";
import { PictureEditor } from "./ko/pictureEditor";
import { PictureHandlers } from "./pictureHandlers";


export class PictureDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("picture", Picture);
        injector.bind("pictureEditor", PictureEditor);
        injector.bindSingleton("pictureModelBinder", PictureModelBinder);
        injector.bindSingleton("pictureViewModelBinder", PictureViewModelBinder)
        injector.bindSingleton("pictureHandler", PictureHandlers);

        // TODO: Create respective handler property in WidgetEditorDefinition
        injector.bindToCollectionAsSingletone("dropHandlers", PictureHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("picture", {
            modelDefinition: PictureModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: Picture,
            modelBinder: PictureModelBinder,
            viewModelBinder: PictureViewModelBinder
        });

        widgetService.registerWidgetEditor("picture", {
            displayName: "Picture",
            iconClass: "widget-icon widget-icon-picture",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: PictureEditor,
            handlerComponent: PictureHandlers
        });

        const styleGroup: IStyleGroup = {
            key: "picture",
            name: "components_picture",
            groupName: "Picture",
            styleTemplate: template
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);

        // injector.bindToCollection<IContentDropHandler>("dropHandlers",  PictureHandlers, "pictureDropHandler");
    }
}
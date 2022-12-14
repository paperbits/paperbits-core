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
            groupName: "Pictures",
            selectorTemplate: `<img src="https://cdn.paperbits.io/images/placeholder-340x190.jpg" alt="Picture" data-bind="css: classNames" width="280px" height="190px" /><div data-bind="text: displayName"></div>`,
            styleTemplate: template
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);

        // injector.bindToCollection<IContentDropHandler>("dropHandlers",  PictureHandlers, "pictureDropHandler");
    }
}
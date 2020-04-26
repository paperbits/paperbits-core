import template from "./ko/styleGuideCard.html";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { PictureEditor } from "./ko/pictureEditor";
import { PictureHandlers } from "./pictureHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";

export class PictureDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("pictureEditor", PictureEditor);

        const styleGroup: IStyleGroup = { 
            key: "picture",
            name: "components_picture", 
            groupName: "Pictures",
            selectorTemplate: `<img src="https://cdn.paperbits.io/images/placeholder-340x190.jpg" alt="Picture" data-bind="css: classNames" width="280px" height="190px" /><div data-bind="text: displayName"></div>`,
            styleTemplate: template
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
        
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", PictureHandlers, "pictureWidgetHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers",  PictureHandlers, "pictureDropHandler");
    }
}
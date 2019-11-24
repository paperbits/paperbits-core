import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { PictureEditor } from "./pictureEditor";
import { PictureHandlers } from "../pictureHandlers";
import { IStyleGroup } from "@paperbits/common/styles/IStyleGroup";

export class PictureEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("pictureEditor", PictureEditor);

        const styleGroup: IStyleGroup = { 
            key: "picture",
            name: "components_picture", 
            groupName: "Pictures",
            selectorTemplate: `<img src="https://cdn.paperbits.io/images/placeholder-340x190.jpg" alt="Picture" data-bind="css: classNames" width="280px" height="190px" /><div data-bind="text: displayName"></div>`,
            styleTemplate: `<img src="https://cdn.paperbits.io/images/placeholder-340x190.jpg" alt="Picture" data-bind="stylePreview: variation" width="340px" height="190px" />`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
        
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", PictureHandlers, "pictureWidgetHandler");
        injector.bindToCollection<IContentDropHandler>("dropHandlers",  PictureHandlers, "pictureDropHandler");
    }
}
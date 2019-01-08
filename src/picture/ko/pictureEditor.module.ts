import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { PictureEditor } from "./pictureEditor";
import { PictureHandlers } from "../pictureHandlers";

export class PictureEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("pictureEditor", PictureEditor);
        injector.bindToCollection<IWidgetHandler>("widgetHandlers", PictureHandlers, "pictureWidgetHandler");
         injector.bindToCollection<IContentDropHandler>("dropHandlers",  PictureHandlers, "pictureDropHandler");
    }
}
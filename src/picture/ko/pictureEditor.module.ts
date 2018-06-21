import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler, IContentDropHandler } from "@paperbits/common/editing";
import { PictureEditor } from "./pictureEditor";
import { PictureHandlers } from "../pictureHandlers";
export class PictureEditorModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bind("pictureEditor", PictureEditor);
        injector.bindSingleton("pictureDropHandler", PictureHandlers);

        const dropHandlers:Array<IContentDropHandler> = injector.resolve("dropHandlers");
        dropHandlers.push(injector.resolve<PictureHandlers>("pictureDropHandler"));

        const widgetHandlers:Array<IWidgetHandler> = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<PictureHandlers>("pictureDropHandler"));
    }
}
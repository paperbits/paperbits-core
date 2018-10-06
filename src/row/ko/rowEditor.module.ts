import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IWidgetHandler } from "@paperbits/common/editing";
import { RowLayoutSelector } from "./rowLayoutSelector";
import { RowHandlers } from "../rowHandlers";


export class RowEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("rowLayoutSelector", RowLayoutSelector);
        injector.bind("rowHandler", RowHandlers);

        const widgetHandlers: IWidgetHandler[] = injector.resolve("widgetHandlers");
        widgetHandlers.push(injector.resolve<RowHandlers>("rowHandler"));
    }
}
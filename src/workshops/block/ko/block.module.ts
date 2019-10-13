import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { BlockSelector } from "./blockSelector";
import { AddBlockDialog } from "./addBlockDialog";
import { WidgetContainer } from "./widgetContainer";

export class BlockWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("widgetContainer", WidgetContainer);
        injector.bind("blockSelector", BlockSelector);
        injector.bind("addBlockDialog", AddBlockDialog);
    }
}
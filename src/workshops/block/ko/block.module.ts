import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { BlockSelector } from "./blockSelector";
import { AddBlockDialog } from "./addBlockDialog";

export class BlockWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("blockSelector", BlockSelector);
        injector.bind("addBlockDialog", AddBlockDialog);
    }
}
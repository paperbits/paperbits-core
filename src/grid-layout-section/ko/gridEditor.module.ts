import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { GridLayoutSelector } from "./gridLayoutSelector";


export class GridEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("gridLayoutSelector", GridLayoutSelector);
    }
}
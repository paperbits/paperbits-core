import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { LayoutWorkshopModule } from "../../workshops/layout/ko";


export class LayoutDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bindModule(new LayoutWorkshopModule());
    }
}
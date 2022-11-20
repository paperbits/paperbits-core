import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TableViewModel } from "./ko/tableViewModel";
import { TableModelBinder } from "./tableModelBinder";
import { TableViewModelBinder } from "./ko/tableViewModelBinder";
import { IWidgetService } from "@paperbits/common/widgets";
import { TableModel } from "./tableModel";
import { KnockoutComponentBinder } from "../ko";

export class TablePublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("table", TableViewModel);
        injector.bindSingleton("tableModelBinder", TableModelBinder);
        injector.bindSingleton("tableViewModelBinder", TableViewModelBinder)

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("table", {
            modelDefinition: TableModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TableViewModel,
            modelBinder: TableModelBinder,
            viewModelBinder: TableViewModelBinder
        });
    }
}
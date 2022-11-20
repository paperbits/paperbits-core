import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { TableCellViewModel } from "./ko/tableCellViewModel";
import { TableCellViewModelBinder } from "./ko/tableCellViewModelBinder";
import { TableCellModel } from "./tableCellModel";
import { TableCellModelBinder } from "./tableCellModelBinder";


export class TableCellPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableCell", TableCellViewModel);
        injector.bindSingleton("tableModelBinder", TableCellModelBinder);
        injector.bindSingleton("tableViewModelBinder", TableCellViewModelBinder)

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("table-cell", {
            modelDefinition: TableCellModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TableCellViewModel,
            modelBinder: TableCellModelBinder,
            viewModelBinder: TableCellViewModelBinder
        });
    }
}
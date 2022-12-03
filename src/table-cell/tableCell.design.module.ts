import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import { IWidgetService } from "@paperbits/common/widgets";
import { KnockoutComponentBinder } from "../ko";
import { TableCellEditor, TableCellViewModel, TableCellViewModelBinder } from "./ko";
import { TableCellHandlers } from "./tableCellHandlers";
import { TableCellModel } from "./tableCellModel";
import { TableCellModelBinder } from "./tableCellModelBinder";


export class TableCellDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableCell", TableCellViewModel);
        injector.bind("tableCellEditor", TableCellEditor);
        injector.bindSingleton("tableModelBinder", TableCellModelBinder);
        injector.bindSingleton("tableViewModelBinder", TableCellViewModelBinder)
        injector.bindSingleton("tableHandler", TableCellHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("table-cell", {
            modelDefinition: TableCellModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TableCellViewModel,
            modelBinder: TableCellModelBinder,
            viewModelBinder: TableCellViewModelBinder
        });

        widgetService.registerWidgetEditor("table-cell", {
            displayName: "Table cell",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TableCellEditor,
            handlerComponent: TableCellHandlers,
            selectable: false
        });
    }
}
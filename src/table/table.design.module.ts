import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { TableViewModel } from "./ko/tableViewModel";
import { TableModelBinder } from "./tableModelBinder";
import { TableViewModelBinder } from "./ko/tableViewModelBinder";
import { TableHandlers } from "./tableHandlers";
import { TableColumnEditor } from "./ko/tableColumnEditor";
import { TableEditor } from "./ko/tableEditor";
import { TableRowEditor } from "./ko/tableRowEditor";
import { KnockoutComponentBinder } from "../ko";
import { IWidgetService } from "@paperbits/common/widgets";
import { TableModel } from "./tableModel";


export class TableDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tableEditor", TableEditor);
        injector.bind("tableColumnEditor", TableColumnEditor);
        injector.bind("tableRowEditor", TableRowEditor);
        injector.bind("table", TableViewModel);
        injector.bind("tableEditor", TableEditor);
        injector.bindSingleton("tableModelBinder", TableModelBinder);
        injector.bindSingleton("tableViewModelBinder", TableViewModelBinder)
        injector.bindSingleton("tableHandler", TableHandlers);

        const widgetService = injector.resolve<IWidgetService>("widgetService");

        widgetService.registerWidget("table", {
            modelDefinition: TableModel,
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TableViewModel,
            modelBinder: TableModelBinder,
            viewModelBinder: TableViewModelBinder
        });

        widgetService.registerWidgetEditor("table", {
            displayName: "Table",
            iconClass: "widget-icon widget-icon-table",
            componentBinder: KnockoutComponentBinder,
            componentDefinition: TableEditor,
            handlerComponent: TableHandlers
        });
    }
}
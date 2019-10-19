import { ViewModelBinder } from "@paperbits/common/widgets";
import { EventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";
import { MenuViewModel } from "./menuViewModel";
import { MenuModel } from "../menuModel";
import { MenuModelBinder, MenuContract } from "..";
import { MenuItemViewModel } from "./menuItemViewModel";
import { NavigationItemModel } from "@paperbits/common/navigation";
import { IStyleCompiler } from "@paperbits/common/styles";


export class MenuViewModelBinder implements ViewModelBinder<MenuModel, MenuViewModel> {
    constructor(
        private readonly eventManager: EventManager,
        private readonly menuModelBinder: MenuModelBinder,
        private readonly styleCompiler: IStyleCompiler
    ) { }

    private menuItemModelToViewModel(navitem: NavigationItemModel, level: number = 0): MenuItemViewModel {
        level++;

        const viewModel = new MenuItemViewModel();
        viewModel.label(navitem.label);
        viewModel.url(navitem.targetUrl);
        viewModel.isActive(navitem.isActive);
        viewModel.level(level);
        viewModel.nodes(navitem.nodes.map(x => this.menuItemModelToViewModel(x, level)));

        return viewModel;
    }

    public async modelToViewModel(model: MenuModel, viewModel?: MenuViewModel, bindingContext?: Bag<any>): Promise<MenuViewModel> {
        if (!viewModel) {
            viewModel = new MenuViewModel();
        }

        const menuItems = model.items.map(menuItem => this.menuItemModelToViewModel(menuItem));
        viewModel.nodes(menuItems);
        viewModel.layout(model.layout);
        viewModel.roles(model.roles);

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles));
        }

        viewModel["widgetBinding"] = {
            displayName: "Menu",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            editor: "menu-editor",
            applyChanges: async (updatedModel: MenuModel) => {
                const contract: MenuContract = {
                    type: "menu",
                    navigationItemKey: updatedModel.navigationItemKey,
                    layout: updatedModel.layout,
                    roles: updatedModel.roles,
                    minHeading: updatedModel.minHeading,
                    maxHeading: updatedModel.maxHeading,
                    styles: updatedModel.styles
                };

                model = await this.menuModelBinder.contractToModel(contract, bindingContext);

                this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: MenuModel): boolean {
        return model instanceof MenuModel;
    }
}
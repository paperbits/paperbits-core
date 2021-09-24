import { ViewModelBinder } from "@paperbits/common/widgets";
import { NavigationItemModel } from "@paperbits/common/navigation";
import { NavigationItemViewModel } from ".";


export class NavigationViewModelBinder implements ViewModelBinder<NavigationItemModel, NavigationItemViewModel> {
    public async modelToViewModel(model: NavigationItemModel): Promise<NavigationItemViewModel> {
        if (!model) {
            throw new Error(`Parameter "model" not specified.`);
        }

        const viewModel = new NavigationItemViewModel(model);
        viewModel.key = model.key;
        viewModel.label(model.label);
        viewModel.targetKey(model.targetKey);
        viewModel.targetUrl(model.targetUrl);
        viewModel.anchor(model.anchor);

        if (model.nodes) {
            const tasks = [];
            model.nodes.forEach(child => tasks.push(this.modelToViewModel(child)));

            const childViewModels = await Promise.all<NavigationItemViewModel>(tasks);

            childViewModels.forEach(childViewModel => {
                viewModel.nodes.push(childViewModel);
                childViewModel.parent = viewModel;
            });
        }

        return viewModel;
    }

    public viewModelToModel(viewModel: NavigationItemViewModel): NavigationItemModel {
        const model: NavigationItemModel = {
            key: viewModel.key,
            label: viewModel.label(),
            targetKey: viewModel.targetKey(),
            targetUrl: viewModel.targetUrl(),
            targetWindow: viewModel.targetWindow(),
            triggerEvent: viewModel.triggerEvent(),
            anchor: viewModel.anchor(),
            nodes: viewModel.nodes().map(x => this.viewModelToModel(x))
        };

        return model;
    }

    public canHandleModel(model: NavigationItemModel): boolean {
        return model instanceof NavigationItemModel;
    }
}
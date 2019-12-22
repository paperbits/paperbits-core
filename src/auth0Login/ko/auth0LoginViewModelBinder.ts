import { Auth0LoginViewModel } from "./auth0LoginViewModel";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { Auth0LoginModel } from "../auth0LoginModel";
import { EventManager } from "@paperbits/common/events";
import { IWidgetBinding } from "@paperbits/common/editing";
import { Bag } from "@paperbits/common";

export class Auth0LoginViewModelBinder implements ViewModelBinder<Auth0LoginModel, Auth0LoginViewModel>  {
    constructor(private readonly eventManager: EventManager) { }

    public async modelToViewModel(model: Auth0LoginModel, viewModel?: Auth0LoginViewModel, bindingContext?: Bag<any>): Promise<Auth0LoginViewModel> {
        if (!viewModel) {
            viewModel = new Auth0LoginViewModel();
        }

        viewModel.runtimeConfig(JSON.stringify(model));

        const binding: IWidgetBinding<Auth0LoginModel> = {
            name: "auth0-login",
            displayName: "Auth0 login",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            editor: "auth0-login-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        viewModel["widgetBinding"] = binding;

        return viewModel;
    }

    public canHandleModel(model: Auth0LoginModel): boolean {
        return model instanceof Auth0LoginModel;
    }
}
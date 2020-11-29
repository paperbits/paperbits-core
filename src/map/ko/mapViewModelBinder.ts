import { MapViewModel } from "./mapViewModel";
import { MapModel } from "../mapModel";
import { EventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";
import { StyleCompiler } from "@paperbits/common/styles";

export class MapViewModelBinder {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler
    ) { }

    public async modelToViewModel(model: MapModel, viewModel?: MapViewModel, bindingContext?: Bag<any>): Promise<MapViewModel> {
        if (!viewModel) {
            viewModel = new MapViewModel();
        }

        viewModel.runtimeConfig(JSON.stringify({
            caption: model.caption,
            location: model.location,
            zoom: model.zoom,
            mapType: model.mapType
        }));

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel["widgetBinding"] = {
            displayName: "Map",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            flow: "inline",
            draggable: true,
            editor: "paperbits-map-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        };

        return viewModel;
    }

    public canHandleModel(model: MapModel): boolean {
        return model instanceof MapModel;
    }
}
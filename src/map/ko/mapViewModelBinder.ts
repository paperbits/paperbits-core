import { MapViewModel } from "./mapViewModel";
import { MapService } from "../mapService";
import { MapModel } from "../mapModel";

export class MapViewModelBinder {
    constructor(
        private readonly mapService: MapService
    ) { }

    public modelToViewModel(model: MapModel, readonly: boolean, viewModel?: MapViewModel): MapViewModel {
        if (!viewModel) {
            viewModel = new MapViewModel(this.mapService);
        }

        viewModel.caption(model.caption);
        viewModel.layout(model.layout);
        viewModel.location(model.location);
        viewModel.zoomControl(model.zoomControl);

        viewModel["widgetBinding"] = {
            displayName: "Map",
            readonly: readonly,
            model: model,
            editor: "paperbits-map-editor",
            applyChanges: () => {
                this.modelToViewModel(model, readonly, viewModel);
            }
        }

        return viewModel;
    }

    public canHandleModel(model: MapModel): boolean {
        return model instanceof MapModel;
    }
}
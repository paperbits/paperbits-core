import { MapViewModel } from "./mapViewModel";
import { MapService } from "../mapService";
import { MapModel } from "../mapModel";
import { IEventManager } from "@paperbits/common/events";

export class MapViewModelBinder {
    constructor(
        private readonly mapService: MapService,
        private readonly eventManager: IEventManager
    ) { }

    public async modelToViewModel(model: MapModel, viewModel?: MapViewModel): Promise<MapViewModel> {
        if (!viewModel) {
            viewModel = new MapViewModel(this.mapService);
        }

        viewModel.caption(model.caption);
        viewModel.layout(model.layout);
        viewModel.location(model.location);
        viewModel.zoomControl(model.zoomControl);

        viewModel["widgetBinding"] = {
            displayName: "Map",
            
            model: model,
            editor: "paperbits-map-editor",
            applyChanges: () => {
                this.modelToViewModel(model, viewModel);
                this.eventManager.dispatchEvent("onContentUpdate");
            }
        }

        return viewModel;
    }

    public canHandleModel(model: MapModel): boolean {
        return model instanceof MapModel;
    }
}
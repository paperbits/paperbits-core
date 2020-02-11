import { MapViewModel } from "./mapViewModel";
import { MapService } from "../mapService";
import { MapModel } from "../mapModel";
import { EventManager } from "@paperbits/common/events";
import { Bag } from "@paperbits/common";

export class MapViewModelBinder {
    constructor(
        private readonly mapService: MapService,
        private readonly eventManager: EventManager
    ) { }

    public async modelToViewModel(model: MapModel, viewModel?: MapViewModel, bindingContext?: Bag<any>): Promise<MapViewModel> {
        if (!viewModel) {
            viewModel = new MapViewModel(this.mapService);
        }

        viewModel.caption(model.caption);
        viewModel.layout(model.layout);
        viewModel.location(model.location);
        viewModel.zoomControl(model.zoomControl);

        viewModel["widgetBinding"] = {
            displayName: "Map",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
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
import { Bag } from "@paperbits/common";
import { EventManager } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { MapViewModel } from "./mapViewModel";
import { MapModel } from "../mapModel";
import { GoogleMapsSettings } from "./googleMapsSettings";

const defaultApiKey = "AIzaSyC7eT_xRPt3EjX3GuzSvlaZzJmlyFxvFFs";

export class MapViewModelBinder {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly settingsProvider: ISettingsProvider
    ) { }

    public async modelToViewModel(model: MapModel, viewModel?: MapViewModel, bindingContext?: Bag<any>): Promise<MapViewModel> {
        if (!viewModel) {
            viewModel = new MapViewModel();
        }
        
      const settings = await this.settingsProvider.getSetting<GoogleMapsSettings>("integration/googleMaps");
      const apiKey = settings?.apiKey || defaultApiKey;

        viewModel.runtimeConfig(JSON.stringify({
            caption: model.caption,
            location: model.location,
            zoom: model.zoom,
            mapType: model.mapType,
            apiKey: apiKey
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
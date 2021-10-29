import { Bag } from "@paperbits/common";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { MapViewModel } from "./mapViewModel";
import { MapModel } from "../mapModel";
import { GoogleMapsSettings } from "./googleMapsSettings";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { ComponentFlow } from "@paperbits/common/editing";

const defaultApiKey = "AIzaSyC7eT_xRPt3EjX3GuzSvlaZzJmlyFxvFFs";

export class MapViewModelBinder {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly settingsProvider: ISettingsProvider,
        private readonly mediaPermalinkResolver: IPermalinkResolver
    ) { }

    public async modelToViewModel(model: MapModel, viewModel?: MapViewModel, bindingContext?: Bag<any>): Promise<MapViewModel> {
        if (!viewModel) {
            viewModel = new MapViewModel();
        }

        const settings = await this.settingsProvider.getSetting<GoogleMapsSettings>("integration/googleMaps");
        const apiKey = settings?.apiKey || defaultApiKey;

        const markerIconUrl =
            model.marker?.sourceKey
                ? await this.mediaPermalinkResolver.getUrlByTargetKey(model.marker.sourceKey)
                : null;

        viewModel.runtimeConfig(JSON.stringify({
            apiKey: apiKey,
            caption: model.caption,
            location: model.location,
            zoom: model.zoom,
            mapType: model.mapType,
            markerIcon: markerIconUrl,
            markerPopupKey: model.marker?.popupKey,
            customizations: model.customizations
        }));

        if (model.styles) {
            viewModel.styles(await this.styleCompiler.getStyleModelAsync(model.styles, bindingContext?.styleManager));
        }

        viewModel["widgetBinding"] = {
            displayName: "Map",
            readonly: bindingContext ? bindingContext.readonly : false,
            model: model,
            flow: ComponentFlow.Inline,
            draggable: true,
            editor: "paperbits-map-editor",
            applyChanges: async () => {
                await this.modelToViewModel(model, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: MapModel): boolean {
        return model instanceof MapModel;
    }
}
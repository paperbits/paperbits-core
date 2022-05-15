import { Bag } from "@paperbits/common";
import { EventManager, Events } from "@paperbits/common/events";
import { StyleCompiler } from "@paperbits/common/styles";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { MapViewModel } from "./mapViewModel";
import { MapModel } from "../mapModel";
import { GoogleMapsSettings } from "./googleMapsSettings";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { ComponentFlow } from "@paperbits/common/editing";
import { ISiteService } from "@paperbits/common/sites";
import { Geolocation } from "@paperbits/common/geocoding";


const googleMapsSettingsPath = "integration/googleMaps";

export class MapViewModelBinder {
    constructor(
        private readonly eventManager: EventManager,
        private readonly styleCompiler: StyleCompiler,
        private readonly settingsProvider: ISettingsProvider,
        private readonly mediaPermalinkResolver: IPermalinkResolver,
        private readonly siteService: ISiteService
    ) { }

    public async modelToViewModel(model: MapModel, viewModel?: MapViewModel, bindingContext?: Bag<any>): Promise<MapViewModel> {
        if (!viewModel) {
            viewModel = new MapViewModel();
        }

        let googleMapsSettings = await this.settingsProvider.getSetting<GoogleMapsSettings>(googleMapsSettingsPath);

        if (!googleMapsSettings) {
            googleMapsSettings = await this.siteService.getSetting<any>(googleMapsSettingsPath);
        }

        const apiKey = googleMapsSettings?.apiKey;
        viewModel.hasApiKey(!!apiKey);

        let location: Geolocation;
        if (typeof model.location === "object" && model.location.hasOwnProperty("lat") && model.location.hasOwnProperty("lng")) {
            location = model.location;
        }
        else {
            location = { address: "400 Broad St, Seattle, WA 98109", lat: 47.6203953, lng: -122.3493709 };
        }

        const markerIconUrl =
            model.marker?.sourceKey
                ? await this.mediaPermalinkResolver.getUrlByTargetKey(model.marker.sourceKey)
                : null;

        viewModel.runtimeConfig(JSON.stringify({
            apiKey: apiKey,
            caption: model.caption,
            location: location,
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
            layer: bindingContext?.layer,
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
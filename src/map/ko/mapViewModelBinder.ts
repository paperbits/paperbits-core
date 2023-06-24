import { ISettingsProvider } from "@paperbits/common/configuration";
import { Geolocation } from "@paperbits/common/geocoding";
import { IPermalinkResolver } from "@paperbits/common/permalinks";
import { ISiteService } from "@paperbits/common/sites";
import { StyleCompiler } from "@paperbits/common/styles";
import { WidgetState } from "@paperbits/common/widgets";
import { MapModel } from "../mapModel";
import { GoogleMapsSettings } from "./googleMapsSettings";
import { MapViewModel } from "./mapViewModel";


const googleMapsSettingsPath = "integration/googleMaps";

export class MapViewModelBinder {
    constructor(
        private readonly styleCompiler: StyleCompiler,
        private readonly settingsProvider: ISettingsProvider,
        private readonly mediaPermalinkResolver: IPermalinkResolver,
        private readonly siteService: ISiteService
    ) { }

    public stateToInstance(state: WidgetState, componentInstance: MapViewModel): void {
        componentInstance.runtimeConfig(state.runtimeConfig);
        componentInstance.styles(state.styles);
        componentInstance.hasApiKey(state.hasApiKey);
    }

    public async modelToState(model: MapModel, state: WidgetState): Promise<void> {
        let googleMapsSettings = await this.settingsProvider.getSetting<GoogleMapsSettings>(googleMapsSettingsPath);

        if (!googleMapsSettings) {
            googleMapsSettings = await this.siteService.getSetting<any>(googleMapsSettingsPath);
        }

        const apiKey = googleMapsSettings?.apiKey;
        state.hasApiKey = !!apiKey;

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

        state.runtimeConfig = JSON.stringify({
            apiKey: apiKey,
            caption: model.caption,
            location: location,
            zoom: model.zoom,
            mapType: model.mapType,
            markerIcon: markerIconUrl,
            markerPopupKey: model.marker?.popupKey,
            customizations: model.customizations
        });

        if (model.styles) {
            state.styles = await this.styleCompiler.getStyleModelAsync(model.styles);
        }
    }
}
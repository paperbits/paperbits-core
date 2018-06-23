import { IWidgetOrder } from '@paperbits/common/editing';
import { IContentDropHandler } from '@paperbits/common/editing';
import { IContentDescriptor } from '@paperbits/common/editing';
import { IDataTransfer } from '@paperbits/common/editing';
import { IWidgetHandler } from '@paperbits/common/editing';
import { ISettingsProvider } from '@paperbits/common/configuration';
import { MapModelBinder } from './mapModelBinder';
import { MapContract } from './mapContract';
//import * as GoogleMapsLoader from "google-maps";

export class MapHandlers implements IWidgetHandler, IContentDropHandler {
    private readonly settingsProvider: ISettingsProvider;
    private readonly mapModelBinder: MapModelBinder;

    constructor(settingsProvider: ISettingsProvider, mapModelBinder: MapModelBinder) {
        this.settingsProvider = settingsProvider;
        this.mapModelBinder = mapModelBinder;
    }

    private async prepareWidgetOrder(config: MapContract): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "map",
            displayName: "Map",
            iconClass: "paperbits-m-location",
            requires: ["scripts"],
            createModel: async () => {
                return await this.mapModelBinder.nodeToModel(config);
            }
        }

        return widgetOrder;
    }

    private async  getWidgetOrderByConfig(location: string, caption: string): Promise<IWidgetOrder> {
        const config: MapContract = {
            object: "block",
            type: "map",
            location: location,
            caption: caption
        }
        return await this.prepareWidgetOrder(config);
    }

    public getWidgetOrder(): Promise<IWidgetOrder> {
        return Promise.resolve(this.getWidgetOrderByConfig("400 Broad St, Seattle, WA 98109", "Space Needle"));
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        const mapConfig = this.parseDataTransfer(dataTransfer);

        if (!mapConfig) {
            return null;
        }

        const getThumbnailPromise = () => Promise.resolve(`https://maps.googleapis.com/maps/api/staticmap?center=${mapConfig.location}&format=jpg&size=130x90`);

        const descriptor: IContentDescriptor = {
            title: "Map",
            description: mapConfig.location,
            getWidgetOrder: () => Promise.resolve(this.getWidgetOrderByConfig(mapConfig.location, mapConfig.caption)),
            getThumbnailUrl: getThumbnailPromise
        };

        return descriptor;
    }

    private parseDataTransfer(dataTransfer: IDataTransfer): MapContract {
        const source = dataTransfer.source;

        if (source && typeof source === "string") {
            const url = source.toLowerCase();

            if (url.startsWith("https://www.google.com/maps/") || url.startsWith("http://www.google.com/maps/")) {
                var location: string;
                var match = new RegExp("/place/([^/]+)").exec(url);

                if (match && match.length > 1) {
                    location = match[1].replaceAll("+", " ");
                }
                else {
                    match = new RegExp("/@([^/]+)").exec(url);
                    if (match && match.length > 1) {
                        var locationParts = match[1].split(",");
                        location = locationParts.slice(0, 2).join(",");
                    }
                }

                return location ? { location: location, object: "map" } : null;
            }
        }

        return null;
    }
}
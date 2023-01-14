import { MapModel } from "./mapModel";
import { IContentDescriptor, IDataTransfer, IWidgetHandler } from "@paperbits/common/editing";
import { MapContract } from "./mapContract";


export class MapHandlers implements IWidgetHandler /*, IContentDropHandler */ {
    public name: string = "map";
    public displayName: string = "Map";

    public async getWidgetModel(): Promise<MapModel> {
        const model = new MapModel();
        model.mapType = "map";
        model.location = { address: "400 Broad St, Seattle, WA 98109", lat: 47.6203953, lng: -122.3493709 };
        model.caption = "Space Needle";
        model.mapType = "terrain";

        return model;
    }

    public getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor {
        const mapConfig = this.parseDataTransfer(dataTransfer);

        if (!mapConfig) {
            return null;
        }

        const getThumbnailPromise = () => Promise.resolve(`https://maps.googleapis.com/maps/api/staticmap?center=${mapConfig.location}&format=jpg&size=130x90`);

        const descriptor: IContentDescriptor = {
            title: "Map",
            description: mapConfig.location.toString(),
            getThumbnailUrl: getThumbnailPromise
        };

        return descriptor;
    }

    private parseDataTransfer(dataTransfer: IDataTransfer): MapContract {
        const source = dataTransfer.source;

        if (source && typeof source === "string") {
            const url = source.toLowerCase();

            if (url.startsWith("https://www.google.com/maps/") || url.startsWith("http://www.google.com/maps/")) {
                let location: string;
                let match = new RegExp("/place/([^/]+)").exec(url);

                if (match && match.length > 1) {
                    location = match[1].replaceAll("+", " ");
                }
                else {
                    match = new RegExp("/@([^/]+)").exec(url);
                    if (match && match.length > 1) {
                        const locationParts = match[1].split(",");
                        location = locationParts.slice(0, 2).join(",");
                    }
                }

                return location ? { location: location.toString(), type: "map" } : null;
            }
        }

        return null;
    }
}
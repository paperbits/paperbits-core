import { MapModel } from "./mapModel";
import { MapContract } from "./mapContract";
import { IModelBinder } from "@paperbits/common/editing";

export class MapModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "map";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof MapModel;
    }

    public async nodeToModel(mapNode: MapContract): Promise<MapModel> {
        let model = new MapModel();
        model.caption = mapNode.caption;
        model.layout = mapNode.layout;
        model.location = mapNode.location;
        model.zoomControl = mapNode.zoomControl;

        return model;
    }

    public getConfig(mapModel: MapModel): MapContract {
        let mapConfig: MapContract = {
            object: "block",
            type: "map",
            caption: mapModel.caption,
            layout: mapModel.layout,
            location: mapModel.location,
            zoomControl: mapModel.zoomControl
        }

        return mapConfig;
    }
}
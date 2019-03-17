import { MapModel } from "./mapModel";
import { MapContract } from "./mapContract";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common";

export class MapModelBinder implements IModelBinder {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "map";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof MapModel;
    }

    public async contractToModel(mapNode: MapContract): Promise<MapModel> {
        const model = new MapModel();
        model.caption = mapNode.caption;
        model.layout = mapNode.layout;
        model.location = mapNode.location;
        model.zoomControl = mapNode.zoomControl;

        return model;
    }

    public modelToContract(model: MapModel): MapContract {
        const contract: MapContract = {
            type: "map",
            caption: model.caption,
            layout: model.layout,
            location: model.location,
            zoomControl: model.zoomControl
        };

        return contract;
    }
}
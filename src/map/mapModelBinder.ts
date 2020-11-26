import { MapModel } from "./mapModel";
import { MapContract } from "./mapContract";
import { IModelBinder } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common";

export class MapModelBinder implements IModelBinder<MapModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "map";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof MapModel;
    }

    public async contractToModel(contract: MapContract): Promise<MapModel> {
        const model = new MapModel();
        model.location = contract.location;
        model.caption = contract.caption;
        model.zoom = contract.zoom;
        model.mapType = contract.mapType;
        model.styles = contract.styles; // || { appearance: "components/map/default" };

        return model;
    }

    public modelToContract(model: MapModel): MapContract {
        const contract: MapContract = {
            type: "map",
            caption: model.caption,
            location: model.location,
            zoom: model.zoom,
            mapType: model.mapType,
            styles: model.styles
        };

        return contract;
    }
}
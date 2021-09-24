import { MapModel, MarkerModel } from "./mapModel";
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
        model.styles = contract.styles;
        model.customizations = contract.customizations;

        if (contract.marker) {
            const markerModel = new MarkerModel();
            markerModel.sourceKey = contract.marker.sourceKey;
            markerModel.width = contract.marker.width;
            markerModel.height = contract.marker.height;
            markerModel.popupKey = contract.marker.popupKey;
            model.marker = markerModel;
        }

        return model;
    }

    public modelToContract(model: MapModel): MapContract {
        const contract: MapContract = {
            type: "map",
            caption: model.caption,
            location: model.location,
            zoom: model.zoom,
            mapType: model.mapType,
            styles: model.styles,
            customizations: model.customizations
        };

        if (model.marker) {
            contract.marker = {
                sourceKey: model.marker.sourceKey,
                width: model.marker.width,
                height: model.marker.height,
                popupKey: model.marker.popupKey
            };
        }

        return contract;
    }
}
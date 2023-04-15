import { CarouselContract, CarouselItemContract } from "./carouselContract";
import { CarouselItemModel, CarouselModel } from "./carouselModel";
import { ContainerModelBinder, IModelBinder } from "@paperbits/common/editing";
import { ModelBinderSelector } from "@paperbits/common/widgets";
import { Contract, Bag } from "@paperbits/common";


export class CarouselModelBinder implements IModelBinder<CarouselModel> {
    public canHandleContract(contract: Contract): boolean {
        return contract.type === "carousel";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof CarouselModel;
    }

    constructor(private readonly containerModelBinder: ContainerModelBinder) { }

    public async contractItemToModel(contract: CarouselItemContract, bindingContext?: Bag<any>): Promise<CarouselItemModel> {
        const model = new CarouselItemModel();

        contract.nodes = contract.nodes || [];
        model.styles = contract.styles || {};
        model.widgets = await this.containerModelBinder.getChildModels(contract.nodes, bindingContext);

        return model;
    }

    public async contractToModel(contract: CarouselContract, bindingContext?: Bag<any>): Promise<CarouselModel> {
        const model = new CarouselModel();

        contract.carouselItems = contract.carouselItems || [];
        model.styles = contract.styles || {};
        model.autoplay = contract.autoplay;
        model.pauseOnHover = contract.pauseOnHover;
        model.autoplayInterval = contract.autoplayInterval || 5000;
        model.showControls = contract.showControls;
        model.showIndicators = contract.showIndicators;

        const modelPromises = contract.carouselItems.map(async (contract: Contract) => {
            return await this.contractItemToModel(contract, bindingContext);
        });

        model.carouselItems = await Promise.all<any>(modelPromises);

        return model;
    }

    public itemModelToContract(carouselItemModel: CarouselItemModel): CarouselItemContract {
        const carouselContract: CarouselItemContract = {
            type: "carousel-item",
            styles: carouselItemModel.styles,
            nodes: []
        };

        const childNodes = this.containerModelBinder.getChildContracts(carouselItemModel.widgets);
        carouselContract.nodes.push(...childNodes);

        return carouselContract;
    }

    public modelToContract(carouselModel: CarouselModel): CarouselContract {
        const carouselContract: CarouselContract = {
            type: "carousel",
            styles: carouselModel.styles,
            carouselItems: [],
            autoplay: carouselModel.autoplay,
            pauseOnHover: carouselModel.pauseOnHover,
            autoplayInterval: carouselModel.autoplayInterval,
            showControls: carouselModel.showControls,
            showIndicators: carouselModel.showIndicators
        };

        carouselModel.carouselItems.forEach(carouselItemModel => {
            carouselContract.carouselItems.push(this.itemModelToContract(carouselItemModel));
        });

        return carouselContract;
    }
}

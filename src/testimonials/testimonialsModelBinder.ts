import { IModelBinder } from "@paperbits/common/editing/IModelBinder";
import { Contract } from "@paperbits/common/contract";
import { TestimonialsModel, TestimonialsContract } from ".";

export class TestimonialsModelBinder implements IModelBinder<TestimonialsModel> {
    constructor() {
        this.contractToModel = this.contractToModel.bind(this);
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "testimonials";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TestimonialsModel;
    }

    public async contractToModel(contract: TestimonialsContract): Promise<TestimonialsModel> {
        const model = new TestimonialsModel();
        model.textContent = contract.textContent;
        model.allStarsCount  = contract.allStarsCount || 0;
        model.starsCount  = contract.starsCount || 0;
        model.author      = contract.author;
        model.authorTitle = contract.authorTitle;
        return model;
    }

    public modelToContract(model: TestimonialsModel): Contract {
        const contract: TestimonialsContract = {
            type: "testimonials",
            textContent : model.textContent,
            starsCount : model.starsCount, 
            allStarsCount : model.allStarsCount, 
            author : model.author,     
            authorTitle : model.authorTitle
        };

        return contract;
    }
}

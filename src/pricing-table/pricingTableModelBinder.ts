import { PricingTableModel } from "./pricingTableModel";
import { PricingTableContract } from "./pricingTableContract";
import { IModelBinder } from "@paperbits/common/editing";

export class PricingTableModelBinder implements IModelBinder {
    public canHandleWidgetType(pricingTableType: string): boolean {
        return pricingTableType === "pricingTable";
    }

    public canHandleModel(model): boolean {
        return model instanceof PricingTableModel;
    }

    public async contractToModel(pricingTableContract: PricingTableContract): Promise<PricingTableModel> {
        return new PricingTableModel();
    }

    public modelToContract(pricingTableModel: PricingTableModel): PricingTableContract {
        const pricingTableContract: PricingTableContract = {
            object: "block",
            type: "pricingTable",
        };

        return pricingTableContract;
    }
}
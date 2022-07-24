import * as Utils from "@paperbits/common/utils";
import { ContentModel } from "./contentModel";
import { Contract, Bag } from "@paperbits/common";
import { IModelBinder } from "@paperbits/common/editing";
import { WidgetModel, ModelBinderSelector, IWidgetService } from "@paperbits/common/widgets";
import { SectionModel } from "@paperbits/core/section";
import { GridModel } from "../grid-layout-section";
import { GridCellModel } from "../grid-cell/gridCellModel";


const typeName = "page";

export class ContentModelBinder<TModel> implements IModelBinder<TModel> {
    constructor(protected readonly widgetService: IWidgetService, protected readonly modelBinderSelector: ModelBinderSelector) { }

    public async getChildModels(nodes: Contract[], bindingContext: any): Promise<any[]> {
        const modelPromises = nodes.map((contract: Contract) => {
            let modelBinder = this.widgetService.getModelBinder(contract.type);

            if (!modelBinder) {
                modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
            }

            return modelBinder.contractToModel(contract, bindingContext);
        });

        return await Promise.all<any>(modelPromises);
    }

    public getChildContracts(models: WidgetModel[]): Contract[] {
        const nodes = [];

        models.forEach(widgetModel => {
            let modelBinder = this.widgetService.getModelBinderForModel(widgetModel);

            if (!modelBinder) {
                modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            }

            nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return nodes;
    }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === typeName;
    }

    public canHandleModel(model: WidgetModel): boolean {
        return model instanceof ContentModel;
    }

    public async contractToModel(contentContract: Contract, bindingContext?: Bag<any>): Promise<TModel> {
        const contentModel = new ContentModel();
        contentModel.type = contentContract.type;

        const templateValue = bindingContext?.template?.[contentContract.type]?.value;

        if (templateValue) {
            contentContract = templateValue;
        }

        if (contentContract.nodes) {
            contentModel.widgets = await this.getChildModels(contentContract.nodes, bindingContext);
            this.amendLayout(contentModel.widgets);
        }

        return <any>contentModel;
    }

    public modelToContract(model: TModel): Contract {
        const contract: Contract = {
            type: typeName
        };

        return contract;
    }

    /**
     * Amends legacy template layout when child Content element is direct child of the Content.
     */
    private amendLayout(widgets: WidgetModel[]): void {
        const index = widgets.findIndex(x => x instanceof ContentModel)

        if (index < 0) {
            return;
        }

        const contentModel = widgets[index];

        const gridCell = new GridCellModel();
        gridCell.role = "main";
        gridCell.widgets.push(contentModel);
        gridCell.styles.instance = {
            key: Utils.randomClassName(),
            "grid-cell": {
                alignment: {
                    horizontal: "center",
                    vertical: "top"
                },
                position: {
                    col: 1,
                    row: 1
                },
                span: {
                    cols: 1,
                    rows: 1
                }
            },
            padding: {
                bottom: 0,
                left: 0,
                right: 0,
                top: 0
            }
        };

        const grid = new GridModel();
        grid.styles.instance = {
            key: Utils.randomClassName(),
            margin: {
                top: 0,
                bottom: 0,
                left: "auto",
                right: "auto"
            },
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            grid: {
                rows: ["auto"],
                cols: ["1fr"]
            }
        };

        grid.widgets.push(gridCell);

        const section = new SectionModel();
        section.widgets.push(grid);
        section.styles.instance = {
            key: Utils.randomClassName(),
            size: {
                stretch: true
            }
        }

        widgets[index] = section;
    }
}

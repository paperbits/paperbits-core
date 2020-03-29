import { Contract, Bag } from "@paperbits/common";
import { IPermalinkResolver, HyperlinkModel } from "@paperbits/common/permalinks";
import { StyleCompiler } from "@paperbits/common/styles";
import { InlineModel, MarkModel, ColorModel } from "@paperbits/common/text/models";
import { InlineContract, MarkContract } from "../contracts";


export class InlineModelBinder {
    constructor(
        private readonly styleCompiler: StyleCompiler,
        private readonly permalinkResolver: IPermalinkResolver
    ) { }

    public canHandleContract(contract: Contract): boolean {
        return contract.type === "text";
    }

    public canHandleModel(model: InlineModel): boolean {
        return model.type === "text"; // TODO: Replace with instanceOf
    }

    public async contractToModel(contract: InlineContract, bindingContent?: Bag<any>): Promise<InlineModel> {
        const model = new InlineModel();
        model.text = contract.text;

        if (contract.marks && contract.marks.length > 0) {
            const modelPromises = contract.marks.map(async (mark) => {
                const markModel = new MarkModel(mark.type);

                switch (mark.type) {
                    case "hyperlink":
                        const targetKey = mark.attrs["targetKey"];

                        if (targetKey) {
                            const hyperlink = await this.permalinkResolver.getHyperlinkByTargetKey(targetKey, bindingContent?.locale);
                            markModel.attrs = hyperlink;
                            const anchor = mark?.attrs["anchor"];

                            if (anchor) {
                                markModel.attrs.anchor = anchor;
                                markModel.attrs.anchorName = mark.attrs["anchorName"];
                            }
                        }
                        markModel.attrs["target"] = mark.attrs["target"];
                        break;

                    case "color":
                        const contract = <ColorModel>mark.attrs;

                        if (contract && contract.colorKey) {
                            // TODO: check is it required async resolution
                            const colorClass = this.styleCompiler.getClassNameByColorKey(contract.colorKey);

                            markModel.attrs = {
                                colorKey: contract.colorKey,
                                colorClass: colorClass
                            };
                        }
                        break;
                }

                return markModel;
            });

            model.marks = await Promise.all<any>(modelPromises);
        }

        return model;
    }

    public modelToContract(inlineModel: InlineModel): Contract {
        const textContract: InlineContract = {
            type: "text",
            text: inlineModel.text
        };

        if (inlineModel.marks && inlineModel.marks.length > 0) {
            textContract.marks = inlineModel.marks.map(mark => {
                const contract = <MarkContract>{ type: mark.type };

                if (mark.type === "hyperlink") {
                    const model = <HyperlinkModel>mark.attrs;

                    contract.attrs = {
                        anchor: model.anchor,
                        anchorName: model.anchorName,
                        target: model.target,
                        targetKey: model.targetKey
                    };
                }
                else {
                    if (mark.type === "color") {
                        const model = <ColorModel>mark.attrs;

                        if (model && model.colorKey) {
                            contract.attrs = {
                                colorKey: model.colorKey
                            };
                        }
                    }
                }
                return contract;
            });
        }
        return textContract;
    }
}

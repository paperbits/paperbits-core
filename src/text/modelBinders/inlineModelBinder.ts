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
            const modelPromises = contract.marks.map(async (markContract: MarkContract) => {
                const markModel = new MarkModel(markContract.type);

                switch (markContract.type) {
                    case "hyperlink":
                        const target: string = markContract.attrs?.target;
                        const targetKey: string = markContract.attrs?.targetKey;
                        const anchor: string = markContract.attrs?.anchor;
                        const anchorName: string = markContract.attrs?.anchorName;
                        const download: string = targetKey?.startsWith("uploads/") ? "" : undefined;
                        const triggerEvent: string = markContract.attrs?.triggerEvent;

                        const href = targetKey
                            ? await this.permalinkResolver.getUrlByTargetKey(targetKey, bindingContent?.locale)
                            : null;

                        markModel.attrs = <HyperlinkModel>{
                            href: href || "#",
                            target: target,
                            targetKey: targetKey,
                            anchor: anchor,
                            anchorName: anchorName,
                            download: download,
                            triggerEvent: triggerEvent
                        };
                        break;

                    case "color":
                        const colorModel = <ColorModel>markContract.attrs;

                        if (colorModel?.colorKey) {
                            // TODO: check is it required async resolution
                            const colorClass = this.styleCompiler.getClassNameByColorKey(colorModel.colorKey);

                            markModel.attrs = {
                                colorKey: colorModel.colorKey,
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
            textContract.marks = inlineModel.marks.map(markModel => {
                const contract = <MarkContract>{ type: markModel.type };

                if (markModel.type === "hyperlink") {
                    const model = <HyperlinkModel>markModel.attrs;

                    contract.attrs = {
                        anchor: model.anchor,
                        anchorName: model.anchorName,
                        target: model.target,
                        targetKey: model.targetKey,
                        triggerEvent: model.triggerEvent
                    };
                }
                else {
                    if (markModel.type === "color") {
                        const model = <ColorModel>markModel.attrs;

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

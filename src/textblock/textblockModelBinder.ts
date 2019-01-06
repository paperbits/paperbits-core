import { PermalinkResolver } from "@paperbits/common/permalinks";
import { IModelBinder, HyperlinkContract } from "@paperbits/common/editing";
import { Contract } from "@paperbits/common";
import { TextblockModel } from "./textblockModel";


export class TextblockModelBinder implements IModelBinder {
    constructor(private readonly permalinkResolver: PermalinkResolver) { }

    private async resolveHyperlinks(nodes: Contract[]): Promise<void> {
        for (const node of nodes) {
            if (node && node.type === "hyperlink") {
                const hyperlink: HyperlinkContract = <HyperlinkContract>node;

                if (hyperlink.attrs.contentTypeKey) {
                    const url = await this.permalinkResolver.getUrlByTargetKey(hyperlink.attrs.contentTypeKey);

                    if (url) {
                        hyperlink.attrs.href = url;
                    }
                    else {
                        console.warn(`Broken permalink: ${hyperlink.attrs.contentTypeKey}.`);
                    }
                }
            }

            if (node && node.content) {
                await this.resolveHyperlinks(node.content);
            }

            if (node && node.nodes) {
                await this.resolveHyperlinks(node.nodes);
            }

            if (node && node.marks) {
                await this.resolveHyperlinks(node.marks);
            }
        }
    }

    private async resolveAnchors(nodes: Contract[]) { // Should be BlockContract
        // for (const node of nodes) {
        //     if (node && node["anchorKey"]) {
        //         const anchorKey = node["anchorKey"];
        //         const anchorPermalink = await this.permalinkService.getPermalinkByKey(anchorKey);

        //         if (anchorPermalink) {
        //             node["anchorHash"] = anchorPermalink.uri;
        //         }
        //         else {
        //             // TODO: Show permalink is broken somehow
        //             console.warn(`Broken anchor permalink: ${anchorKey}.`);
        //         }
        //     }

        //     if (node && node.nodes) {
        //         await this.resolveAnchors(node.nodes);
        //     }
        // }
    }

    public async contractToModel(node: Contract): Promise<TextblockModel> {
        this.convertNode(node);


        if (node.nodes) {
            await this.resolveHyperlinks(node.nodes);
        }

        if (node.content) {
            await this.resolveHyperlinks(node.content);
        }

        if (node.leaves) {
            await this.resolveHyperlinks(node.leaves);
        }

        if (node.nodes) {
            await this.resolveAnchors(node.nodes);
        }

        return new TextblockModel(node.content);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "text";
    }

    public canHandleModel(model): boolean {
        return model instanceof TextblockModel;
    }

    public modelToContract(model: TextblockModel): Contract {
        let state;

        if (model.htmlEditor) {
            state = model.htmlEditor.getState();
            model.state = state;
        }
        else {
            state = model.state;
        }

        const textblockConfig: Contract = {
            object: "widget",
            type: "text",
            nodes: state
        };

        return textblockConfig;
    }

    private convertNode(parentNode): any {
        if (parentNode.leaves) {
            for (const node of parentNode.leaves) {
                this.convertNode(node);
            }

            parentNode.content = parentNode.leaves;
            delete parentNode.leaves;
        }

        if (parentNode.nodes) {
            for (const node of parentNode.nodes) {
                this.convertNode(node);
            }

            parentNode.content = parentNode.nodes;
            delete parentNode.nodes;
        }

        if (parentNode["type"] === "heading-one") {
            parentNode["type"] = "heading1";
        }

        if (parentNode["type"] === "heading-two") {
            parentNode["type"] = "heading2";
        }

        if (parentNode["type"] === "heading-three") {
            parentNode["type"] = "heading3";
        }

        if (parentNode["type"] === "list-item") {
            parentNode["type"] = "list_item";
        }

        if (parentNode["type"] === "bulleted-list") {
            parentNode["type"] = "bulleted_list";
        }

        if (parentNode["type"] === "hyperlink") {
            parentNode["type"] = "link";
        }

        if (parentNode["type"] === "line-break") {
            parentNode["type"] = "linebreak";
        }

        if (parentNode["object"] && parentNode["object"] === "leaf") {
            parentNode["type"] = "text";
            delete parentNode["object"];
        }
    }
}
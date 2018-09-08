import { IModelBinder, HyperlinkContract } from "@paperbits/common/editing";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { Contract } from "@paperbits/common";
import { TextblockModel } from "./textblockModel";

export class TextblockModelBinder implements IModelBinder {
    private readonly permalinkService: IPermalinkService;

    constructor(permalinkService: IPermalinkService) {
        this.permalinkService = permalinkService;
    }

    private async resolveHyperlinks(leaves: Contract[]): Promise<void> {
        for (let i = 0; i < leaves.length; i++) {
            const node = leaves[i];

            if (node && node.type === "link") {
                const hyperlink: HyperlinkContract = <HyperlinkContract>node;

                if (hyperlink.permalinkKey) {
                    const permalink = await this.permalinkService.getPermalinkByKey(hyperlink.permalinkKey);
                    
                    if (permalink) {
                        hyperlink.href = permalink.uri;

                        if (permalink.parentKey) {
                            const parentPermalink = await this.permalinkService.getPermalinkByKey(permalink.parentKey);

                            if (parentPermalink) {
                                // TODO: Probably we should use separate property of permalink instead of URI, i.e. "hash".
                                hyperlink.href = `${parentPermalink.uri}#${hyperlink.href}`;
                            }
                            else {
                                // TODO: Show permalink is broken somehow
                                console.warn(`Broken parent permalink: ${permalink.parentKey}.`);
                            }
                        }
                    }
                    else {
                        // TODO: Show permalink is broken somehow
                        console.warn(`Broken permalink: ${hyperlink.permalinkKey}.`);
                    }
                }
            }

            if (node && node.leaves) {
                await this.resolveHyperlinks(node.leaves);
            }
            
            if (node && node.nodes) {
                await this.resolveHyperlinks(node.nodes);
            }
        }
    }

    private async resolveAnchors(nodes: Contract[]) { // Should be BlockContract
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];

            if (node && node["anchorKey"]) {
                const anchorKey = node["anchorKey"];
                const anchorPermalink = await this.permalinkService.getPermalinkByKey(anchorKey);

                if (anchorPermalink) {
                    node["anchorHash"] = anchorPermalink.uri;
                }
                else {
                    // TODO: Show permalink is broken somehow
                    console.warn(`Broken anchor permalink: ${anchorKey}.`);
                }
            }

            if (node && node.nodes) {
                await this.resolveAnchors(node.nodes);
            }
        }
    }

    public async contractToModel(node: Contract): Promise<TextblockModel> {
        // TODO: Scan for unresolved hyperlink permalinks (this is compensation of Slate not being able to do async work)

        if (node.nodes) {
            await this.resolveHyperlinks(node.nodes);
        }

        if (node.leaves) {
            await this.resolveHyperlinks(node.leaves);
        }

        if (node.nodes) {
            await this.resolveAnchors(node.nodes);
        }

        return new TextblockModel({ "nodes": node.nodes });
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

        let textblockConfig: Contract = {
            object: "widget",
            type: "text",
            nodes: state["nodes"]
        }

        return textblockConfig;
    }
}
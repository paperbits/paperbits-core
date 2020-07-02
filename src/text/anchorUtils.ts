import { BlockContract } from "../text/contracts";
import { Contract } from "@paperbits/common";


export class AnchorUtils {
    private static findNodesRecursively(source: object, searchPredicate: (x: object) => boolean, filterPredicate: (x: object) => boolean): BlockContract[] {
        const result = [];

        if (searchPredicate(source)) {
            result.push(source);
        }

        const keys = Object.keys(source); // This includes array keys

        keys.forEach(key => {
            const child = source[key];

            if (child instanceof Object && filterPredicate(child)) {
                const childResult = this.findNodesRecursively(child, searchPredicate, filterPredicate);
                result.push.apply(result, childResult);
            }
        });

        return result;
    }

    public static getHeadingNodes(pageContent: Contract, minHeading: number = 1, maxHeading: number = 1): BlockContract[] {
        if (!pageContent) {
            throw new Error(`Parameter "pageContent" not specified.`);
        }

        const children = AnchorUtils.findNodesRecursively(pageContent,
            node => node["type"] && node["type"].startsWith("heading"),
            (node) => {
                if (node instanceof Array) {
                    return true;
                }

                if (!node["type"]) {
                    return false;
                }

                const nodeType: string = node["type"];

                if (nodeType.startsWith("heading")) {
                    const headingLevel = parseInt(nodeType.slice(-1));

                    if (headingLevel >= minHeading && headingLevel <= maxHeading) {
                        return true;
                    }
                }
                else if (["layout-section", "layout-row", "layout-column", "text-block", "grid", "grid-cell"].includes(nodeType)) {
                    return true;
                }

                return false;
            }
        );

        return children.filter(item => item.identifier || item.attrs?.id || item.attrs?.key);
    }
}
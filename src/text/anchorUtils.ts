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

    public static getHeadingNodes(pageContent: Contract, maxHeading?: number): BlockContract[] {
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

                if (nodeType === "layout-section" || nodeType === "layout-row" || nodeType === "layout-column" || nodeType === "text-block" ||
                    (nodeType.startsWith("heading") && (!maxHeading || maxHeading >= +nodeType.slice(-1)))) {
                    return true;
                }

                return false;
            }
        );

        return children.filter(item => item.attrs && item.attrs.id);
    }
}
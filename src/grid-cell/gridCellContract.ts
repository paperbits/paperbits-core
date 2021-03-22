import { Contract, Breakpoints } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

// export interface GridCellContract extends Contract {
//     size?: Breakpoints;
//     alignment?: Breakpoints;
//     offset?: Breakpoints;
//     overflowX?: string;
//     overflowY?: string;
// }

export interface GridCellSpan {
    /**
     * Column span is useful when only on horizontal position (left or right) specified.
     */
    colSpan?: number;

    /**
     * Row span is useful when only on vertical position (top or bottom) specified.
     */
    rowSpan?: number;
}

export interface GridCellPosition {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}

export interface GridCellContract extends Contract {
    /**
     * @examples ["article", "header", "aside", "content", "footer"]
     */
    role: string;
    position?: Breakpoints<GridCellPosition>;
    span?: Breakpoints<GridCellSpan>;
    alignment?: any;
    nodes?: any[];
    styles?: LocalStyles;
}
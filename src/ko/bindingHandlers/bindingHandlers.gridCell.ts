import * as ko from "knockout";
import { GridCellModel } from "../../grid-cell";
import { GridCellViewModel } from "../../grid-cell/ko";
import { GridHelper } from "@paperbits/common/editing";


function snapToGrid(element: HTMLElement): void {
    const gridBinding = <any>GridHelper.getParentWidgetBinding(element);
    const cellBinding = <any>GridHelper.getWidgetBinding(element);

    const gridRect = element.parentElement.getBoundingClientRect();
    const colSizes = gridBinding.model.styles.instance.grid.cols.map(colSizeInPercent => gridRect.width * parseInt(colSizeInPercent.replace("%", "")) / 100);
    const rowSizes = gridBinding.model.styles.instance.grid.rows.map(rowSizeInPercent => gridRect.height * parseInt(rowSizeInPercent.replace("%", "")) / 100);

    const cellRect = element.getBoundingClientRect();
    const colEdges = [0];
    const rowEdges = [0];

    let previousColEdge = 0;
    for (const colSize of colSizes) {
        previousColEdge = previousColEdge + colSize;
        colEdges.push(previousColEdge);
    }

    let previousRowEdge = 0;
    for (const rowSize of rowSizes) {
        previousRowEdge = previousRowEdge + rowSize;
        rowEdges.push(previousRowEdge);
    }

    const leftX = cellRect.left - gridRect.left;
    const rightX = cellRect.right - gridRect.left;
    const topY = cellRect.top - gridRect.top;
    const bottomY = cellRect.bottom - gridRect.top;

    let leftEdgeColumnIndex = colEdges.findIndex(edge => edge > leftX);
    let rightEdgeColumnIndex = colEdges.findIndex(edge => edge > rightX);

    if (leftX > ((colEdges[leftEdgeColumnIndex - 1] + colEdges[leftEdgeColumnIndex]) / 2)) {
        leftEdgeColumnIndex++;
    }

    if (rightX > ((colEdges[rightEdgeColumnIndex - 1] + colEdges[rightEdgeColumnIndex]) / 2)) {
        rightEdgeColumnIndex++;
    }

    const colSpan = rightEdgeColumnIndex - leftEdgeColumnIndex;

    let topEdgeRowIndex = rowEdges.findIndex(edge => edge > topY);
    let bottomEdgeRowIndex = rowEdges.findIndex(edge => edge > bottomY);

    if (topY > ((rowEdges[topEdgeRowIndex - 1] + rowEdges[topEdgeRowIndex]) / 2)) {
        topEdgeRowIndex++;
    }

    if (bottomY > ((rowEdges[bottomEdgeRowIndex - 1] + rowEdges[bottomEdgeRowIndex]) / 2)) {
        bottomEdgeRowIndex++;
    }

    const rowSpan = bottomEdgeRowIndex - topEdgeRowIndex;

    const cell = cellBinding.model.styles.instance["grid-cell"].md;
    cell.position.col = leftEdgeColumnIndex;
    cell.position.row = topEdgeRowIndex;
    cell.span.cols = colSpan;
    cell.span.rows = rowSpan;

    cellBinding.applyChanges(cellBinding.model);

    element.removeAttribute("style");
}


ko.bindingHandlers["gridCellEditor"] = {
    init: (element: HTMLElement, valueAccessor) => {
        const config = ko.unwrap(valueAccessor());

        ko.applyBindingsToNode(element, {
            dragsource: {
                inertia: false,
                sticky: true,
                ondragstart: (sourceData: any, dragged: HTMLElement) => {
                    const elementRect = element.getBoundingClientRect();
                    element.style.width = elementRect.width + "px";
                    element.style.height = elementRect.height + "px";
                    dragged.style.position = "fixed";
                },
                ondragend: (): void => {
                    snapToGrid(element);
                }
            },
            resizable: {
                directions: "vertically horizontally", onresize: () => {
                    snapToGrid(element);
                }
            }
        }, null);
    }
};

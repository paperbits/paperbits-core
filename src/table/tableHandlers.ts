import { IWidgetOrder, IWidgetHandler } from "@paperbits/common/editing";
import { TableCellModel } from "../table-cell";
import { TableModel } from "./tableModel";


export class TableHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "table",
            displayName: "Table",
            iconClass: "widget-icon widget-icon-table",
            requires: [],
            createModel: async () => {
                const table = new TableModel();
                table.numOfRows = 1;
                table.numOfCols = 3;
                table.styles = {
                    instance: {
                        grid: {
                            xs: {
                                rows: [
                                    "auto"
                                ],
                                cols: [
                                    "minmax(100px, 1fr)",
                                    "minmax(100px, 1fr)",
                                    "minmax(100px, 1fr)"
                                ]
                            }
                        }
                    }
                };


                const cell1 = new TableCellModel();
                cell1.role = "Cell";
                cell1.styles = {
                    instance: {
                        "grid-cell": {
                            position: {
                                col: 1,
                                row: 1
                            },
                            span: {
                                cols: 1,
                                rows: 1
                            }
                        },
                        "border": {
                            bottom: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            left: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            right: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            top: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            }
                        },
                        "container": {
                            overflow: "scroll"
                        }
                    }
                };

                const cell2 = new TableCellModel();
                cell2.role = "Cell";
                cell2.styles = {
                    instance: {
                        "grid-cell": {
                            position: {
                                col: 2,
                                row: 1
                            },
                            span: {
                                cols: 1,
                                rows: 1
                            }
                        },
                        "border": {
                            bottom: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            left: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            right: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            top: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            }
                        },
                        "container": {
                            overflow: "scroll"
                        }
                    }
                };

                const cell3 = new TableCellModel();
                cell3.role = "Cell";
                cell3.styles = {
                    instance: {
                        "grid-cell": {
                            position: {
                                col: 3,
                                row: 1
                            },
                            span: {
                                cols: 1,
                                rows: 1
                            }
                        },
                        "border": {
                            bottom: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            left: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            right: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            },
                            top: {
                                colorKey: "colors/default",
                                style: "solid",
                                width: "1"
                            }
                        },
                        "container": {
                            overflow: "scroll"
                        }
                    }
                };

                table.widgets.push(cell1);
                table.widgets.push(cell2);
                table.widgets.push(cell3);

                return table;
            }
        };

        return widgetOrder;
    }
}
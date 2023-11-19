import { Breakpoints } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";
import { WidgetModel } from "@paperbits/common/widgets";

export class ContainerModel implements WidgetModel {
    public widgets: WidgetModel[];
    public alignment: Breakpoints;
    public overflowX: string;
    public overflowY: string;
    public styles: LocalStyles;

    constructor() {
        this.widgets = [];
        this.alignment = {};
        this.styles = {
            instance: {
                background: {
                    colorKey: "colors/defaultBg"
                },
                size: {
                    width: 300,
                    height: 200
                },
                container: {
                    alignment: {
                        vertical: "center",
                        horizontal: "center"
                    }
                }
            }
        };
    }
}
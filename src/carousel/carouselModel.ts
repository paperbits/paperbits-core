import { WidgetModel } from "@paperbits/common/widgets";
import { LocalStyles } from "@paperbits/common/styles";

export class CarouselModel {
    public carouselItems: CarouselItemModel[];
    public styles: LocalStyles;

    constructor() {
        this.styles = {};
        this.carouselItems = [];
    }
}

export class CarouselItemModel {
    public widgets: WidgetModel[];
    public styles: LocalStyles;

    constructor() {
        this.styles = {};
        this.widgets = [];
    }
}
import { IWidgetHandler, IWidgetOrder, WidgetContext } from "@paperbits/common/editing";
import { CarouselItemModel, CarouselModel } from "./carouselModel";


export class CarouselHandlers implements IWidgetHandler {
        public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "carousel",
            displayName: "Carousel",
            iconClass: "widget-icon widget-icon-carousel",
            requires: ["js", "interaction"],
            createModel: async () => {
                const model = new CarouselModel();
                model.carouselItems.push(new CarouselItemModel());
                model.carouselItems.push(new CarouselItemModel());
                model.carouselItems.push(new CarouselItemModel());
                model.showControls = true;
                model.showIndicators = true;

                model.styles.instance = {
                    size: {
                        xl: {
                            minHeight: 300
                        },
                        lg: {
                            minHeight: 300
                        },
                        md: {
                            minHeight: 300
                        },
                        sm: {
                            minHeight: 300
                        },
                        xs: {
                            minHeight: 300
                        }
                    }
                };

                return model;
            }
        };

        return widgetOrder;
    }    
}
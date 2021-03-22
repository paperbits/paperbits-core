import { Contract } from "@paperbits/common";
import { LocalStyles } from "@paperbits/common/styles";

export interface CarouselContract {
    type: string;
    styles?: LocalStyles;
    carouselItems: CarouselItemContract[];
    showControls: boolean;
    showIndicators: boolean;
    autoplay: boolean;
    pauseOnHover: boolean;
    autoplayInterval: number;
}

export interface CarouselItemContract extends Contract {
    styles?: LocalStyles;
}
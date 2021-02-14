import { Contract } from "@paperbits/common";

export interface CarouselContract {
    type: string;
    styles?: any;
    carouselItems: CarouselItemContract[];
    showControls: boolean;
    showIndicators: boolean;
    autoplay: boolean;
    pauseOnHover: boolean;
    autoplayInterval: number;
}

export interface CarouselItemContract extends Contract {
    styles?: any;
}
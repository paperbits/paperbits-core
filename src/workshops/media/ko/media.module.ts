import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IViewManager } from "@paperbits/common/ui";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { MediaWorkshop } from "./media";
import { IMediaService } from "@paperbits/common/media";
import { MediaDetailsWorkshop } from "./mediaDetails";
import { IEventManager } from "@paperbits/common/events";
import { MediaSelector } from "./mediaSelector";
import { PictureCropper } from "../../cropper/cropper";

export class MediaWorkshopModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("mediaWorkshop", MediaWorkshop);

        injector.bindComponent("mediaDetailsWorkshop", (ctx: IInjector, params) => {
            const mediaService = ctx.resolve<IMediaService>("mediaService");
            const permalinkService = ctx.resolve<IPermalinkService>("permalinkService");
            const viewManager = ctx.resolve<IViewManager>("viewManager");

            return new MediaDetailsWorkshop(mediaService, permalinkService, viewManager, params);
        });

        injector.bindComponent("mediaSelector", (ctx: IInjector, params: {}) => {
            const eventManager = ctx.resolve<IEventManager>("eventManager");
            const mediaService = ctx.resolve<IMediaService>("mediaService");
            const viewManager = ctx.resolve<IViewManager>("viewManager");
            return new MediaSelector(eventManager, mediaService, viewManager, params["onSelect"], params["mediaFilter"]);
        });

        injector.bindComponent("pictureCropper", (ctx: IInjector, params) => {
            const viewManager = ctx.resolve<IViewManager>("viewManager");
            return new PictureCropper(viewManager, params.src);
        });
    }
}
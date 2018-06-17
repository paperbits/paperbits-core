import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IBlockService } from "@paperbits/common/blocks";
import { BlockSelector } from "./blockSelector";
import { SectionModel } from "../../../section/sectionModel";
import { IViewManager } from "@paperbits/common/ui";
import { SectionModelBinder } from "../../../section/sectionModelBinder";
import { AddBlockDialog } from "./addBlockDialog";

export class BlockWorkshopModule implements IInjectorModule {
    register(injector: IInjector): void {
        injector.bindComponent("blockSelector", (ctx: IInjector, params: {}) => {
            const blockService = ctx.resolve<IBlockService>("blockService");
            return new BlockSelector(blockService, params["onSelect"]);
        });

        injector.bindComponent("addBlockDialog", (ctx: IInjector, sectionModel: SectionModel) => {
            const viewManager = ctx.resolve<IViewManager>("viewManager");
            const blockService = ctx.resolve<IBlockService>("blockService");
            const sectionModelBinder = ctx.resolve<SectionModelBinder>("sectionModelBinder");

            return new AddBlockDialog(viewManager, blockService, sectionModelBinder, sectionModel);
        });
    }
}
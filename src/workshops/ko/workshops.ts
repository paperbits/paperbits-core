import * as ko from "knockout";
import template from "./workshops.html";
import { IViewManager, IView, IToolButton } from "@paperbits/common/ui";
import { IUserService } from "@paperbits/common/user";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "workshops",
    template: template,
    injectable: "workshops"
})
export class Workshops {
    public userPhotoUrl: ko.Observable<string>;
    public resizing: ko.Computed<string>;
    public sections: ko.ObservableArray<IToolButton>;

    constructor(
        private readonly viewManager: IViewManager,
        private readonly userService: IUserService,
        private readonly workshopSections: IToolButton[]
    ) {
        this.userPhotoUrl = ko.observable<string>(null);
        this.resizing = ko.pureComputed(() => this.viewManager.journeyName() ? "vertically horizontally" : "vertically horizontally suspended");
        this.sections = ko.observableArray(this.workshopSections);
    }

    @OnMounted()
    public async loadUserProfile(): Promise<void> {
        const url = await this.userService.getUserPhotoUrl();
        this.userPhotoUrl(url);
    }

    public closeWorkshop(view: IView): void {
        this.viewManager.closeWorkshop(view);
    }
}
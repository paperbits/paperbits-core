import * as ko from "knockout";
import template from "./workshops.html";
import { ViewManager, View, ToolButton } from "@paperbits/common/ui";
import { UserService } from "@paperbits/common/user";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";

@Component({
    selector: "workshops",
    template: template
})
export class Workshops {
    public userPhotoUrl: ko.Observable<string>;
    public resizing: ko.Computed<string>;
    public sections: ko.ObservableArray<ToolButton>;

    constructor(
        private readonly viewManager: ViewManager,
        private readonly userService: UserService,
        private readonly workshopSections: ToolButton[]
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

    public closeWorkshop(view: View): void {
        this.viewManager.closeWorkshop(view);
    }
}
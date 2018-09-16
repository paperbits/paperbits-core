import * as ko from "knockout";
import template from "./workshops.html";
import { IViewManager } from "@paperbits/common/ui";
import { IUserService } from "@paperbits/common/user";
import { IView } from "@paperbits/common/ui/IView";
import { Component } from "../../ko/component";

@Component({
    selector: "workshops",
    template: template,
    injectable: "workshops"
})
export class Workshops {
    private readonly viewManager: IViewManager;
    private readonly userService: IUserService;

    public userPhotoUrl: KnockoutObservable<string>;
    public resizing: KnockoutComputed<string>;

    constructor(viewManager: IViewManager, userService: IUserService) {
        this.viewManager = viewManager;
        this.userService = userService;

        this.closeWorkshop = this.closeWorkshop.bind(this);

        this.userPhotoUrl = ko.observable<string>(null);
        this.resizing = ko.pureComputed(() => this.viewManager.journeyName() ? "vertically horizontally" : "vertically horizontally suspended");

        this.loadUserProfile();
    }

    private async loadUserProfile(): Promise<void> {
        const url = await this.userService.getUserPhotoUrl();
        this.userPhotoUrl(url);
    }

    private openViewAsWorkshop(label: string, componentName: string): void {
        this.viewManager.clearJourney();
        this.viewManager.openViewAsWorkshop(label, componentName);
    }

    public openLayouts(): void {
        this.openViewAsWorkshop("Layouts", "layouts");
    }

    public openPages(): void {
        this.openViewAsWorkshop("Pages", "pages");
    }

    public openBlogs(): void {
        this.openViewAsWorkshop("Blog", "blogs");
    }

    public openMedia(): void {
        this.openViewAsWorkshop("Media", "media");
    }

    public openNavigation(): void {
        this.openViewAsWorkshop("Navigation", "navigation");
    }

    public openEmails(): void {
        this.openViewAsWorkshop("Email templates", "emails");
    }

    public openSettings(): void {
        this.openViewAsWorkshop("Site settings", "settings");
    }

    public openProfile(): void {
        // TODO:
    }

    public closeWorkshop(view: IView): void {
        this.viewManager.closeWorkshop(view);
    }
}
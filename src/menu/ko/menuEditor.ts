import * as ko from "knockout";
import template from "./menuEditor.html";
import { Component, Event, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { NavigationItemModel } from "@paperbits/common/navigation";
import { ViewManager } from "@paperbits/common/ui";
import { SelectOption } from "@paperbits/common/ui/selectOption";
import { StyleHelper, StyleService } from "@paperbits/styles";
import { Display } from "@paperbits/styles/plugins";
import { MenuModel } from "../menuModel";


const emptySelectionLabel = "Click to select navigation item...";

@Component({
    selector: "menu-editor",
    template: template
})
export class MenuEditor {
    public readonly navigationItemTitle: ko.Observable<string>;
    public readonly showHeadings: ko.Observable<boolean>;
    public readonly headingLevelOptions: ko.ObservableArray<SelectOption>;
    public readonly minHeadingLevel: ko.Observable<number>;
    public readonly maxHeadingLevel: ko.Observable<number>;
    public readonly layout: ko.Observable<string>;
    public readonly layoutOptions: ko.ObservableArray<SelectOption>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;
    public readonly displayStyle: ko.Observable<string>;

    public displayOptions: SelectOption[] = [
        { value: null, text: "(Inherit)" },
        { value: Display.Inline, text: "Visible" },
        { value: Display.None, text: "Hidden" }
    ];

    constructor(
        private readonly styleService: StyleService,
        private readonly viewManager: ViewManager
    ) {
        this.showHeadings = ko.observable();
        this.minHeadingLevel = ko.observable();
        this.maxHeadingLevel = ko.observable();
        this.layout = ko.observable();
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();

        this.headingLevelOptions = ko.observableArray<SelectOption>([
            { text: "Heading 1", value: 1 },
            { text: "Heading 2", value: 2 },
            { text: "Heading 3", value: 3 },
            { text: "Heading 4", value: 4 },
            { text: "Heading 5", value: 5 },
            { text: "Heading 6", value: 6 }
        ]);

        this.layoutOptions = ko.observableArray<SelectOption>([
            { text: "Horizontal menu", value: "horizontal" },
            { text: "Vertical menu", value: "vertical" }
        ]);

        this.navigationItemTitle = ko.observable();
        this.displayStyle = ko.observable<string>();
    }

    @Param()
    public model: MenuModel;

    @Event()
    public onChange: (model: MenuModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.showHeadings(!!this.model.minHeading || !!this.model.maxHeading);
        this.minHeadingLevel(this.model.minHeading || 1);
        this.maxHeadingLevel(this.model.maxHeading || 6);

        const variations = await this.styleService.getComponentVariations("menu");
        this.appearanceStyles(variations.filter(x => x.category === "appearance"));

        this.appearanceStyle(this.model.styles?.appearance);
        this.navigationItemTitle(this.model.navigationItem?.label || emptySelectionLabel);

        this.layout(this.model.layout);

        this.minHeadingLevel.subscribe(this.applyChanges);
        this.maxHeadingLevel.subscribe(this.applyChanges);
        this.layout.subscribe(this.applyChanges);
        this.showHeadings.subscribe(this.applyChanges);
        this.appearanceStyle.subscribe(this.applyChanges);
    }

    public onNavigationItemChange(navigationItem: NavigationItemModel): void {
        this.model.navigationItem = navigationItem;
        this.navigationItemTitle(navigationItem?.label || emptySelectionLabel);
        this.applyChanges();
    }

    public onDisplayChange(): void {
        const viewport = this.viewManager.getViewport();
        const newViewportValue = this.displayStyle();

        StyleHelper.setVisibility(this.model.styles, newViewportValue, viewport, this.viewManager);
        this.onChange(this.model);
    }

    public applyChanges(): void {
        if (this.showHeadings()) {
            this.model.minHeading = this.minHeadingLevel();
            this.model.maxHeading = this.maxHeadingLevel();
        }
        else {
            this.model.minHeading = null;
            this.model.maxHeading = null;
        }

        this.model.layout = this.layout();
        this.model.styles = {
            appearance: this.appearanceStyle()
        };

        this.onChange(this.model);
    }

    public onRoleSelect(roles: string[]): void {
        this.model.roles = roles;
        this.applyChanges();
    }
}

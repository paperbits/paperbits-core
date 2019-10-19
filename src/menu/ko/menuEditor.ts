import * as ko from "knockout";
import template from "./menuEditor.html";
import { Component, OnMounted, Param, Event } from "@paperbits/common/ko/decorators";
import { NavigationItemContract } from "@paperbits/common/navigation";
import { StyleService } from "@paperbits/styles";
import { MenuModel } from "../menuModel";

interface HeadingOption {
    label: string;
    value: number;
}

interface LayoutOption {
    label: string;
    value: string;
}

@Component({
    selector: "menu-editor",
    template: template,
    injectable: "menuEditor"
})
export class MenuEditor {
    public readonly navigationItemTitle: ko.Observable<string>;
    public readonly showSubmenus: ko.Observable<boolean>;
    public readonly headingLevelOptions: ko.ObservableArray<HeadingOption>;
    public readonly minHeadingLevel: ko.Observable<number>;
    public readonly maxHeadingLevel: ko.Observable<number>;
    public readonly layout: ko.Observable<string>;
    public readonly layoutOptions: ko.ObservableArray<LayoutOption>;
    public readonly appearanceStyles: ko.ObservableArray<any>;
    public readonly appearanceStyle: ko.Observable<any>;

    constructor(private readonly styleService: StyleService) {
        this.showSubmenus = ko.observable();
        this.minHeadingLevel = ko.observable();
        this.maxHeadingLevel = ko.observable();
        this.layout = ko.observable();
        this.appearanceStyles = ko.observableArray<any>();
        this.appearanceStyle = ko.observable<any>();

        this.headingLevelOptions = ko.observableArray<HeadingOption>([
            { label: "Heading 1", value: 1 },
            { label: "Heading 2", value: 2 },
            { label: "Heading 3", value: 3 },
            { label: "Heading 4", value: 4 },
            { label: "Heading 5", value: 5 },
            { label: "Heading 6", value: 6 }
        ]);

        this.layoutOptions = ko.observableArray<LayoutOption>([
            { label: "Horizontal menu", value: "horizontal" },
            { label: "Vertical menu", value: "vertical" }
            // { label: "Site map", value: "sitemap" }
        ]);

        this.onNavigationItemChange = this.onNavigationItemChange.bind(this);
        this.navigationItemTitle = ko.observable<string>("Click to select navigation item...");
    }

    @Param()
    public model: MenuModel;

    @Event()
    public onChange: (model: MenuModel) => void;

    @OnMounted()
    public async initialize(): Promise<void> {
        this.showSubmenus(!!this.model.minHeading || !!this.model.maxHeading);
        this.minHeadingLevel(this.model.minHeading || 1);
        this.maxHeadingLevel(this.model.maxHeading || 1);

        const variations = await this.styleService.getComponentVariations("menu");
        this.appearanceStyles(variations.filter(x => x.category === "appearance"));

        if (this.model.styles) {
            this.appearanceStyle(this.model.styles.appearance);
        }

        if (this.model.title) {
            this.navigationItemTitle(this.model.title);
        }

        this.layout(this.model.layout);

        this.minHeadingLevel.subscribe(this.applyChanges);
        this.maxHeadingLevel.subscribe(this.applyChanges);
        this.layout.subscribe(this.applyChanges);
        this.showSubmenus.subscribe(this.applyChanges);
        this.appearanceStyle.subscribe(this.applyChanges);
    }

    public async onNavigationItemChange(navigationItem: NavigationItemContract): Promise<void> {
        this.model.navigationItemKey = navigationItem.key;
        this.navigationItemTitle(navigationItem.label);
        this.applyChanges();
    }

    public applyChanges(): void {
        if (this.showSubmenus()) {
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

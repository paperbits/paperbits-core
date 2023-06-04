import * as ko from "knockout";
import template from "./menuEditor.html";
import { Component, Event, OnMounted, Param } from "@paperbits/common/ko/decorators";
import { NavigationItemModel } from "@paperbits/common/navigation";
import { ViewManager } from "@paperbits/common/ui";
import { SelectOption } from "@paperbits/common/ui/selectOption";
import { StyleHelper, StyleService } from "@paperbits/styles";
import { BoxStylePluginConfig, Display, MarginStylePluginConfig, SizeStylePluginConfig } from "@paperbits/styles/plugins";
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
    public readonly menuVariations: ko.ObservableArray<any>;
    public readonly menuVariationKey: ko.Observable<any>;
    public readonly displayStyle: ko.Observable<string>;

    public readonly boxConfig: ko.Observable<BoxStylePluginConfig>;
    public readonly sizeConfig: ko.Observable<SizeStylePluginConfig>;

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
        this.menuVariations = ko.observableArray<any>();
        this.menuVariationKey = ko.observable<any>();
        this.boxConfig = ko.observable<BoxStylePluginConfig>();
        this.sizeConfig = ko.observable<SizeStylePluginConfig>();

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
        const localStyles = this.model.styles;

        this.showHeadings(!!this.model.minHeading || !!this.model.maxHeading);
        this.minHeadingLevel(this.model.minHeading || 1);
        this.maxHeadingLevel(this.model.maxHeading || 6);

        const variations = await this.styleService.getComponentVariations("menu");
        this.menuVariations(variations.filter(x => x.category === "appearance"));

        this.menuVariationKey(this.model.styles?.appearance);
        this.navigationItemTitle(this.model.navigationItem?.label || emptySelectionLabel);

        this.layout(this.model.layout);

        const marginConfig = <MarginStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(localStyles, "margin");
        this.boxConfig({ margin: marginConfig });

        const sizeConfig = <SizeStylePluginConfig>StyleHelper.getPluginConfigForLocalStyles(localStyles, "size");
        this.sizeConfig(sizeConfig);

        this.minHeadingLevel.subscribe(this.applyChanges);
        this.maxHeadingLevel.subscribe(this.applyChanges);
        this.layout.subscribe(this.applyChanges);
        this.showHeadings.subscribe(this.applyChanges);
        this.menuVariationKey.subscribe(this.applyChanges);
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

    public onVariationChange(): void {
        this.onChange(this.model);
    }

    public onSizeChange(sizeConfig: SizeStylePluginConfig): void {
        this.sizeConfig(sizeConfig);
        this.applyChanges();
    }

    public onBoxUpdate(pluginConfig: BoxStylePluginConfig): void {
        this.boxConfig(pluginConfig);
        this.applyChanges();
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
            appearance: this.menuVariationKey()
        };

        const marginStyle = this.boxConfig().margin;
        const paddingStyle = this.boxConfig().padding;
        const sizeConfig: SizeStylePluginConfig = this.sizeConfig();
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "size", sizeConfig);
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "margin", marginStyle);
        StyleHelper.setPluginConfigForLocalStyles(this.model.styles, "padding", paddingStyle)

        this.onChange(this.model);
    }
}

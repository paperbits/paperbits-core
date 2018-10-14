import * as _ from "lodash";
import * as ko from "knockout";
import * as Arrays from "@paperbits/common/arrays";
import template from "./viewManager.html";
import "@paperbits/common/extensions";
import { MetaDataSetter } from "@paperbits/common/meta/metaDataSetter";
import { IBag } from "@paperbits/common";
import { IMediaService } from "@paperbits/common/media";
import { IEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { IComponent, IView, IViewManager, ViewManagerMode, IHighlightConfig, IContextualEditor, ISplitterConfig, HostDocument } from "@paperbits/common/ui";
import { ProgressIndicator } from "../ui";
import { IRouteHandler } from "@paperbits/common/routing";
import { ISiteService, ISettings } from "@paperbits/common/sites";
import { IPageService, PageContract } from "@paperbits/common/pages";
import { IPermalinkService } from "@paperbits/common/permalinks";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IWidgetBinding } from "@paperbits/common/editing";
import { IWidgetEditor } from "@paperbits/common/widgets";
import { Component } from "../decorators/component.decorator";

declare let uploadDialog;



@Component({
    selector: "view-manager",
    template: template,
    injectable: "viewManager"
})
export class ViewManager implements IViewManager {
    private contextualEditorsBag: IBag<IContextualEditor> = {};
    private currentPage: PageContract;

    public journey: KnockoutObservableArray<IView>;
    public journeyName: KnockoutComputed<string>;
    public itemSelectorName: KnockoutObservable<string>;
    public progressIndicators: KnockoutObservableArray<ProgressIndicator>;
    public balloons: KnockoutObservableArray<IComponent>;
    public primaryToolboxVisible: KnockoutObservable<boolean>;
    public widgetEditor: KnockoutObservable<IView>;
    public contextualEditors: KnockoutObservableArray<IContextualEditor>;
    public highlightedElement: KnockoutObservable<IHighlightConfig>;
    public splitterElement: KnockoutObservable<ISplitterConfig>;
    public selectedElement: KnockoutObservable<IHighlightConfig>;
    public selectedElementContextualEditor: KnockoutObservable<IContextualEditor>;
    public viewport: KnockoutObservable<string>;

    public hostDocument: KnockoutObservable<HostDocument>;

    public shutter: KnockoutObservable<boolean>;
    public dragSession: KnockoutObservable<DragSession>;

    public mode: ViewManagerMode;

    constructor(
        private readonly eventManager: IEventManager,
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly routeHandler: IRouteHandler,
        private readonly mediaService: IMediaService,
        private readonly pageService: IPageService,
        private readonly permalinkService: IPermalinkService,
        private readonly siteService: ISiteService) {

        this.eventManager = eventManager;
        this.globalEventHandler = globalEventHandler;
        this.routeHandler = routeHandler;
        this.mediaService = mediaService;
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.siteService = siteService;

        // rebinding...
        this.addProgressIndicator = this.addProgressIndicator.bind(this);
        this.addPromiseProgressIndicator = this.addPromiseProgressIndicator.bind(this);
        this.openViewAsWorkshop = this.openViewAsWorkshop.bind(this);
        this.openViewAsPopup = this.openViewAsPopup.bind(this);
        this.scheduleIndicatorRemoval = this.scheduleIndicatorRemoval.bind(this);
        this.updateJourneyComponent = this.updateJourneyComponent.bind(this);
        this.clearJourney = this.clearJourney.bind(this);
        this.foldEverything = this.foldEverything.bind(this);
        this.unfoldEverything = this.unfoldEverything.bind(this);
        this.closeWidgetEditor = this.closeWidgetEditor.bind(this);
        this.closeEditors = this.closeEditors.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onHoverCommandActivate = this.onHoverCommandActivate.bind(this);
        this.onHoverCommandDeactivate = this.onHoverCommandDeactivate.bind(this);

        // setting up...
        this.mode = ViewManagerMode.selecting;
        this.progressIndicators = ko.observableArray<ProgressIndicator>();
        this.balloons = ko.observableArray<IComponent>();
        this.journey = ko.observableArray<IView>();
        this.journeyName = ko.pureComputed<string>(() => {
            if (this.journey().length === 0) {
                return null;
            }

            return this.journey()[0].heading;
        });
        this.itemSelectorName = ko.observable<string>(null);
        this.widgetEditor = ko.observable<IView>();
        this.contextualEditors = ko.observableArray<IContextualEditor>([]);
        this.highlightedElement = ko.observable<IHighlightConfig>();
        this.splitterElement = ko.observable<ISplitterConfig>();
        this.selectedElement = ko.observable<IHighlightConfig>();
        this.selectedElementContextualEditor = ko.observable<IContextualEditor>();


        this.viewport = ko.observable<string>("xl");
        this.hostDocument = ko.observable<HostDocument>({ src: "/page.html", componentName: "page-document" });

        this.shutter = ko.observable<boolean>(true);
        this.dragSession = ko.observable();

        this.primaryToolboxVisible = ko.observable<boolean>(true);

        this.globalEventHandler.addDragEnterListener(this.foldEverything);
        this.globalEventHandler.addDragDropListener(this.onDragEnd);
        this.globalEventHandler.addDragEndListener(this.onDragEnd);
        this.globalEventHandler.addDragLeaveScreenListener(this.unfoldEverything);


        this.eventManager.addEventListener("virtualDragEnd", this.onDragEnd);

        this.routeHandler.addRouteChangeListener(this.onRouteChange.bind(this));
        globalEventHandler.appendDocument(document);

        eventManager.addEventListener("onEscape", this.closeEditors);

        this.loadFavIcon();
        this.setTitle();
    }

    public setDocument(hostDocument: HostDocument): void {
        if (this.hostDocument().componentName === hostDocument.componentName) {
            return;
        }

        // this.closeEditors();
        this.clearContextualEditors();

        this.hostDocument(hostDocument);
    }

    private onRouteChange(): void {
        this.clearContextualEditors();
        this.closeWidgetEditor();
    }

    public async loadFavIcon(): Promise<void> {
        const settings = await this.siteService.getSiteSettings();

        if (settings && settings.site.faviconPermalinkKey) {
            const iconFile = await this.mediaService.getMediaByPermalinkKey(settings.site.faviconPermalinkKey);

            if (iconFile && iconFile.downloadUrl) {
                MetaDataSetter.setFavIcon(iconFile.downloadUrl);
            }
        }
    }

    public async setTitle(settings?: ISettings, page?: PageContract): Promise<void> {
        let siteTitle, pageTitle;

        if (settings && settings.site) {
            siteTitle = settings.site.title;
        }
        else {
            const settings = await this.siteService.getSiteSettings();
            if (settings && settings.site) {
                siteTitle = settings.site.title;
            }
        }
        if (!page) {
            page = await this.getCurrentPage();
            pageTitle = page.title;
        }

        let pageType;
        pageType = this.getPageType(page.key);

        switch (pageType) {
            case "page":
                pageTitle = page.title;
                break;
            case "post":
                pageTitle = `Blog - ${page.title}`;
                break;
            case "news":
                pageTitle = `News - ${page.title}`;
                break;
        }

        window.document.title = [siteTitle, pageTitle].join(" | ");
    }

    private getPageType(pageKey: string): string {
        let pageType = "page";
        if (pageKey.startsWith("posts")) {
            pageType = "post";
        }
        if (pageKey.startsWith("news")) {
            pageType = "news";
        }
        return pageType;
    }

    public async getCurrentPage(): Promise<PageContract> {
        const url = this.routeHandler.getCurrentUrl();
        let permalink = await this.permalinkService.getPermalinkByUrl(url);

        if (!permalink) {
            permalink = await this.permalinkService.getPermalinkByUrl("/404");
        }

        const pageKey = permalink.targetKey;

        if (this.currentPage && this.currentPage.permalinkKey === pageKey) {
            return this.currentPage;
        }

        this.currentPage = await this.pageService.getPageByKey(pageKey);

        return this.currentPage;
    }

    public getCurrentJourney(): string {
        return this.journeyName();
    }

    public addProgressIndicator(title: string, content: string): ProgressIndicator {
        const indicator = new ProgressIndicator(title, content);
        this.progressIndicators.push(indicator);

        return indicator;
    }

    public notifySuccess(title: string, content: string): void {
        const indicator = new ProgressIndicator(title, content, 100);
        this.progressIndicators.push(indicator);
        this.scheduleIndicatorRemoval(indicator);
    }

    public addPromiseProgressIndicator<T>(promise: Promise<T>, title: string, content: string): void {
        const indicator = new ProgressIndicator(title, content);

        this.progressIndicators.push(indicator);

        if (promise["progress"]) {
            promise["progress"](indicator.progress);
        }

        promise.then(() => {
            indicator.complete(true);
        });

        promise.then(() => {
            this.scheduleIndicatorRemoval(indicator);
        });
    }

    public updateJourneyComponent(view: IView): void {
        let journey = this.journey();

        const existingComponent = journey.find(c => { return c.component.name === view.component.name; });

        if (existingComponent) {
            journey = journey.splice(0, journey.indexOf(existingComponent));
        }
        journey.push(view);

        this.journey(journey);
    }

    public clearJourney(): void {
        this.journey([]);
        this.widgetEditor(null);
    }

    public foldWorkshops(): void {
        this.journey([]);
        this.primaryToolboxVisible(false);
    }

    public unfoldWorkshop(): void {
        this.primaryToolboxVisible(true);
    }

    public foldEverything(): void {
        this.foldWorkshops();
        this.mode = ViewManagerMode.dragging;
        this.clearContextualEditors();
    }

    public unfoldEverything(): void {
        this.primaryToolboxVisible(true);
        this.mode = ViewManagerMode.selecting;
    }

    public openViewAsWorkshop(heading: string, componentName: string, parameters?: any): IView {
        this.clearContextualEditors();

        const session: IView = {
            heading: heading,
            component: {
                name: componentName,
                params: parameters
            }
        };

        this.updateJourneyComponent(session);

        this.mode = ViewManagerMode.configure;

        return session;
    }

    /**
     * Deletes specified editors and all editors after.
     * @param view IView
     */
    public closeWorkshop(editor: IView | string): void {
        const journey = this.journey();
        let view;

        if (typeof editor === "string") {
            view = journey.find(x => x.component.name === editor);
        }
        else {
            view = editor;
        }

        const indexOfClosingEditor = journey.indexOf(view);

        journey.length = indexOfClosingEditor;

        this.journey(journey);
        this.mode = ViewManagerMode.selecting;
    }

    public scheduleIndicatorRemoval(indicator: ProgressIndicator): void {
        indicator.progress(100);

        setTimeout(() => {
            this.progressIndicators(_.without(this.progressIndicators(), indicator));
        }, 4000);
    }

    public openUploadDialog(): Promise<File[]> {
        uploadDialog.click();

        return new Promise<File[]>((resolve) => {
            uploadDialog.onchange = () => {
                resolve(Arrays.coerce(uploadDialog.files));
            };
        });
    }

    public openViewAsPopup(view: IView): void {
        if (this.widgetEditor() === view) {
            return;
        }

        this.clearContextualEditors();
        this.closeWidgetEditor();
        this.widgetEditor(view);
        this.mode = ViewManagerMode.configure;
    }

    public getWidgetview(): IView {
        return this.widgetEditor();
    }

    public closeEditors(): void {
        this.closeWidgetEditor();
        this.clearJourney();
    }

    public openWidgetEditor(binding: IWidgetBinding): void {
        const view: IView = {
            component: {
                name: binding.editor,
                params: {},
                oncreate: (editorViewModel: IWidgetEditor) => {
                    editorViewModel.setWidgetModel(binding.model, binding.applyChanges);
                }
            },
            heading: binding.displayName,
            resize: binding.editorResize || "vertically horizontally"
        };

        this.openViewAsPopup(view);
    }

    public closeWidgetEditor(): void {
        this.widgetEditor(null);
        this.eventManager.dispatchEvent("onWidgetEditorClose");
        this.clearContextualEditors();

        this.mode = ViewManagerMode.selecting;
        this.unfoldWorkshop();
    }

    public setContextualEditor(editorName: string, contextualEditor: IContextualEditor): void {
        this.contextualEditorsBag[editorName] = contextualEditor;

        const editors = Object.keys(this.contextualEditorsBag).map(key => this.contextualEditorsBag[key]);

        this.contextualEditors(editors);
    }

    public removeContextualEditor(editorName: string): void {
        if (!this.contextualEditorsBag[editorName]) {
            return;
        }

        delete this.contextualEditorsBag[editorName];

        const editors = Object.keys(this.contextualEditorsBag).map(key => this.contextualEditorsBag[key]);

        this.contextualEditors(editors);
    }

    public clearContextualEditors(): void {
        this.contextualEditorsBag = {};
        this.contextualEditors([]);
        this.highlightedElement(null);
        this.setSplitter(null);
        this.selectedElement(null);
        this.selectedElementContextualEditor(null);

        if (this.mode !== ViewManagerMode.configure) {
            this.mode = ViewManagerMode.selecting;
        }
    }

    public setHighlight(config: IHighlightConfig): void {
        this.highlightedElement(null);
        this.setSplitter(null);
        this.highlightedElement(config);
    }

    public setSplitter(config: ISplitterConfig): void {
        this.splitterElement(null);
        this.splitterElement(config);
    }

    public setSelectedElement(config: IHighlightConfig, contextualEditor: IContextualEditor): void {
        this.clearContextualEditors();
        this.closeWidgetEditor();
        this.selectedElement(null);
        this.selectedElement(config);
        this.selectedElementContextualEditor(contextualEditor);

        if (this.mode !== ViewManagerMode.configure) {
            this.mode = ViewManagerMode.selected;
        }

        this.clearJourney();
    }

    public getSelectedElement(): IHighlightConfig {
        return this.selectedElement();
    }

    public setViewport(viewport: string): void {
        this.clearContextualEditors();
        this.viewport(viewport);
    }

    public getViewport(): string {
        return this.viewport();
    }

    public setShutter(): void {
        this.shutter(true);
    }

    public removeShutter(): void {
        this.shutter(false);
    }

    public onHoverCommandActivate(): void {
        this.mode = ViewManagerMode.pause;
        this.highlightedElement(null);
        this.selectedElement(null);
    }

    public onHoverCommandDeactivate(): void {
        this.mode = ViewManagerMode.selecting;
    }

    public beginDrag(session: DragSession): void {
        this.clearContextualEditors();
        this.closeWidgetEditor();
        this.dragSession(session);
        this.foldEverything();
    }

    public getDragSession(): DragSession {
        return this.dragSession();
    }

    public onDragEnd(): void {
        this.unfoldEverything();
    }

    public addBalloon(component: IComponent): void {
        this.balloons.push(component);
    }

    public removeBalloon(component: IComponent): void {
        this.balloons.remove(component);
    }
}
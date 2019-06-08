import * as _ from "lodash";
import * as ko from "knockout";
import * as Arrays from "@paperbits/common/arrays";
import template from "./viewManager.html";
import "@paperbits/common/extensions";
import { MetaDataSetter } from "@paperbits/common/meta/metaDataSetter";
import { Bag } from "@paperbits/common";
import { IMediaService } from "@paperbits/common/media";
import { IEventManager, GlobalEventHandler } from "@paperbits/common/events";
import { IComponent, IView, IViewManager, ICommand, ViewManagerMode, IHighlightConfig, IContextCommandSet, ISplitterConfig, Toast } from "@paperbits/common/ui";
import { Router } from "@paperbits/common/routing";
import { ISiteService } from "@paperbits/common/sites";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IWidgetBinding } from "@paperbits/common/editing";
import { Component, OnMounted, RuntimeComponent } from "@paperbits/common/ko/decorators";

declare let uploadDialog: HTMLInputElement;


@Component({
    selector: "view-manager",
    template: template,
    injectable: "viewManager"
})
export class ViewManager implements IViewManager {
    private contextualEditorsBag: Bag<IContextCommandSet> = {};

    public journey: ko.ObservableArray<IView>;
    public journeyName: ko.Computed<string>;
    public itemSelectorName: ko.Observable<string>;
    public toasts: ko.ObservableArray<Toast>;
    public balloons: ko.ObservableArray<IComponent>;
    public primaryToolboxVisible: ko.Observable<boolean>;
    public widgetEditor: ko.Observable<IView>;
    public contextualEditors: ko.ObservableArray<IContextCommandSet>;
    public highlightedElement: ko.Observable<IHighlightConfig>;
    public splitterElement: ko.Observable<ISplitterConfig>;
    public selectedElement: ko.Observable<IHighlightConfig>;
    public selectedElementContextualEditor: ko.Observable<IContextCommandSet>;
    public viewport: ko.Observable<string>;
    public hostDocument: Document;
    public host: ko.Observable<IComponent>;
    public shutter: ko.Observable<boolean>;
    public dragSession: ko.Observable<DragSession>;
    public mode: ViewManagerMode;

    constructor(
        private readonly eventManager: IEventManager,
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly router: Router,
        private readonly mediaService: IMediaService,
        private readonly siteService: ISiteService) {

        // setting up...
        this.mode = ViewManagerMode.selecting;
        this.toasts = ko.observableArray<Toast>();
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
        this.contextualEditors = ko.observableArray<IContextCommandSet>([]);
        this.highlightedElement = ko.observable<IHighlightConfig>();
        this.splitterElement = ko.observable<ISplitterConfig>();
        this.selectedElement = ko.observable<IHighlightConfig>();
        this.selectedElementContextualEditor = ko.observable<IContextCommandSet>();
        this.viewport = ko.observable<string>("xl");
        this.host = ko.observable<IComponent>();
        this.shutter = ko.observable<boolean>(true);
        this.dragSession = ko.observable();
        this.primaryToolboxVisible = ko.observable<boolean>(false);

        this.globalEventHandler.addDragEnterListener(this.foldEverything.bind(this));
        this.globalEventHandler.addDragDropListener(this.onDragEnd.bind(this));
        this.globalEventHandler.addDragEndListener(this.onDragEnd.bind(this));
        this.globalEventHandler.addDragLeaveScreenListener(this.unfoldEverything.bind(this));
        this.eventManager.addEventListener("virtualDragEnd", this.onDragEnd.bind(this));

        this.router.addRouteChangeListener(this.onRouteChange.bind(this));
        globalEventHandler.appendDocument(document);

        eventManager.addEventListener("onEscape", this.closeEditors.bind(this));
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        const settings = await this.siteService.getSiteSettings();

        if (!settings) {
            console.warn(`Unable to initialize designer.`);
            this.host({ name: "setup-dialog" });
            return;
        }

        if (settings.site.faviconSourceKey) {
            const mediaContract = await this.mediaService.getMediaByKey(settings.site.faviconSourceKey);

            if (!mediaContract) {
                console.warn(`Unable to fetch favicon by key ${settings.site.faviconSourceKey}`);
            }

            await this.loadFavIcon(settings.site.faviconSourceKey);
        }

        this.eventManager.dispatchEvent("onStyleChange");
        this.host({ name: "content-host" });
        this.primaryToolboxVisible(true);
    }

    public setHost(component: IComponent): void {
        if (this.host().name === component.name) {
            return;
        }

        this.clearContextualEditors();
        this.host(component);
    }

    public getHost(): IComponent {
        return this.host();
    }

    public getHostDocument(): Document {
        return this.hostDocument;
    }

    private onRouteChange(): void {
        this.clearContextualEditors();
        this.closeView();
    }

    public async loadFavIcon(faviconUrl: string): Promise<void> {
        if (!faviconUrl) {
            return;
        }

        MetaDataSetter.setFavIcon(faviconUrl);
    }

    public getCurrentJourney(): string {
        return this.journeyName();
    }

    public addToast(title: string, content: string, commands?: ICommand[]): Toast {
        const toast = new Toast(title, content, "info", null, commands);
        this.toasts.push(toast);

        return toast;
    }

    public removeToast(toast: Toast): void {
        this.toasts.splice(this.toasts().indexOf(toast), 1);
    }

    public notifySuccess(title: string, content: string): void {
        const toast = new Toast(title, content, "success");
        this.toasts.push(toast);
        this.scheduleToastRemoval(toast);
    }

    public notifyInfo(title: string, content: string, commands?: ICommand[]): void {
        const toast = new Toast(title, content, "info", null, commands);
        this.toasts.push(toast);
        this.scheduleToastRemoval(toast);
    }

    public notifyError(title: string, content: string): void {
        const toast = new Toast(title, content, "error");
        this.toasts.push(toast);
        this.scheduleToastRemoval(toast);
    }

    public notifyProgress(promise: Promise<any>, title: string, content: string): void {
        const toast = new Toast(title, content);

        this.toasts.push(toast);

        if (promise["progress"]) {
            promise["progress"](toast.progress);
        }

        promise.then(() => {
            toast.progress(100);
        });

        promise.then(() => {
            this.scheduleToastRemoval(toast);
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

    public scheduleToastRemoval(toast: Toast): void {
        setTimeout(() => {
            this.toasts(_.without(this.toasts(), toast));
        }, 8000);
    }

    public openUploadDialog(): Promise<File[]> {
        uploadDialog.click();

        return new Promise<File[]>((resolve) => {
            uploadDialog.onchange = () => {
                const selectedFiles = Arrays.coerce<File>(uploadDialog.files);
                uploadDialog.value = "";
                resolve(selectedFiles);
            };
        });
    }

    public openViewAsPopup(view: IView): void {
        if (this.widgetEditor() === view) {
            return;
        }

        view.component.params.onClose = () => this.closeView();

        this.clearContextualEditors();
        this.closeView();
        this.widgetEditor(view);
        this.mode = ViewManagerMode.configure;
    }

    public getOpenView(): IView {
        return this.widgetEditor();
    }

    public closeEditors(): void {
        this.closeView();
        this.clearJourney();
    }

    public openWidgetEditor(binding: IWidgetBinding<any>): void {
        const view: IView = {
            component: {
                name: binding.editor,
                params: {
                    model: binding.model,
                    onChange: binding.applyChanges
                }
            },
            heading: binding.displayName,
            resize: binding.editorResize || "vertically horizontally"
        };

        this.openViewAsPopup(view);
    }

    public closeView(): void {
        this.widgetEditor(null);
        this.eventManager.dispatchEvent("onWidgetEditorClose");
        this.clearContextualEditors();

        this.mode = ViewManagerMode.selecting;
        this.unfoldWorkshop();
    }

    public setContextualEditor(editorName: string, contextualEditor: IContextCommandSet): void {
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

    public setSelectedElement(config: IHighlightConfig, contextualEditor: IContextCommandSet): void {
        this.clearContextualEditors();
        this.closeView();
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
        this.closeView();
        this.dragSession(session);
        this.foldEverything();
    }

    public getDragSession(): DragSession {
        return this.dragSession();
    }

    public onDragEnd(): void {
        this.unfoldEverything();
        this.highlightedElement(null);
        this.selectedElement(null);
    }

    public addBalloon(component: IComponent): void {
        this.balloons.push(component);
    }

    public removeBalloon(component: IComponent): void {
        this.balloons.remove(component);
    }
}
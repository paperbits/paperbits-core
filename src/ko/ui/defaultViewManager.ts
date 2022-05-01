import * as _ from "lodash";
import * as ko from "knockout";
import * as Arrays from "@paperbits/common/arrays";
import * as Html from "@paperbits/common/html";
import template from "./defaultViewManager.html";
import "@paperbits/common/extensions";
import { Bag } from "@paperbits/common";
import { EventManager, GlobalEventHandler } from "@paperbits/common/events";
import { IComponent, View, ViewManager, ICommand, ViewManagerMode, IHighlightConfig, IContextCommandSet, ISplitterConfig, Toast, IContextCommand } from "@paperbits/common/ui";
import { Router } from "@paperbits/common/routing";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IWidgetBinding } from "@paperbits/common/editing";
import { Component, OnMounted, OnDestroyed, RuntimeComponent } from "@paperbits/common/ko/decorators";
import { RoleModel, BuiltInRoles } from "@paperbits/common/user";
import { DesignerUserService } from "./designerUserService";
import { ViewStack } from "@paperbits/common/ui/viewStack";
import { ISettingsProvider } from "@paperbits/common/configuration";

declare let uploadDialog: HTMLInputElement;


@Component({
    selector: "view-manager",
    template: template
})
export class DefaultViewManager implements ViewManager {
    private contextualCommandsBag: Bag<IContextCommandSet> = {};

    public readonly designTime: ko.Observable<boolean>;
    public readonly previewable: ko.Observable<boolean>;
    public readonly block: ko.Computed<boolean>;
    public readonly journey: ko.ObservableArray<View>;
    public readonly journeyName: ko.Computed<string>;
    public readonly toasts: ko.ObservableArray<Toast>;
    public readonly primaryToolboxVisible: ko.Observable<boolean>;
    public readonly activeView: ko.Observable<View>;
    public readonly contextualCommands: ko.ObservableArray<IContextCommandSet>;
    public readonly highlightedElement: ko.Observable<IHighlightConfig>;
    public readonly splitterElement: ko.Observable<ISplitterConfig>;
    public readonly selectedElement: ko.Observable<IHighlightConfig>;
    public readonly selectedElementContextualEditor: ko.Observable<IContextCommandSet>;
    public readonly viewport: ko.Observable<string>;
    public readonly rolesScope: ko.ObservableArray<RoleModel>;
    public readonly host: ko.Observable<IComponent>;
    public readonly shutter: ko.Observable<boolean>;
    public readonly dragSession: ko.Observable<DragSession>;
    public readonly locale: ko.Observable<string>;
    public readonly canPreview: ko.Computed<boolean>;
    public readonly canGoBack: ko.Computed<boolean>;
    public readonly websitePreviewEnabled: ko.Observable<boolean>;

    public mode: ViewManagerMode;
    public hostDocument: Document;

    private previousMode: ViewManagerMode;
    private previousHost: IComponent;

    constructor(
        private readonly eventManager: EventManager,
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly designerUserService: DesignerUserService,
        private readonly settingsProvider: ISettingsProvider,
        private readonly router: Router,
        private readonly viewStack: ViewStack
    ) {
        this.designTime = ko.observable(false);
        this.previewable = ko.observable(true);
        this.block = ko.computed(() => {
            return this.designTime() && this.previewable();
        });
        this.mode = ViewManagerMode.selecting;
        this.toasts = ko.observableArray<Toast>();
        this.journey = ko.observableArray<View>();
        this.journeyName = ko.pureComputed<string>(() => {
            if (this.journey().length === 0) {
                return null;
            }

            return this.journey()[0].heading;
        });

        this.activeView = ko.observable<View>();
        this.contextualCommands = ko.observableArray<IContextCommandSet>([]);
        this.highlightedElement = ko.observable<IHighlightConfig>();
        this.splitterElement = ko.observable<ISplitterConfig>();
        this.selectedElement = ko.observable<IHighlightConfig>();
        this.selectedElementContextualEditor = ko.observable<IContextCommandSet>();
        this.viewport = ko.observable<string>("xl");
        this.locale = ko.observable<string>("en-us");
        this.rolesScope = ko.observableArray([BuiltInRoles.anonymous]);
        this.host = ko.observable<IComponent>();
        this.shutter = ko.observable(true);
        this.dragSession = ko.observable();
        this.primaryToolboxVisible = ko.observable(false);
        this.websitePreviewEnabled = ko.observable(false);
        this.canPreview = ko.pureComputed<boolean>(() => this.websitePreviewEnabled() && this.host()?.name === "page-host");
        this.canGoBack = ko.pureComputed<boolean>(() => ["style-guide", "layout-host"].includes(this.host()?.name));
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        this.globalEventHandler.addDragEnterListener(this.hideToolboxes.bind(this));
        this.globalEventHandler.addDragDropListener(this.onDragEnd.bind(this));
        this.globalEventHandler.addDragEndListener(this.onDragEnd.bind(this));
        this.globalEventHandler.addDragLeaveScreenListener(this.showToolboxes.bind(this));
        this.eventManager.addEventListener("virtualDragEnd", this.onDragEnd.bind(this));

        this.router.addRouteChangeListener(this.onRouteChange.bind(this));
        this.globalEventHandler.appendDocument(document);

        this.eventManager.addEventListener("onTopLevelEscape", this.onEscape.bind(this));
        this.eventManager.addEventListener("onKeyDown", this.onKeyDown.bind(this));
        this.eventManager.addEventListener("onKeyUp", this.onKeyUp.bind(this));

        const websitePreviewEnabled = await this.settingsProvider.getSetting<boolean>("features/preview");
        this.websitePreviewEnabled(websitePreviewEnabled || false);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (this.getActiveView()) {
            return;
        }

        if (!event.ctrlKey && !event.metaKey) {
            return;
        }

        this.designTime(false);
        this.clearSelection();
    }

    private onKeyUp(event: KeyboardEvent): void {
        if (this.getActiveView()) {
            return;
        }

        if (event.ctrlKey || event.metaKey) {
            return;
        }

        if (this.mode === ViewManagerMode.preview) {
            return;
        }

        this.designTime(true);
    }

    public setHost(component: IComponent, canGoBack: boolean = false): void {
        const currentComponent = this.host();

        this.previousHost = canGoBack ? currentComponent : null;

        if (currentComponent && currentComponent.name === component.name && !currentComponent.params) {
            return;
        }

        this.clearContextualCommands();
        this.host(component);
        this.previewable(component.name !== "style-guide");
    }

    public getHost(): IComponent {
        return this.host();
    }

    public getDesignerDocument(): Document {
        return document;
    }

    public getHostDocument(): Document {
        return this.hostDocument;
    }

    private onRouteChange(): void {
        this.clearContextualCommands();
        this.closeView();
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

    public notifySuccess(title: string, content: string): Toast {
        const toast = new Toast(title, content, "success");
        this.toasts.push(toast);
        this.scheduleToastRemoval(toast);
        return toast;
    }

    public notifyInfo(title: string, content: string, commands?: ICommand[]): Toast {
        const toast = new Toast(title, content, "info", null, commands);
        this.toasts.push(toast);
        this.scheduleToastRemoval(toast);
        return toast;
    }

    public notifyError(title: string, content: string): Toast {
        const toast = new Toast(title, content, "error");
        this.toasts.push(toast);
        this.scheduleToastRemoval(toast);
        return toast;
    }

    public notifyProgress(promise: Promise<any>, title: string, content: string): Toast {
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

        return toast;
    }

    public updateJourneyComponent(view: View): void {
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
        this.activeView(null);
    }

    public hideToolboxes(): void {
        this.journey([]);
        this.primaryToolboxVisible(false);
        if (this.mode !== ViewManagerMode.preview) {
            this.mode = ViewManagerMode.dragging;
        }
        this.clearContextualCommands();
    }

    public showToolboxes(): void {
        this.primaryToolboxVisible(true);
        this.mode = ViewManagerMode.selecting;
    }

    public openViewAsWorkshop(view: View): void {
        this.viewStack.clear();
        this.clearContextualCommands();
        this.updateJourneyComponent(view);
        this.mode = ViewManagerMode.configure;
    }

    /**
     * Deletes specified view and all views after it in the stack.
     * @param view View
     */
    public closeWorkshop(view: View | string): void {
        const journey = this.journey();
        let viewToClose;

        if (typeof view === "string") {
            viewToClose = journey.find(x => x.component.name === view);
        }
        else {
            viewToClose = view;
        }

        const indexOfClosingView = journey.indexOf(viewToClose);

        if (indexOfClosingView < 0) {
            return;
        }

        journey.splice(indexOfClosingView);

        this.journey(journey);
        this.mode = ViewManagerMode.selecting;
    }

    public scheduleToastRemoval(toast: Toast): void {
        setTimeout(() => {
            this.toasts(_.without(this.toasts(), toast));
        }, 8000);
    }

    public openUploadDialog(...accept: string[]): Promise<File[]> {
        uploadDialog.accept = accept?.join(",");
        uploadDialog.click();

        return new Promise<File[]>((resolve) => {
            uploadDialog.onchange = () => {
                const selectedFiles = Arrays.coerce<File>(uploadDialog.files);
                uploadDialog.value = "";
                resolve(selectedFiles);
            };
        });
    }

    public openViewAsPopup(view: View): void {
        this.viewStack.clear();

        if (this.activeView() === view) {
            return;
        }

        view.hitTest = (el) => { // TODO: Move to bindingHandler
            return !!Html.closest(el, (x: HTMLElement) =>
                (x.getAttribute && !!x.getAttribute("contentEditable")) || // TODO: Move hitTest check to text editor
                (x?.classList && Arrays.coerce(x.classList).includes("toolbox")));
        };

        view.close = () => this.closeView();

        if (view.component.params) {
            view.component.params.onClose = () => this.closeView();
        }

        if (!view.resize) {
            view.resize = "vertically horizontally";
        }

        this.clearContextualCommands();
        this.closeView();
        this.activeView(view);
        this.mode = ViewManagerMode.configure;

        if (view.component.name === "text-block-editor") {
            this.designTime(false); // Review: It's here for text editor
        }

        this.viewStack.pushView(view);
    }

    public getActiveView(): View {
        return this.activeView();
    }

    public onEscape(): void {
        const host = this.host();

        if (this.viewStack.getViews().length === 0 && this.journey().length > 0) {
            const journey = this.journey();
            journey.pop();
            this.journey(journey);

            return;
        }

        if (!this.getActiveView() && this.journey().length === 0 && host && host.name !== "page-host") {
            this.setHost({ name: "page-host" }); // TODO: Get host type by current route.
        }
    }

    public closeEditors(): void {
        this.closeView();
        this.clearJourney();
    }

    public openWidgetEditor(binding: IWidgetBinding<any, any>): void {
        const view: View = {
            component: {
                name: binding.editor,
                params: {
                    model: binding.model,
                    onChange: binding.applyChanges
                }
            },
            scrollable: "editorScroll" in binding ? binding.editorScroll : true,
            heading: binding.displayName,
            resize: binding.editorResize || "vertically horizontally",
            returnFocusTo: document.getElementById("contentEditor")
        };

        this.openViewAsPopup(view);

        this.eventManager.dispatchEvent("displayHint", {
            key: "fe7c",
            content: `You can resize and move almost every editor, and it will remember its size and position.`
        });
    }

    public closeView(): void {
        if (this.mode === ViewManagerMode.preview) {
            return;
        }

        const view = this.activeView();

        if (view) {
            this.viewStack.removeView(view);
        }

        this.activeView(null);
        this.eventManager.dispatchEvent("onViewClose");
        this.clearContextualCommands();
        this.mode = ViewManagerMode.selecting;

        this.primaryToolboxVisible(true);
        this.designTime(true);
    }

    public setContextualCommands(widgetName: string, contextualCommandSet: IContextCommandSet): void {
        this.contextualCommandsBag[widgetName] = contextualCommandSet;

        const commands = Object.keys(this.contextualCommandsBag).map(key => this.contextualCommandsBag[key]);

        this.contextualCommands(commands);
    }

    public removeContextualCommands(editorName: string): void {
        if (!this.contextualCommandsBag[editorName]) {
            return;
        }

        delete this.contextualCommandsBag[editorName];

        const editors = Object.keys(this.contextualCommandsBag).map(key => this.contextualCommandsBag[key]);

        this.contextualCommands(editors);
    }

    public clearContextualCommands(): void {
        if (this.mode === ViewManagerMode.configure) {
            return;
        }

        this.contextualCommandsBag = {};
        this.contextualCommands([]);
        this.highlightedElement(null);
        this.setSplitter(null);
        this.selectedElement(null);
        this.selectedElementContextualEditor(null);

        if (this.mode !== ViewManagerMode.preview) {
            this.designTime(true);
            this.mode = ViewManagerMode.selecting;
        }
    }

    public setHighlight(config: IHighlightConfig): void {
        if (this.mode === ViewManagerMode.preview) {
            return;
        }
        this.highlightedElement(null);
        this.setSplitter(null);
        this.highlightedElement(config);
    }

    public setSplitter(config: ISplitterConfig): void {
        if (this.mode === ViewManagerMode.preview) {
            return;
        }
        this.splitterElement(null);
        this.splitterElement(config);
    }

    public setSelectedElement(config: IHighlightConfig, contextualCommand: IContextCommandSet): void {
        if (this.mode === ViewManagerMode.preview) {
            return;
        }
        this.clearContextualCommands();
        this.closeView();
        this.selectedElement(null);
        this.selectedElement(config);
        this.selectedElementContextualEditor(contextualCommand);

        if (this.mode !== ViewManagerMode.configure) {
            this.mode = ViewManagerMode.selected;
        }

        this.clearJourney();
    }

    public clearSelection(): void {
        this.selectedElement(null);
    }

    public getSelectedElement(): IHighlightConfig {
        return this.selectedElement();
    }

    public setViewport(viewport: string): void {
        this.clearContextualCommands();
        this.viewport(viewport);
    }

    public getViewport(): string {
        return this.viewport();
    }

    public setViewRoles(roles: RoleModel[]): void {
        const roleKeys = roles.map(role => role.key);

        this.rolesScope(roles);
        this.designerUserService.setUserRoles(roleKeys);

        this.eventManager.dispatchEvent("onUserRoleChange", roleKeys);
    }

    public getViewRoles(): RoleModel[] {
        return this.rolesScope();
    }

    public setShutter(): void {
        this.previousMode = this.mode;
        this.mode = ViewManagerMode.pause;
        this.shutter(true);
    }

    public removeShutter(): void {
        this.mode = this.previousMode;
        this.shutter(false);
    }

    public pauseContextualCommands(...except: IContextCommand[]): void {
        this.mode = ViewManagerMode.pause;
        this.highlightedElement(null);
    }

    public resumeContextualCommands(): void {
        this.mode = ViewManagerMode.selecting;
        this.designTime(true);
        this.clearContextualCommands();
    }

    public beginDrag(session: DragSession): void {
        this.clearContextualCommands();
        this.closeView();
        this.dragSession(session);
        this.hideToolboxes();
    }

    public getDragSession(): DragSession {
        return this.dragSession();
    }

    public onDragEnd(): void {
        if (this.mode !== ViewManagerMode.preview) {
            this.showToolboxes();
        }
        this.highlightedElement(null);
        this.selectedElement(null);
    }

    public enablePreviewMode(): void {
        this.previousMode = this.mode;
        this.clearJourney();
        this.hideToolboxes();
        this.designTime(false);
        this.toasts().forEach(toast => {
            this.removeToast(toast);
        });
        this.mode = ViewManagerMode.preview;
    }

    public disablePreviewMode(): void {
        this.showToolboxes();
        this.designTime(true);
        this.mode = this.previousMode;
    }

    public returnToContentEditing(): void {
        if (this.previousHost) {
            this.setHost(this.previousHost);
        }

        this.designTime(true);
        this.mode = ViewManagerMode.selecting;
    }

    public getActiveLayer(): string {
        const host = this.getHost();
        const activeLayer = host.name.replace("-host", "");
        return activeLayer;
    }

    @OnDestroyed()
    public dispose(): void {
        // TODO
    }
}
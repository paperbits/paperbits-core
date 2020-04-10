import * as _ from "lodash";
import * as ko from "knockout";
import * as Arrays from "@paperbits/common/arrays";
import template from "./defaultViewManager.html";
import "@paperbits/common/extensions";
import { Bag } from "@paperbits/common";
import { EventManager, GlobalEventHandler } from "@paperbits/common/events";
import { IComponent, View, ViewManager, ICommand, ViewManagerMode, IHighlightConfig, IContextCommandSet, ISplitterConfig, Toast } from "@paperbits/common/ui";
import { Router } from "@paperbits/common/routing";
import { DragSession } from "@paperbits/common/ui/draggables";
import { IWidgetBinding } from "@paperbits/common/editing";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { RoleModel, BuiltInRoles } from "@paperbits/common/user";
import { DesignerUserService } from "./designerUserService";

declare let uploadDialog: HTMLInputElement;


@Component({
    selector: "view-manager",
    template: template
})
export class DefaultViewManager implements ViewManager {
    private contextualEditorsBag: Bag<IContextCommandSet> = {};

    public readonly designTime: ko.Observable<boolean>;
    public readonly previewable: ko.Observable<boolean>;
    public readonly block: ko.Computed<boolean>;
    public readonly journey: ko.ObservableArray<View>;
    public readonly journeyName: ko.Computed<string>;
    public readonly toasts: ko.ObservableArray<Toast>;
    public readonly primaryToolboxVisible: ko.Observable<boolean>;
    public readonly widgetEditor: ko.Observable<View>;
    public readonly contextualEditors: ko.ObservableArray<IContextCommandSet>;
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
    public readonly previewMode: ko.Observable<boolean>;
    public mode: ViewManagerMode;
    public hostDocument: Document;

    constructor(
        private readonly eventManager: EventManager,
        private readonly globalEventHandler: GlobalEventHandler,
        private readonly designerUserService: DesignerUserService,
        private readonly router: Router
    ) {
        this.designTime = ko.observable(false);
        this.previewable = ko.observable(true);
        this.previewMode = ko.observable(false);
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

        this.widgetEditor = ko.observable<View>();
        this.contextualEditors = ko.observableArray<IContextCommandSet>([]);
        this.highlightedElement = ko.observable<IHighlightConfig>();
        this.splitterElement = ko.observable<ISplitterConfig>();
        this.selectedElement = ko.observable<IHighlightConfig>();
        this.selectedElementContextualEditor = ko.observable<IContextCommandSet>();
        this.viewport = ko.observable<string>("xl");
        this.locale = ko.observable<string>("en-us");
        this.rolesScope = ko.observableArray([BuiltInRoles.anonymous]);
        this.host = ko.observable<IComponent>();
        this.shutter = ko.observable<boolean>(true);
        this.dragSession = ko.observable();
        this.primaryToolboxVisible = ko.observable<boolean>(false);

        this.previewMode.subscribe((previewMode) => {
            if (previewMode) {
                this.hideToolboxes()
            } else {
                this.showToolboxes();
            }
            this.designTime(!previewMode);
        });
        this.designTime.subscribe(() => {
            if (!this.previewMode()) {
                this.designTime(!this.previewMode());
            }
        })

        
    }

    @OnMounted()
    public initialize(): void {
        this.globalEventHandler.addDragEnterListener(this.hideToolboxes.bind(this));
        this.globalEventHandler.addDragDropListener(this.onDragEnd.bind(this));
        this.globalEventHandler.addDragEndListener(this.onDragEnd.bind(this));
        this.globalEventHandler.addDragLeaveScreenListener(this.showToolboxes.bind(this));
        this.eventManager.addEventListener("virtualDragEnd", this.onDragEnd.bind(this));

        this.router.addRouteChangeListener(this.onRouteChange.bind(this));
        this.globalEventHandler.appendDocument(document);

        this.eventManager.addEventListener("onEscape", this.closeEditors.bind(this));
        this.eventManager.addEventListener("onKeyDown", this.onKeyDown.bind(this));
        this.eventManager.addEventListener("onKeyUp", this.onKeyUp.bind(this));
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (this.getOpenView()) {
            return;
        }

        if (!event.ctrlKey && !event.metaKey) {
            return;
        }

        this.designTime(false);
    }

    private onKeyUp(event: KeyboardEvent): void {
        if (this.getOpenView()) {
            return;
        }

        if (event.ctrlKey || event.metaKey) {
            return;
        }

        this.designTime(true);
    }

    public setHost(component: IComponent): void {
        const currentComponent = this.host();

        if (currentComponent && currentComponent.name === component.name && !currentComponent.params) {
            return;
        }

        this.clearContextualEditors();
        this.host(component);
        this.previewable(component.name !== "style-guide");
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
        this.widgetEditor(null);
    }

    public hideToolboxes(): void {
        this.journey([]);
        this.primaryToolboxVisible(false);
        this.mode = ViewManagerMode.dragging;
        this.clearContextualEditors();
    }

    public showToolboxes(): void {
        this.primaryToolboxVisible(true);
        this.mode = ViewManagerMode.selecting;
    }

    public openViewAsWorkshop(view: View): void {
        this.clearContextualEditors();
        this.updateJourneyComponent(view);
        this.mode = ViewManagerMode.configure;
    }

    /**
     * Deletes specified editors and all editors after.
     * @param view View
     */
    public closeWorkshop(editor: View | string): void {
        const journey = this.journey();
        let view;

        if (typeof editor === "string") {
            view = journey.find(x => x.component.name === editor);
        }
        else {
            view = editor;
        }

        const indexOfClosingEditor = journey.indexOf(view);

        journey.splice(indexOfClosingEditor);

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

    public openViewAsPopup(view: View): void {
        if (this.widgetEditor() === view) {
            return;
        }

        view.component.params.onClose = () => this.closeView();

        this.clearContextualEditors();
        this.closeView();
        this.widgetEditor(view);
        this.mode = ViewManagerMode.configure;

        this.designTime(false); // Review: It's here for text editor
    }

    public getOpenView(): View {
        return this.widgetEditor();
    }

    public closeEditors(): void {
        const host = this.host();

        if (!this.getOpenView() && this.journey().length === 0 && host && host.name !== "page-host") {
            this.setHost({ name: "page-host" });
        }

        this.closeView();
        this.clearJourney();
    }

    public openWidgetEditor(binding: IWidgetBinding<any>): void {
        const view: View = {
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
        this.primaryToolboxVisible(true);
        this.designTime(true);
    }

    public togglePreviewMode(): void {
        this.previewMode(!this.previewMode());
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
        if (this.mode === ViewManagerMode.configure) {
            return;
        }

        this.contextualEditorsBag = {};
        this.contextualEditors([]);
        this.highlightedElement(null);
        this.setSplitter(null);
        this.selectedElement(null);
        this.selectedElementContextualEditor(null);
        this.designTime(true);
        this.mode = ViewManagerMode.selecting;
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

    public setViewRoles(roles: RoleModel[]): void {
        this.rolesScope(roles);
        this.designerUserService.setUserRoles(roles.map(role => role.key));
        this.eventManager.dispatchEvent("onUserRoleChange", roles);
    }

    public getViewRoles(): RoleModel[] {
        return this.rolesScope();
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
        this.hideToolboxes();
    }

    public getDragSession(): DragSession {
        return this.dragSession();
    }

    public onDragEnd(): void {
        this.showToolboxes();
        this.highlightedElement(null);
        this.selectedElement(null);
    }
}
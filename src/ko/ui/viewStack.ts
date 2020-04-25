import { EventManager } from "@paperbits/common/events";
import { View, ViewManager } from "@paperbits/common/ui";
import * as Utils from "@paperbits/common/utils";

export class ViewStack {
    private stack: View[];

    constructor(private readonly eventManager: EventManager) {
        this.stack = [];
        this.eventManager.addEventListener("onPointerDown", this.onPointerDown.bind(this));
        this.eventManager.addEventListener("onEscape", this.onEscape.bind(this));
    }

    private onPointerDown(event: MouseEvent): void {
        const tagetElement = <HTMLElement>event.target;
        const views = [...this.stack]; // clone array

        for (const view of views.reverse()) {
            let hit: boolean;

            if (view.hitTest) {
                hit = view.hitTest(tagetElement);
            }
            else {
                hit = !!Utils.closest(tagetElement, (node: HTMLElement) => node === view.element);
            }

            if (hit) {
                break;
            }

            this.stack.pop();
            view.close();
        }
    }

    private onEscape(): void {
        const topView = this.stack.pop();

        if (topView) {
            topView.close();

            if (topView.returnFocusTo) {
                topView.returnFocusTo.focus();
            }
        }
        else {
            this.eventManager.dispatchEvent("onTopLevelEscape");

            // if (!this.getOpenView() && this.journey().length === 0 && host && host.name !== "page-host") {
            //     this.setHost({ name: "page-host" }); // TODO: Get host type by current route.
            // }
        }
    }

    public pushView(view: View): void {
        this.stack.push(view);
    }

    public removeView(view: View): void {
        this.stack.remove(view);

        if (view.returnFocusTo) {
            view.returnFocusTo.focus();
        }
    }

    public getViews(): View[] {
        return [...this.stack]; // clone array
    }

    public clear(): void {
        this.stack = [];
    }
}
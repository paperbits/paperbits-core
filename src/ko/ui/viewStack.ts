import * as Utils from "@paperbits/common/utils";
import { EventManager } from "@paperbits/common/events";
import { View } from "@paperbits/common/ui";

export class ViewStack {
    private stack: View[];

    constructor(private readonly eventManager: EventManager) {
        this.stack = [];
        this.eventManager.addEventListener("onPointerDown", this.onPointerDown.bind(this));
        this.eventManager.addEventListener("onEscape", this.onEscape.bind(this));
    }

    private onPointerDown(event: MouseEvent): void {
        const targetElement = <HTMLElement>event.target;
        this.runHitTest(targetElement);
    }

    public runHitTest(targetElement: HTMLElement): void {
        const views = [...this.stack]; // clone array

        for (const view of views.reverse()) {
            let hit: boolean;

            if (view.hitTest) {
                hit = view.hitTest(targetElement);
            }
            else {
                hit = !!Utils.closest(targetElement, (node: HTMLElement) => node === view.element);
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
        }
    }

    public pushView(view: View): void {
        this.stack.push(view);
    }

    public removeView(view: View): void {
        this.stack.remove(view);
    }

    public getViews(): View[] {
        return [...this.stack]; // clone array
    }

    public clear(): void {
        this.stack.forEach(view => view.close());
        this.stack = [];
    }
}
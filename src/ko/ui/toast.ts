import * as ko from "knockout";
import { ICommand } from "@paperbits/common/ui";

export class Toast {
    public title: ko.Observable<string>;
    public content: ko.Observable<string>;
    public progress: ko.Observable<number>;
    public state: ko.Observable<string>;
    public commands: ko.ObservableArray<ICommand>;

    constructor(title: string, content: string, state: string = "progress", progress: number = 0, commands?: ICommand[]) {
        this.title = ko.observable<string>(title);
        this.content = ko.observable<string>(content);
        this.progress = ko.observable<number>();
        this.progress.subscribe(this.onProgressUpdate.bind(this));
        this.state = ko.observable<string>(state);
        this.commands = ko.observableArray(commands);

        this.progress(progress);
    }

    private onProgressUpdate(progress: number) {
        if (progress === 100) {
            this.state("success");
        }
    }
}
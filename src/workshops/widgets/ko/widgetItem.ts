export class WidgetItem {
    public name: string;
    public css: string;
    public iconUrl: string;
    public displayName: string;
    public category?: string;
    public createModel: () => unknown
}

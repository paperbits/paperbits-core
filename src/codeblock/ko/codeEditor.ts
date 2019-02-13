import * as ko from "knockout";
import { Code } from "./code";

export class CodeEditor {
    private htmlLang: AceLanguage;
    private objcLang: AceLanguage;
    private cppLangh: AceLanguage;
    private csharpLang: AceLanguage;
    private javaLang: AceLanguage;
    private jsLang: AceLanguage;
    private curlLang: AceLanguage;
    private code: ko.Observable<Code>;

    public languages: ko.ObservableArray<AceLanguage>;
    public languageMap: Array<AceLanguage>;
    public themes: ko.ObservableArray<string>;

    public selectedTheme: ko.Observable<string>;
    public selectedLanguage: ko.Observable<AceLanguage>;

    public lang: ko.Observable<string>;
    public text: ko.Observable<string>;

    constructor() {
        this.objcLang = new AceLanguage("Objective C", "objectivec");
        this.cppLangh = new AceLanguage("C++", "c_cpp");
        this.csharpLang = new AceLanguage("C#", "csharp");
        this.javaLang = new AceLanguage("Java", "java");
        this.jsLang = new AceLanguage("Java Script", "javascript");
        this.curlLang = new AceLanguage("Curl", "curl");
        this.htmlLang = new AceLanguage("HTML", "html");

        this.languages = ko.observableArray([
            this.curlLang,
            this.jsLang,
            this.javaLang,
            this.csharpLang,
            this.cppLangh,
            this.objcLang
        ]);

        this.languageMap = new Array();
        this.languageMap["curl"] = this.curlLang;
        this.languageMap["javascript"] = this.jsLang;
        this.languageMap["java"] = this.javaLang;
        this.languageMap["csharp"] = this.csharpLang;
        this.languageMap["c_cpp"] = this.cppLangh;
        this.languageMap["objectivec"] = this.objcLang;
        this.languageMap["html"] = this.htmlLang;

        this.themes = ko.observableArray([
            "ambiance",
            "chaos",
            "chrome",
            "clouds",
            "dawn"
        ]);

        this.code = ko.observable(null);

        this.selectedLanguage = ko.observable(null);
        this.selectedLanguage.subscribe(v => { this.code().lang(v.value); });

        this.selectedTheme = ko.observable(null);
        this.selectedTheme.subscribe(v => { this.code().theme(v); });

        this.text = ko.observable(null);
        this.text.subscribe(v => this.code().code(v));
    }

    public setWidgetModel(code: Code) {
        this.code = ko.observable(code);
        this.lang = ko.observable(code.lang());
        this.selectedLanguage(this.languageMap[this.lang()]);
        this.selectedTheme(code.theme());
        this.text(code.code());
        code.isEditable(true);
    }
}

export class AceLanguage {
    public text: string;
    public value: string;

    constructor(text: string, value: string) {
        this.text = text;
        this.value = value;
    }
}
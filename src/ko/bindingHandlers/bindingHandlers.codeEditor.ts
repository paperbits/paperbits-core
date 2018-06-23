import * as ko from "knockout";

ko.bindingHandlers["paperbits-code-editor"] = {
    init(element, valueAccessor, context) {
        // var aceEditor = ace.edit(element);
        // var viewModel = valueAccessor();

        // aceEditor.getSession().setMode("ace/mode/" + viewModel.lang());
        // aceEditor.setTheme("ace/theme/" + viewModel.theme());

        // aceEditor.setValue(viewModel.code());
        // aceEditor.setOptions({
        //     readOnly: true,
        //     highlightActiveLine: false,
        //     highlightGutterLine: false
        // });

        // aceEditor.getSession().on('change', () => {
        //     viewModel.code(aceEditor.getValue());
        // });

        // viewModel.isEditable.subscribe(isEditable => {
        //     if (isEditable) {
        //         aceEditor.setOptions({
        //             readOnly: false,
        //             highlightActiveLine: true,
        //             highlightGutterLine: true
        //         });
        //     } else {
        //         aceEditor.setOptions({
        //             readOnly: true,
        //             highlightActiveLine: false,
        //             highlightGutterLine: false
        //         });
        //     }
        // });
        // viewModel.lang.subscribe((value: string) => {
        //     aceEditor.getSession().setMode("ace/mode/" + value);
        // });

        // viewModel.theme.subscribe((value: string) => {
        //     aceEditor.setTheme("ace/theme/" + value);
        // });
    }
};
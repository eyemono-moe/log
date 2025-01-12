import * as monaco from "monaco-editor";

const actions: monaco.editor.IActionDescriptor[] = [
	{
		id: "toggle-word-wrap",
		label: "Toggle Word Wrap",
		keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
		run: (ed) => {
			const currentWrapping = ed.getOption(monaco.editor.EditorOption.wordWrap);
			const newWrapping = currentWrapping === "on" ? "off" : "on";
			ed.updateOptions({ wordWrap: newWrapping });
		},
		contextMenuGroupId: "appearance",
	},
];

export const addActions = (editor: monaco.editor.IStandaloneCodeEditor) => {
	for (const action of actions) {
		editor.addAction(action);
	}
};

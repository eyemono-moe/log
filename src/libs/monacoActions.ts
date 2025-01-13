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
	// Ctrl+Shift+ +/- でフォントサイズを変更
	{
		id: "zoom-in",
		label: "Zoom In",
		keybindings: [
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.Shift | monaco.KeyCode.NumpadAdd,
		],
		run: (ed) => {
			const currentFontSize = ed.getOption(monaco.editor.EditorOption.fontSize);
			ed.updateOptions({ fontSize: currentFontSize + 1 });
		},
		contextMenuGroupId: "zoom",
	},
	{
		id: "zoom-out",
		label: "Zoom Out",
		keybindings: [
			monaco.KeyMod.CtrlCmd |
				monaco.KeyCode.Shift |
				monaco.KeyCode.NumpadSubtract,
		],
		run: (ed) => {
			const currentFontSize = ed.getOption(monaco.editor.EditorOption.fontSize);
			ed.updateOptions({ fontSize: Math.max(1, currentFontSize - 1) });
		},
		contextMenuGroupId: "zoom",
	},
];

export const addActions = (editor: monaco.editor.IStandaloneCodeEditor) => {
	for (const action of actions) {
		editor.addAction(action);
	}
};

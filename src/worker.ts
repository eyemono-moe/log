import editorWorker from "monaco-editor/esm/vs/editor/editor.worker.js?worker";

self.MonacoEnvironment = {
	getWorker: () => {
		return new editorWorker();
	},
};

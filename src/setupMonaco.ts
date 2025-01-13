import textMateWorker from "@codingame/monaco-vscode-textmate-service-override/worker?worker";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker.js?worker";
import "@codingame/monaco-vscode-theme-defaults-default-extension";
import "@codingame/monaco-vscode-markdown-basics-default-extension";
import "@codingame/monaco-vscode-markdown-language-features-default-extension";
import "./assets/EyemonoRin.monoeye-0.1.6.vsix";
// import "./assets/yzhang.markdown-all-in-one-3.6.2.vsix";

type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
	TextEditorWorker: () => new editorWorker(),
	textMateWorker: () => new textMateWorker(),
};

window.MonacoEnvironment = {
	getWorker: (moduleId, label): Worker => {
		console.log("getWorker", moduleId, label);
		const workerFactory = workerLoaders[label];
		if (workerFactory != null) {
			return workerFactory();
		}
		throw new Error(`Unimplemented worker ${label} (${moduleId})`);
	},
};

// import "vscode/localExtensionHost";
import "./extensions";

import getConfigurationServiceOverride, {
	initUserConfiguration,
} from "@codingame/monaco-vscode-configuration-service-override";
// import getExtensionServiceOverride, {
// 	type WorkerConfig,
// } from "@codingame/monaco-vscode-extensions-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getModelServiceOverride from "@codingame/monaco-vscode-model-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import { initialize } from "vscode/services";
import vscodeSetting from "../../assets/vscode-settings.json?raw";

type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
	TextEditorWorker: () =>
		new Worker(
			new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
			{ type: "module" },
		),
	TextMateWorker: () =>
		new Worker(
			new URL(
				"@codingame/monaco-vscode-textmate-service-override/worker",
				import.meta.url,
			),
			{ type: "module" },
		),
};

window.MonacoEnvironment = {
	getWorker: (moduleId, label): Worker => {
		console.log(moduleId, label);
		const workerFactory = workerLoaders[label];
		if (workerFactory != null) {
			return workerFactory();
		}
		throw new Error(`Unimplemented worker ${label} (${moduleId})`);
	},
};

export const initMonaco = async () => {
	// const workerConfig: WorkerConfig = {
	// 	url: new URL(
	// 		"vscode/workers/extensionHost.worker",
	// 		import.meta.url,
	// 	).toString(),
	// 	options: { type: "module" },
	// };

	await initUserConfiguration(vscodeSetting);

	await initialize({
		// ...getExtensionServiceOverride(workerConfig),
		...getLanguagesServiceOverride(),
		...getThemeServiceOverride(),
		...getTextmateServiceOverride(),
		...getModelServiceOverride(),
		...getConfigurationServiceOverride(),
	});
};

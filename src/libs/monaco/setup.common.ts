import getConfigurationServiceOverride, {
	initUserConfiguration,
} from "@codingame/monaco-vscode-configuration-service-override";
import getDialogsServiceOverride from "@codingame/monaco-vscode-dialogs-service-override";
import getExplorerServiceOverride from "@codingame/monaco-vscode-explorer-service-override";
import {
	RegisteredFileSystemProvider,
	registerFileSystemOverlay,
} from "@codingame/monaco-vscode-files-service-override";
import getLanguageDetectionWorkerServiceOverride from "@codingame/monaco-vscode-language-detection-worker-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getLifecycleServiceOverride from "@codingame/monaco-vscode-lifecycle-service-override";
import getLogServiceOverride from "@codingame/monaco-vscode-log-service-override";
import getMarkersServiceOverride from "@codingame/monaco-vscode-markers-service-override";
import getModelServiceOverride from "@codingame/monaco-vscode-model-service-override";
import getMultiDiffEditorServiceOverride from "@codingame/monaco-vscode-multi-diff-editor-service-override";
import getNotificationServiceOverride from "@codingame/monaco-vscode-notifications-service-override";
import getOutlineServiceOverride from "@codingame/monaco-vscode-outline-service-override";
import getOutputServiceOverride from "@codingame/monaco-vscode-output-service-override";
import getPerformanceServiceOverride from "@codingame/monaco-vscode-performance-service-override";
import getPreferencesServiceOverride from "@codingame/monaco-vscode-preferences-service-override";
import getRelauncherServiceOverride from "@codingame/monaco-vscode-relauncher-service-override";
import getScmServiceOverride from "@codingame/monaco-vscode-scm-service-override";
import getSearchServiceOverride from "@codingame/monaco-vscode-search-service-override";
import getSnippetServiceOverride from "@codingame/monaco-vscode-snippets-service-override";
import getStorageServiceOverride from "@codingame/monaco-vscode-storage-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTimelineServiceOverride from "@codingame/monaco-vscode-timeline-service-override";
import getTreeSitterServiceOverride from "@codingame/monaco-vscode-treesitter-service-override";
import getUpdateServiceOverride from "@codingame/monaco-vscode-update-service-override";
import getBannerServiceOverride from "@codingame/monaco-vscode-view-banner-service-override";
import getStatusBarServiceOverride from "@codingame/monaco-vscode-view-status-bar-service-override";
import * as monaco from "monaco-editor";
import * as vscode from "vscode";
import type {
	IEditorOverrideServices,
	IWorkbenchConstructionOptions,
} from "vscode/services";
import type { EnvironmentOverride } from "vscode/workbench";
// import { Worker } from "./tools/crossOriginWorker";
// import { workerConfig } from "./tools/extHostWorker";
import defaultConfiguration from "./user/configuration.json?raw";
import "vscode/localExtensionHost";

export const workspaceFile = monaco.Uri.file("/workspace.log.eyemono.moe");

// export const userDataProvider = await createIndexedDBProviders();

export const fileSystemProvider = new RegisteredFileSystemProvider(false);
registerFileSystemOverlay(1, fileSystemProvider);

// Workers
export type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
	TextEditorWorker: () =>
		new Worker(
			new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
			{
				type: "module",
			},
		),
	TextMateWorker: () =>
		new Worker(
			new URL(
				"@codingame/monaco-vscode-textmate-service-override/worker",
				import.meta.url,
			),
			{ type: "module" },
		),
	OutputLinkDetectionWorker: () =>
		new Worker(
			new URL(
				"@codingame/monaco-vscode-output-service-override/worker",
				import.meta.url,
			),
			{ type: "module" },
		),
};
window.MonacoEnvironment = {
	getWorker: (moduleId, label) => {
		const workerFactory = workerLoaders[label];
		if (workerFactory != null) {
			return workerFactory();
		}
		throw new Error(`Unimplemented worker ${label} (${moduleId})`);
	},
};

// Set configuration before initializing service so it's directly available (especially for the theme, to prevent a flicker)
await Promise.all([initUserConfiguration(defaultConfiguration)]);

export const constructOptions: IWorkbenchConstructionOptions = {
	workspaceProvider: {
		trusted: true,
		async open() {
			return true;
		},
		workspace: {
			workspaceUri: workspaceFile,
		},
	},
	// configurationDefaults: {
	// 	// eslint-disable-next-line no-template-curly-in-string
	// 	"window.title": "Monaco-Vscode-Api${separator}${dirty}${activeEditorShort}",
	// },
	defaultLayout: {
		editors: [
			{
				uri: vscode.Uri.parse("/posts"),
			},
		],
		layout: undefined,
		views: undefined,
		force: false,
	},
};

export const envOptions: EnvironmentOverride = {
	// Otherwise, VSCode detect it as the first open workspace folder
	// which make the search result extension fail as it's not able to know what was detected by VSCode
	// userHome: vscode.Uri.file('/')
};

export const commonServices: IEditorOverrideServices = {
	// ...getExtensionServiceOverride(workerConfig),
	...getLogServiceOverride(),
	...getModelServiceOverride(),
	...getNotificationServiceOverride(),
	...getDialogsServiceOverride(),
	...getConfigurationServiceOverride(),
	...getTextmateServiceOverride(),
	...getTreeSitterServiceOverride(),
	...getThemeServiceOverride(),
	...getLanguagesServiceOverride(),
	...getPreferencesServiceOverride(),
	...getOutlineServiceOverride(),
	...getTimelineServiceOverride(),
	...getBannerServiceOverride(),
	...getStatusBarServiceOverride(),
	...getSnippetServiceOverride(),
	...getOutputServiceOverride(),
	...getSearchServiceOverride(),
	...getMarkersServiceOverride(),
	...getLanguageDetectionWorkerServiceOverride(),
	...getStorageServiceOverride({
		fallbackOverride: {
			"workbench.activity.showAccounts": false,
		},
	}),
	...getLifecycleServiceOverride(),
	...getScmServiceOverride(),
	...getMultiDiffEditorServiceOverride(),
	...getPerformanceServiceOverride(),
	...getRelauncherServiceOverride(),
	...getUpdateServiceOverride(),
	...getExplorerServiceOverride(),
};

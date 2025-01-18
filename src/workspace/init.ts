import { initialize as initializeMonacoService } from "vscode/services";

// Service overrides
import getConfigurationServiceOverride, {
	initUserConfiguration,
} from "@codingame/monaco-vscode-configuration-service-override";
import getDialogsServiceOverride from "@codingame/monaco-vscode-dialogs-service-override";
import getExplorerServiceOverride from "@codingame/monaco-vscode-explorer-service-override";
import type { WorkerConfig } from "@codingame/monaco-vscode-extensions-service-override";
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
import getQuickAccessServiceOverride from "@codingame/monaco-vscode-quickaccess-service-override";
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
import getWorkbenchServiceOverride from "@codingame/monaco-vscode-workbench-service-override";

// Workers
import TextMateWorkerUrl from "@codingame/monaco-vscode-textmate-service-override/worker?worker&url";
import EditorWorkerUrl from "vscode/workers/editor.worker?worker&url";
import ExtensionHostWorkerUrl from "vscode/workers/extensionHost.worker?worker&url";

import { Uri, workspace } from "vscode";
import { CrossOriginWorker, FakeWorker } from "./workers";

import "vscode/localExtensionHost";
import { activateDefaultExtensions } from "./extensions";
import { createFileSystemProvider } from "./fileSystem";

import userConfig from "./configuration.json?raw";

window.MonacoEnvironment = {
	getWorker(moduleId: string, label: string) {
		let url = "";

		switch (label) {
			case "TextEditorWorker":
				url = EditorWorkerUrl;
				break;
			case "TextMateWorker":
				url = TextMateWorkerUrl;
				break;
			default:
				throw new Error(`Unimplemented worker ${label} (${moduleId})`);
		}

		return new CrossOriginWorker(new URL(url, import.meta.url), {
			type: "module",
		});
	},
};

export const init = async (container: HTMLElement) => {
	const workspaceUri = Uri.file("/log.workspace");
	const fakeWorker = new FakeWorker(
		new URL(ExtensionHostWorkerUrl, import.meta.url),
		{
			type: "module",
			name: "vscode/extensionHostWorker",
		},
	);

	const workerConfig: WorkerConfig = {
		url: fakeWorker.url.toString(),
		options: fakeWorker.options,
	};

	await createFileSystemProvider();
	await initUserConfiguration(userConfig);

	await initializeMonacoService(
		{
			// did not work in dev
			// ...getExtensionsServiceOverride(workerConfig),
			...getConfigurationServiceOverride(),
			...getTextmateServiceOverride(),
			...getTreeSitterServiceOverride(),
			...getThemeServiceOverride(),
			...getLogServiceOverride(),
			...getModelServiceOverride(),
			...getNotificationServiceOverride(),
			...getDialogsServiceOverride(),
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
			...getWorkbenchServiceOverride(),
			...getQuickAccessServiceOverride({
				isKeybindingConfigurationVisible: () => true,
				shouldUseGlobalPicker: (_editor) => true,
			}),
		},
		container,
		{
			workspaceProvider: {
				trusted: true,
				async open() {
					return true;
				},
				workspace: {
					workspaceUri,
				},
			},
		},
		{},
	);

	await activateDefaultExtensions();

	// open workspace
	workspace.updateWorkspaceFolders(0, null, {
		uri: Uri.file("/posts"),
	});
};

import getQuickAccessServiceOverride from "@codingame/monaco-vscode-quickaccess-service-override";
import type { BrowserStorageService } from "@codingame/monaco-vscode-storage-service-override";
import getWorkbenchServiceOverride from "@codingame/monaco-vscode-workbench-service-override";
import {
	IStorageService,
	getService,
	initialize as initializeMonacoService,
} from "vscode/services";
// import "./features/customView.workbench";
import {
	commonServices,
	constructOptions,
	envOptions,
	// userDataProvider,
} from "./setup.common";

export const initWorkbench = async (container: HTMLElement) => {
	// Override services
	await initializeMonacoService(
		{
			...commonServices,
			...getWorkbenchServiceOverride(),
			...getQuickAccessServiceOverride({
				isKeybindingConfigurationVisible: () => true,
				shouldUseGlobalPicker: (_editor) => true,
			}),
		},
		container,
		constructOptions,
		envOptions,
	);
};

// const layoutService = await getService(IWorkbenchLayoutService);
// document.querySelector("#togglePanel")!.addEventListener("click", async () => {
//   layoutService.setPartHidden(
//     layoutService.isVisible(Parts.PANEL_PART, window),
//     Parts.PANEL_PART,
//   );
// });

// document
//   .querySelector("#toggleAuxiliary")!
//   .addEventListener("click", async () => {
//     layoutService.setPartHidden(
//       layoutService.isVisible(Parts.AUXILIARYBAR_PART, window),
//       Parts.AUXILIARYBAR_PART,
//     );
//   });

export async function clearStorage(): Promise<void> {
	// await userDataProvider.reset();
	await ((await getService(IStorageService)) as BrowserStorageService).clear();
}

// await registerExtension(
//   {
//     name: "demo",
//     publisher: "codingame",
//     version: "1.0.0",
//     engines: {
//       vscode: "*",
//     },
//   },
//   ExtensionHostKind.LocalProcess,
// ).setAsDefaultApi();

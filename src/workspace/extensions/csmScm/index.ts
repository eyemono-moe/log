import { ExtensionHostKind, registerExtension } from "vscode/extensions";
import type { IRelaxedExtensionManifest } from "vscode/vscode/vs/platform/extensions/common/extensions";
import { CmsSourceControl } from "./cmsSourceControl";

const manifest: IRelaxedExtensionManifest = {
	name: "scm-cms",
	publisher: "eyemono",
	engines: {
		vscode: "*",
	},
	version: "1.0.0",
	enabledApiProposals: ["scmActionButton"],
	contributes: {
		commands: [
			{
				command: "extension.source-control.commit",
				title: "Commit local changes to CMS",
				icon: {
					light: "resources/icons/light/check.svg",
					dark: "resources/icons/dark/check.svg",
				},
			},
			{
				command: "extension.source-control.refresh",
				title: "Refresh CMS status",
				icon: {
					light: "resources/icons/light/refresh.svg",
					dark: "resources/icons/dark/refresh.svg",
				},
			},
		],
		menus: {
			"scm/title": [
				{
					command: "extension.source-control.commit",
					group: "navigation",
					when: "scmProvider == cms",
				},
				{
					command: "extension.source-control.refresh",
					group: "navigation",
					when: "scmProvider == cms",
				},
				{
					command: "extension.source-control.browse",
					when: "scmProvider == cms",
				},
			],
		},
	},
};

const { getApi } = registerExtension(
	manifest,
	ExtensionHostKind.LocalProcess,

	{
		system: true, // to be able to use api proposals
	},
);

const activate = async () => {
	const api = await getApi();

	const scm = new CmsSourceControl(api);

	api.commands.registerCommand("extension.source-control.commit", async () => {
		await scm.commitAll();
	});
	api.commands.registerCommand("extension.source-control.refresh", async () => {
		await scm.refresh();
	});
};

export default activate;

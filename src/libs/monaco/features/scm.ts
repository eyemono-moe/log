import { ExtensionHostKind, registerExtension } from "vscode/extensions";
import { CmsSourceControl } from "./cmsScm/cmsSourceControl";

const { getApi } = registerExtension(
	{
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
				{
					command: "extension.source-control.discard",
					title: "Discards local changes to CMS",
					icon: {
						light: "resources/icons/light/discard.svg",
						dark: "resources/icons/dark/discard.svg",
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
						command: "extension.source-control.discard",
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
	},
	ExtensionHostKind.LocalProcess,
	{
		system: true, // to be able to use api proposals
	},
);

void getApi().then(async (vscode) => {
	const scm = new CmsSourceControl(vscode);

	vscode.commands.registerCommand("extension.source-control.commit", () => {
		console.log("Committing changes");
	});
	vscode.commands.registerCommand("extension.source-control.refresh", () => {
		scm.refresh();
	});
	vscode.commands.registerCommand("extension.source-control.discard", () => {
		console.log("Discarding changes");
	});
});

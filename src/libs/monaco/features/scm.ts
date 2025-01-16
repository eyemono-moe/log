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
	},
	ExtensionHostKind.LocalProcess,
	{
		system: true, // to be able to use api proposals
	},
);

void getApi().then(async (vscode) => {
	new CmsSourceControl(vscode);
	// console.log(vscode.workspace.workspaceFolders);
	// const test = vscode.workspace.createFileSystemWatcher('**/*.md');
	// test.onDidChange((uri) => {
	//   console.log('changed', uri)
	// })
	// test.onDidCreate((uri) => {
	//   console.log('created', uri)
	// })
	// test.onDidDelete((uri) => {
	//   console.log('deleted', uri)
	// })

	// console.log(test);

	// const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	// if (workspaceFolder == null) {
	// 	return;
	// }

	// vscode.commands.registerCommand("scm-cms.click-file", async (uri: Uri) => {
	// 	await vscode.commands.executeCommand("vscode.open", uri);
	// });
	// vscode.commands.registerCommand("scm-cms.commit", async () => {
	// 	await vscode.window.showInformationMessage("You've committed!");
	// });

	// const scm = vscode.scm.createSourceControl(
	// 	"cms-source-control",
	// 	"CMS Source Control",
	// 	workspaceFolder.uri,
	// );
	// scm.inputBox.visible = false;
	// scm.acceptInputCommand = {
	// 	command: "scm-cms.commit",
	// 	title: "Save",
	// };
	// scm.actionButton = {
	// 	command: {
	// 		command: "scm-cms.commit",
	// 		title: "Save",
	// 	},
	// 	enabled: true,
	// };
	// scm.quickDiffProvider = new CmsRepository();

	// const group = scm.createResourceGroup("working-tree", "Working Tree");

	// group.resourceStates = [
	// 	{
	// 		resourceUri: vscode.Uri.from({
	// 			scheme: "inmemory",
	// 			path: "/posts/250103-use-contentful.md",
	// 		}),
	// 		command: {
	// 			title: "Commit",
	// 			command: "scm-cms.click-file",
	// 			arguments: [
	// 				vscode.Uri.from({
	// 					scheme: "inmemory",
	// 					path: "/posts/250103-use-contentful.md",
	// 				}),
	// 			],
	// 		},
	// 	},
	// ];
});

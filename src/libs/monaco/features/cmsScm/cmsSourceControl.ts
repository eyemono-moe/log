import * as vscode from "vscode";
import { cloneRemoteContents } from "../../loadPosts";
import { toOriginalFileUri } from "../../util/uri";
import { CmsRepository } from "./cmsRepository";

export class CmsSourceControl implements vscode.Disposable {
	private cmsScm: vscode.SourceControl;
	private timeout: NodeJS.Timeout | undefined;
	private changedUris: Set<vscode.Uri> = new Set();
	private cmsRepository: CmsRepository;
	private changedResources: vscode.SourceControlResourceGroup;

	constructor(vscode: typeof import("vscode")) {
		this.cmsScm = vscode.scm.createSourceControl("cms", "Remote CMS");

		this.cmsScm.actionButton = {
			command: {
				command: "scm-cms.commit",
				title: "Save",
			},
			enabled: true,
		};
		this.cmsScm.inputBox.visible = false;

		this.cmsRepository = new CmsRepository();
		this.cmsScm.quickDiffProvider = this.cmsRepository;
		this.changedResources = this.cmsScm.createResourceGroup(
			"working-tree",
			"Changes",
		);

		const fileSystemWatcher =
			vscode.workspace.createFileSystemWatcher("/posts/**/*.*");

		fileSystemWatcher.onDidChange((uri) => this.onResourceChange([uri]));
		fileSystemWatcher.onDidCreate((uri) => this.onResourceChange([uri]));
		fileSystemWatcher.onDidDelete((uri) => this.onResourceChange([uri]));

		this.cloneRemoteContents();
	}

	async cloneRemoteContents() {
		await cloneRemoteContents();
		// 全てのファイルの変更を検知する
		const uris = await vscode.workspace.findFiles("/posts/**/*.*");
		this.onResourceChange(uris);
	}

	refresh() {
		this.cloneRemoteContents();
	}

	onResourceChange(uris: vscode.Uri[]): void {
		const newUris = new Set(uris);
		this.changedUris = this.changedUris.union(newUris);

		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.timeout = setTimeout(() => this.tryUpdateChangedResources(), 500);
	}

	async tryUpdateChangedResources(): Promise<void> {
		try {
			await this.updateChangedResources();
		} catch (ex) {
			console.error(ex);
			// vscode.window.showErrorMessage(ex);
		}
	}

	async isDirty(uri: vscode.Uri): Promise<boolean> {
		const original = await vscode.workspace.openTextDocument(
			toOriginalFileUri(uri),
		);
		const current = await vscode.workspace.openTextDocument(uri);
		const isDirty = original.getText() !== current.getText();
		return isDirty;
	}

	async updateChangedResources(): Promise<void> {
		const uris = Array.from(this.changedUris);
		this.changedUris.clear();

		const changedResources = await Promise.all(
			uris.map(async (uri) => {
				const isDirty = await this.isDirty(uri);
				return isDirty ? this.toSourceControlResourceState(uri) : null;
			}),
		);
		this.changedResources.resourceStates = changedResources.filter(
			(resource) => resource !== null,
		);
	}

	toSourceControlResourceState(
		contentUri: vscode.Uri,
	): vscode.SourceControlResourceState {
		const command: vscode.Command = {
			command: "vscode.diff",
			title: "Show Changes",
			tooltip: "Diff changes",
			arguments: [contentUri, toOriginalFileUri(contentUri)],
		};

		return {
			resourceUri: contentUri,
			command,
		};
	}

	dispose() {
		throw new Error("Method not implemented.");
	}
}

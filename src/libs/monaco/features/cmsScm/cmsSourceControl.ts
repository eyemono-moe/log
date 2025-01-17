import * as vscode from "vscode";
import {
	clientCreatePost,
	clientGetPosts,
	clientUpdatePost,
} from "../../../api";
import { updateFiles } from "../../loadPosts";
import { fileSystemProvider } from "../../setup.common";
import { getSlugFromUri, toOriginalFileUri } from "../../util/uri";
import { CmsRepository } from "./cmsRepository";

export class CmsSourceControl implements vscode.Disposable {
	private cmsScm: vscode.SourceControl;
	private timeout: NodeJS.Timeout | undefined;
	private changedUris: Map<string, vscode.Uri> = new Map();
	private cmsRepository: CmsRepository;
	private changedResources: vscode.SourceControlResourceGroup;

	constructor(vscode: typeof import("vscode")) {
		this.cmsScm = vscode.scm.createSourceControl("cms", "Remote CMS");
		this.cmsScm.actionButton = {
			command: {
				command: "extension.source-control.commit",
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

	/**
	 * CMS上のファイルを全てローカルにクローンする
	 */
	async cloneRemoteContents() {
		const posts = await clientGetPosts();
		await updateFiles(posts);
		// 全てのファイルの変更を検知する
		const uris = await vscode.workspace.findFiles("/posts/**/*.*");
		this.onResourceChange(uris);
	}

	async refresh() {
		// TODO: remoteで削除されたファイルをメモリから削除する
		this.changedUris.clear();
		return this.cloneRemoteContents();
	}

	async commitAll() {
		if (this.changedResources.resourceStates.length === 0) {
			vscode.window.showInformationMessage("No changes to commit.");
			return;
		}

		try {
			const updatedPosts = await Promise.all(
				(this.changedResources.resourceStates as Resource[]).map(async (r) => {
					const uri = r.resourceUri;
					const content = await readContent(uri);
					const slug = getSlugFromUri(uri);
					if (r.isCreated) {
						return clientCreatePost(slug, content);
					}
					return clientUpdatePost(slug, content);
				}),
			);
			await updateFiles(updatedPosts);
			this.changedResources.resourceStates = [];
			vscode.window.showInformationMessage(
				`Saved ${updatedPosts.length} files.`,
			);
		} catch (ex) {
			console.error(ex);
			if (ex instanceof Error) {
				vscode.window.showErrorMessage(ex.message);
			}
		}
	}

	onResourceChange(uris: vscode.Uri[]): void {
		this.changedUris = new Map([
			...this.changedUris,
			...uris.map((uri) => [uri.toString(), uri] as const),
		]);

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
		try {
			const original = await readContent(toOriginalFileUri(uri));
			const current = await readContent(uri);
			const isDirty = original !== current;
			return isDirty;
		} catch (ex) {
			// 新規作成されたファイルは存在しないためエラーになる
			if ((ex as vscode.FileSystemError).code === "EntryNotFound") {
				return true;
			}

			console.error(uri, ex);
			return false;
		}
	}

	async updateChangedResources(): Promise<void> {
		const uris = this.changedUris.values();

		const changedResources = await Promise.all(
			uris.map(async (uri) => {
				return this.toSourceControlResourceState(uri);
			}),
		);
		this.changedResources.resourceStates = changedResources.filter(
			(resource) => resource !== null,
		);
	}

	async toSourceControlResourceState(
		contentUri: vscode.Uri,
	): Promise<Resource | null> {
		const isOriginalExist = await getIsExist(toOriginalFileUri(contentUri));
		if (isOriginalExist) {
			const isDirty = await this.isDirty(contentUri);
			if (!isDirty) {
				return null;
			}
		}

		const command: vscode.Command = isOriginalExist
			? {
					command: "vscode.diff",
					title: "Show Changes",
					tooltip: "Diff changes",
					arguments: [contentUri, toOriginalFileUri(contentUri)],
				}
			: {
					command: "vscode.open",
					title: "Open File",
					arguments: [contentUri],
				};

		return {
			resourceUri: contentUri,
			isCreated: !isOriginalExist,
			command,
		};
	}

	dispose() {
		throw new Error("Method not implemented.");
	}
}

const readContent = async (uri: vscode.Uri) => {
	const doc = await vscode.workspace.openTextDocument(uri);
	return doc.getText();
};

const getIsExist = async (uri: vscode.Uri) => {
	try {
		await fileSystemProvider.stat(uri);
		return true;
	} catch (error) {
		return false;
	}
};

interface Resource extends vscode.SourceControlResourceState {
	isCreated?: boolean;
}

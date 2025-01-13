import {
	RegisteredFileSystemProvider,
	RegisteredMemoryFile,
	registerFileSystemOverlay,
} from "@codingame/monaco-vscode-files-service-override";
import { ReactiveMap } from "@solid-primitives/map";
import { type IDisposable, Uri, editor } from "monaco-editor";
import { createEffect, createSignal } from "solid-js";
import type { IReference, ITextFileEditorModel } from "vscode/monaco";
import type { ITextModel } from "vscode/vscode/vs/editor/common/model";

const [internalPreviewRawValue, setPreviewRawValue] = createSignal<string>("");
export const previewRawValue = internalPreviewRawValue;

export const openedEntrySignal = createSignal<string>();
export const loadedModelRefs = new ReactiveMap<
	string,
	IReference<ITextFileEditorModel>
>();
export const initialValues = new ReactiveMap<string, string | undefined>();
export const hasChangedMap = new ReactiveMap<string, boolean | undefined>();

export const openedModel = (): ITextModel | undefined => {
	const slug = openedEntrySignal[0]();
	if (!slug) return;
	return loadedModelRefs.get(slug)?.object.textEditorModel ?? undefined;
};

const fsProvider = new RegisteredFileSystemProvider(false);
export const overlayDisposable = registerFileSystemOverlay(1, fsProvider);
export const createModel = async (slug: string, content: string) => {
	const uri = Uri.from({ scheme: "file", path: slug });
	fsProvider.registerFile(new RegisteredMemoryFile(uri, content));
	const modelRef = await editor.createModelReference(uri);
	modelRef;
	const model = modelRef.object.textEditorModel;
	if (!model) return;
	editor.setModelLanguage(model, "markdown");
	console.log("model", model.getLanguageId());

	loadedModelRefs.set(slug, modelRef);
	initialValues.set(slug, content);
};

// modelが切り替わったらプレビューを更新
createEffect<IDisposable | undefined>((prevDispose) => {
	if (prevDispose) {
		prevDispose.dispose();
	}

	const model = openedModel();
	if (!model) {
		setPreviewRawValue("");
		return;
	}
	const content = model.getValue();
	setPreviewRawValue(content);

	// modelの変更を監視してプレビューを更新
	const dispose = model.onDidChangeContent(() => {
		const content = model.getValue();
		setPreviewRawValue(content);

		const slug = openedEntrySignal[0]();
		if (!slug) return;
		const initialValue = initialValues.get(slug);
		if (!initialValue) return;
		const hasChanged = initialValue !== content;
		hasChangedMap.set(slug, hasChanged);
	});

	return dispose;
});

export const resetInput = (slug: string) => {
	const model = loadedModelRefs.get(slug)?.object.textEditorModel;
	if (!model) return;
	const initialValue = initialValues.get(slug);
	if (!initialValue) return;
	model.setValue(initialValue);
};

export const closeModel = (slug: string) => {
	const modelRef = loadedModelRefs.get(slug);
	if (!modelRef) return;
	modelRef.dispose();
	loadedModelRefs.delete(slug);
	initialValues.delete(slug);
	hasChangedMap.delete(slug);

	if (openedEntrySignal[0]() === slug) {
		openedEntrySignal[1]();
	}
};

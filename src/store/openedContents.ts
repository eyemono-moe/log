import { ReactiveMap } from "@solid-primitives/map";
import { type IDisposable, Uri, editor } from "monaco-editor";
import { createEffect, createSignal } from "solid-js";

const [internalPreviewRawValue, setPreviewRawValue] = createSignal<string>("");
export const previewRawValue = internalPreviewRawValue;

export const openedEntrySignal = createSignal<string>();
export const loadedModels = new ReactiveMap<string, editor.ITextModel>();
export const initialValues = new ReactiveMap<string, string>();

export const openedModel = () => {
	const slug = openedEntrySignal[0]();
	return loadedModels.get(slug ?? "");
};

export const createModel = (slug: string, content: string) => {
	const model = editor.createModel(
		content,
		"markdown",
		Uri.from({ scheme: "inmemory", path: slug }),
	);

	loadedModels.set(slug, model);
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
	});

	return dispose;
});

export const hasChanged = () => {
	const slug = openedEntrySignal[0]();
	if (!slug) return false;
	const model = loadedModels.get(slug);
	if (!model) return false;
	const initialValue = initialValues.get(slug);
	const content = internalPreviewRawValue();
	return initialValue !== content;
};

export const resetInput = () => {
	const slug = openedEntrySignal[0]();
	const model = openedModel();
	if (!slug || !model) return;
	const initialValue = initialValues.get(slug);
	if (!initialValue) return;
	model.setValue(initialValue);
};

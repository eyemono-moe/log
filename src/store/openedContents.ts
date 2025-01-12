import { ReactiveMap } from "@solid-primitives/map";
import { Uri, editor } from "monaco-editor";
import { createEffect, createSignal } from "solid-js";

const [internalPreviewRawValue, setPreviewRawValue] = createSignal<string>("");
export const previewRawValue = internalPreviewRawValue;

export const openedEntrySignal = createSignal<string>();
export const loadedModels = new ReactiveMap<string, editor.ITextModel>();

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

	// modelの変更を監視してプレビューを更新
	model.onDidChangeContent(() => {
		const content = model.getValue();
		setPreviewRawValue(content);
	});
};

// modelが切り替わったらプレビューを更新
createEffect(() => {
	const model = openedModel();
	if (!model) {
		setPreviewRawValue("");
		return;
	}
	const content = model.getValue();
	setPreviewRawValue(content);
});

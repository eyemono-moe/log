import type * as monaco from "monaco-editor";
import { type Component, createSignal, onMount } from "solid-js";
import { initWorkbench } from "../../libs/monaco/setup.workbench";
// import { getClipboardItems } from "../../libs/clipboard";
// import { initMonaco } from "../../libs/monaco/init";
// import { uploadAndInsertURL } from "../../libs/monaco/uploadFile";
// import { addActions } from "../../libs/monacoActions";
// import { createMutationUploadFile } from "../../libs/query";
// import { overlayDisposable } from "../../store/openedContents";

const MonacoEditor: Component<{
	openedModel?: monaco.editor.ITextModel;
}> = (props) => {
	const [container, setContainer] = createSignal<HTMLDivElement>();

	onMount(() => {
		const _container = container();
		if (!_container) return;
		console.log("onMount");
		initWorkbench(_container);
	});

	// const disposes: (() => void)[] = [];

	// let editor: import("monaco-editor").editor.IStandaloneCodeEditor | null =
	// 	null;

	// const uploadFile = createMutationUploadFile();

	// onMount(async () => {
	// 	const _container = container();
	// 	if (!_container) return;

	// 	await initMonaco();

	editor = monaco.editor.create(_container, {
		language: "markdown",
		wordBasedSuggestions: "currentDocument",
		theme: "Monoeye",
		automaticLayout: true,
		minimap: {
			enabled: false,
		},
		padding: {
			top: 16,
		},
		lineNumbersMinChars: 2,
		wordWrap: "on",
	});

	// 	editor.setModel(props.openedModel ?? null);

	// 	addActions(editor);

	// 	const d = editor.onDidPaste(async () => {
	// 		if (!editor) return;
	// 		const currentModel = editor.getModel();
	// 		if (!currentModel) return;

	// 		// e.clipboardEvent?.clipboardData?.items が取得できないため、
	// 		// 代わりにnavigator.clipboard.read()を使う
	// 		// see: https://github.com/microsoft/monaco-editor/issues/4708
	// 		const items = await getClipboardItems();
	// 		if (!items) return;

	// 		const selection = editor.getSelection();
	// 		if (!selection) return;

	// 		const promises = items.map(async (item) => {
	// 			const imageType = item.types.find((type) => /^image\//.test(type));
	// 			if (!imageType) return;
	// 			const blob = await item.getType(imageType);
	// 			if (!blob) return;

	// 			await uploadAndInsertURL(
	// 				blob,
	// 				currentModel,
	// 				selection,
	// 				uploadFile.mutateAsync,
	// 			);
	// 		});

	// 		await Promise.all(promises);
	// 	});
	// 	disposes.push(d.dispose);
	// });

	// onCleanup(() => {
	// 	editor?.dispose();
	// 	overlayDisposable.dispose();
	// 	Promise.all(disposes.map((d) => d()));
	// });

	// createEffect(
	// 	on(
	// 		() => props.openedModel,
	// 		(newModel) => {
	// 			editor?.setModel(newModel ?? null);
	// 		},
	// 	),
	// );

	return (
		<div>
			test
			<div class="w-full h-full overflow-hidden" ref={setContainer} />
		</div>
	);
};

export default MonacoEditor;

import {
	type Component,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
} from "solid-js";
import "../../setupMonaco";
import getConfigurationServiceOverride, {
	updateUserConfiguration,
} from "@codingame/monaco-vscode-configuration-service-override";
import getExtensionServiceOverride, {
	type WorkerConfig,
} from "@codingame/monaco-vscode-extensions-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getModelServiceOverride from "@codingame/monaco-vscode-model-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import * as monaco from "monaco-editor";
import { initialize } from "vscode/services";
import vscodeSetting from "../../assets/vscode-settings.json?raw";
import { getClipboardItems } from "../../libs/clipboard";
import { addActions } from "../../libs/monacoActions";
import { createMutationUploadFile } from "../../libs/query";
import { overlayDisposable } from "../../store/openedContents";

const workerConfig: WorkerConfig = {
	url: new URL(
		"vscode/workers/extensionHost.worker",
		import.meta.url,
	).toString(),
	options: { type: "module" },
};

const MonacoEditor: Component<{
	openedModel?: monaco.editor.ITextModel;
}> = (props) => {
	const [container, setContainer] = createSignal<HTMLDivElement>();
	const disposes: (() => void)[] = [];

	let editor: import("monaco-editor").editor.IStandaloneCodeEditor | null =
		null;

	onMount(async () => {
		const _container = container();
		if (!_container) return;

		await initialize({
			...getModelServiceOverride(),
			...getExtensionServiceOverride(workerConfig),
			...getConfigurationServiceOverride(),
			...getThemeServiceOverride(),
			...getTextmateServiceOverride(),
			...getLanguagesServiceOverride(),
		});

		updateUserConfiguration(vscodeSetting);

		editor = monaco.editor.create(_container, {
			language: "markdown",
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

		editor.setModel(props.openedModel ?? null);

		addActions(editor);

		const uploadFile = createMutationUploadFile();
		const d = editor.onDidPaste(async () => {
			if (!editor) return;
			const currentModel = editor.getModel();
			if (!currentModel) return;

			// e.clipboardEvent?.clipboardData?.items が取得できないため、
			// 代わりにnavigator.clipboard.read()を使う
			// see: https://github.com/microsoft/monaco-editor/issues/4708
			const items = await getClipboardItems();
			if (!items) return;

			const selection = editor.getSelection();
			if (!selection) return;

			const promises = items.map(async (item) => {
				const imageType = item.types.find((type) => /^image\//.test(type));
				if (!imageType) return;
				const blob = await item.getType(imageType);
				if (!blob) return;

				const fileId = crypto.randomUUID();
				const magicString = `<!-- uploading file: ${fileId} -->`;

				currentModel.applyEdits([
					{
						range: new monaco.Range(
							selection.endLineNumber,
							selection.endColumn,
							selection.endLineNumber,
							selection.endColumn,
						),
						text: magicString,
					},
				]);

				const uploadedFile = await uploadFile.mutateAsync({
					file: new File([blob], fileId),
				});
				const url = uploadedFile.url;

				const insertRange = currentModel
					.findMatches(magicString, true, false, false, null, true)
					.at(0)?.range;

				if (!insertRange) return;

				currentModel.applyEdits([
					{
						range: insertRange,
						text: `![](${url})`,
					},
				]);
			});

			await Promise.all(promises);
		});
		disposes.push(d.dispose);
	});

	onCleanup(() => {
		editor?.dispose();
		overlayDisposable.dispose();
		Promise.all(disposes.map((d) => d()));
	});

	createEffect(
		on(
			() => props.openedModel,
			(newModel) => {
				editor?.setModel(newModel ?? null);
			},
		),
	);

	return <div class="w-full h-full overflow-hidden" ref={setContainer} />;
};

export default MonacoEditor;

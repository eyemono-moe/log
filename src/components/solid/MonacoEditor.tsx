import {
	type Component,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
} from "solid-js";
import "../../worker";
import * as monaco from "monaco-editor";
import { previewInputSignal } from "../../store/previewInput";

const MonacoEditor: Component = () => {
	const [container, setContainer] = createSignal<HTMLDivElement>();
	const [previewInput, setPreviewInput] = previewInputSignal;

	let editor: import("monaco-editor").editor.IStandaloneCodeEditor | null =
		null;

	let triggerByInput = false;

	onMount(() => {
		const _container = container();
		if (!_container) return;

		editor = monaco.editor.create(_container, {
			value: "# Hello, world!",
			language: "markdown",
			theme: "vs-dark",
			automaticLayout: true,
			minimap: {
				enabled: false,
			},
			padding: {
				top: 16,
			},
			lineNumbersMinChars: 2,
		});

		editor.onDidChangeModelContent;

		editor.onDidChangeModelContent(() => {
			// editor.setValue() で値を変更すると、このイベントが発火してしまうので、ループを防ぐ
			triggerByInput = true;
			setPreviewInput(editor?.getValue() ?? "");
			triggerByInput = false;
		});
	});

	onCleanup(() => {
		editor?.dispose();
	});

	createEffect(
		on(previewInput, (newValue) => {
			if (triggerByInput) return;
			editor?.setValue(newValue);
		}),
	);

	return <div class="w-full h-full" ref={setContainer} />;
};

export default MonacoEditor;

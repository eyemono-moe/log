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
import { addActions } from "../../libs/monacoActions";

const MonacoEditor: Component<{
	openedModel?: monaco.editor.ITextModel;
}> = (props) => {
	const [container, setContainer] = createSignal<HTMLDivElement>();

	let editor: import("monaco-editor").editor.IStandaloneCodeEditor | null =
		null;

	onMount(() => {
		const _container = container();
		if (!_container) return;

		editor = monaco.editor.create(_container, {
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
			wordWrap: "on",
		});

		editor.setModel(props.openedModel ?? null);

		addActions(editor);
	});

	onCleanup(() => {
		editor?.dispose();
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

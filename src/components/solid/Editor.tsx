import type { Component } from "solid-js";
import { previewInputSignal } from "../../store/previewInput";

const Editor: Component = () => {
	const [previewInput, setPreviewInput] = previewInputSignal;

	return (
		<div class="w-full h-full p-2">
			<textarea
				class="w-full h-full bg-primary b-1 p-2"
				value={previewInput()}
				onInput={(e) => setPreviewInput(e.currentTarget.value)}
			/>
		</div>
	);
};

export default Editor;

import type { Component } from "solid-js";
import { parseResult } from "../../store/previewInput";
const Preview: Component = () => {
	// TODO: debounce preview
	const preview = () => parseResult().toString();

	return <div innerHTML={preview()} />;
};

export default Preview;

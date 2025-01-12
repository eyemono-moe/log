import type { Component } from "solid-js";
import { previewParseResult } from "../../store/previewInput";
const Preview: Component = () => {
	// TODO: debounce preview
	const preview = () => previewParseResult().toString();

	return <div innerHTML={preview()} />;
};

export default Preview;

import type { Component } from "solid-js";
import { previewParseResult } from "../../store/previewInput";

const PreviewHTML: Component = () => {
	// TODO: debounce preview
	const preview = () => previewParseResult().toString();

	return <div innerHTML={preview()} />;
};

export default PreviewHTML;

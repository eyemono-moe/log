import * as monaco from "monaco-editor";

export const uploadAndInsertURL = async (
	blob: Blob,
	targetModel: monaco.editor.ITextModel,
	selection: monaco.Selection,
	uploadFile: (props: { file: File }) => Promise<{ url: string }>,
) => {
	const fileId = `${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2)}`;
	const magicString = `<!-- uploading file: ${fileId} -->`;

	targetModel.applyEdits([
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

	const uploadedFile = await uploadFile({
		file: new File([blob], fileId),
	});
	const url = uploadedFile.url;

	const insertRange = targetModel
		.findMatches(magicString, true, false, false, null, true)
		.at(0)?.range;

	if (!insertRange) return;

	targetModel.applyEdits([
		{
			range: insertRange,
			text: `![](${url})`,
		},
	]);
};

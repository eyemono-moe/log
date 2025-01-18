// Languages
import "@codingame/monaco-vscode-html-default-extension";
import "@codingame/monaco-vscode-css-default-extension";
import "@codingame/monaco-vscode-typescript-basics-default-extension";
import "@codingame/monaco-vscode-markdown-basics-default-extension";

// Language servers
import "@codingame/monaco-vscode-markdown-language-features-default-extension";

// Themes
import "../assets/EyemonoRin.monoeye-0.1.6.vsix";

// Other
import "../assets/DavidAnson.vscode-markdownlint-0.58.1.vsix";
// import "@codingame/monaco-vscode-media-preview-default-extension";
// import "@codingame/monaco-vscode-search-result-default-extension";
// import "@codingame/monaco-vscode-emmet-default-extension";

// // Custom
import activateCmsScm from "./extensions/csmScm";

async function activateDefaultExtensions() {
	await Promise.all([activateCmsScm()]);
}

export { activateDefaultExtensions };

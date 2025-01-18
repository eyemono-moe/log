import {
	RegisteredFileSystemProvider,
	registerFileSystemOverlay,
} from "@codingame/monaco-vscode-files-service-override";

let fileSystemProvider: RegisteredFileSystemProvider;

const createFileSystemProvider = async () => {
	fileSystemProvider = new RegisteredFileSystemProvider(false);
	registerFileSystemOverlay(1, fileSystemProvider);
};

export { fileSystemProvider, createFileSystemProvider };

// see: https://github.com/CodinGame/monaco-vscode-api/blob/c228c61f6dbcfebeeffa6769373ff356abacc0e3/demo/src/tools/crossOriginWorker.ts
class CrossOriginWorker extends Worker {
	constructor(url: string | URL, options: WorkerOptions = {}) {
		const fullUrl = new URL(url, location.href).href;
		const js =
			options.type === "module"
				? `import '${fullUrl}';`
				: `importScripts('${fullUrl}');`;
		const blob = new Blob([js], { type: "application/javascript" });
		super(URL.createObjectURL(blob), options);
	}
}

class FakeWorker {
	constructor(
		public url: string | URL,
		public options?: WorkerOptions,
	) {}
}

export { CrossOriginWorker, FakeWorker };

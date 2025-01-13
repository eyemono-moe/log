export const getClipboardItems = async () => {
	try {
		const permissionStatus = await navigator.permissions.query({
			name: "clipboard-read" as PermissionName,
		});
		if (
			permissionStatus.state === "granted" ||
			permissionStatus.state === "prompt"
		) {
			if (navigator.clipboard.read) {
				return await navigator.clipboard.read();
			}
			console.warn(
				"navigator.clipboard.read is not supported in this browser.",
			);
		}
		console.warn("Clipboard-read permission not granted");
	} catch (error) {
		console.error("Failed to read from clipboard:", error);
	}
};

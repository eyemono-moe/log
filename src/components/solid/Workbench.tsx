import { type Component, createSignal, onMount } from "solid-js";
import initWorkbench from "../../libs/monaco/main.workbench";
import { createQueryGetPosts } from "../../libs/query";

const Workbench: Component = () => {
	const [container, setContainer] = createSignal<HTMLDivElement>();
	const posts = createQueryGetPosts();

	onMount(async () => {
		const containerElement = container();
		if (!containerElement) return;

		await initWorkbench(containerElement);
	});

	// createEffect(() => {
	// 	if (posts.status === "success") {
	// 		registerPostsFile(posts.data);
	// 	}
	// });

	return (
		<div class="w-full h-full">
			<div ref={setContainer} class="w-full h-full" />
		</div>
	);
};

export default Workbench;

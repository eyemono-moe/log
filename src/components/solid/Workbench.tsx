import { type Component, createSignal, onMount } from "solid-js";
import { createQueryGetPosts } from "../../libs/query";
import { init } from "../../workspace/init";

const Workbench: Component = () => {
	const [container, setContainer] = createSignal<HTMLDivElement>();
	const posts = createQueryGetPosts();

	onMount(async () => {
		const containerElement = container();
		if (!containerElement) return;

		// await initWorkbench(containerElement);
		await init(containerElement);
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

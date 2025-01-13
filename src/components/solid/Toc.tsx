import type { MarkdownHeading } from "astro";
import { type Component, For } from "solid-js";

const Toc: Component<{
	headings: MarkdownHeading[];
}> = (props) => {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div class="p-2 max-h-full overflow-y-auto space-y-2">
			<div>目次</div>
			<button
				class="text-left appearance-none inline-flex items-center gap-1"
				type="button"
				id="scroll-to-top"
				onClick={scrollToTop}
			>
				<div class="h-1lh w-auto aspect-square i-material-symbols:arrow-upward-alt-rounded" />
				ページトップへ
			</button>
			<ul class="ml-2">
				<For each={props.headings}>
					{(heading) => (
						<li
							classList={{
								"ml-4": heading.depth === 3,
								"ml-8": heading.depth === 4,
							}}
						>
							<a
								href={`#${heading.slug}`}
								class="line-clamp-3 decoration-none op-70 hover:op-100"
							>
								{heading.text}
							</a>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
};

export default Toc;

import type { MarkdownHeading } from "astro";
import { format } from "date-fns";
import { type ParentComponent, Show } from "solid-js";
import Toc from "./Toc";

const Post: ParentComponent<{
	title: string;
	createdAt: string;
	updatedAt?: string;
	headings: MarkdownHeading[];
}> = (props) => {
	return (
		<article class="@container">
			<header>
				<h1 class="max-w-800px mx-auto px-4 text-left w-fit">
					<span>{props.title}</span>
				</h1>
				<div class="max-w-1200px mx-auto px-4 @md:px-8 text-sm">
					<time datetime={props.createdAt} class="flex items-center gap-0.5">
						<div class="size-0.8lh i-material-symbols:edit-calendar-outline-rounded" />
						Created at:
						{format(props.createdAt, "yyyy/MM/dd")}
					</time>
					<Show when={props.updatedAt}>
						{(updatedAt) => (
							<time datetime={updatedAt()} class="flex items-center gap-0.5">
								<div class="size-0.8lh i-material-symbols:sync-rounded" />
								Updated at:
								{format(updatedAt(), "yyyy/MM/dd")}
							</time>
						)}
					</Show>
				</div>
			</header>
			<div class="max-w-1200px mx-auto px-4 @md:px-8 @[1200px]:(grid grid-cols-[minmax(0,1fr)_16rem] justify-center gap-4)">
				<section class="all-[a]:text-link post">{props.children}</section>
				<aside class="hidden @[1200px]:block">
					<div class="sticky top-[calc(3.5rem)]">
						<div class="max-h-[calc(100vh-3.5rem)] flex">
							<Toc headings={props.headings} />
						</div>
					</div>
				</aside>
			</div>
		</article>
	);
};

export default Post;

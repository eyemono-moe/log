import { type Component, For } from "solid-js";
import { extractFrontmatter } from "../../libs/extractFrontmatter";
import { createQueryGetPosts } from "../../libs/query";
import { loadedModels } from "../../store/openedContents";

const Entries: Component<{
	openedSlug?: string;
	handleSelectEntry: (slug: string) => void;
}> = (props) => {
	const q = createQueryGetPosts();

	return (
		<div class="flex flex-col p-1 max-w-50 overflow-y-auto">
			<For each={q.data}>
				{(entry) => {
					const title = extractFrontmatter(entry.content)?.title as
						| string
						| undefined;
					return (
						<button
							class="text-sm text-start w-full rounded px-2 py-1 space-y-0.5 hover:not-[[data-active]]:(bg-zinc-2/50 dark:bg-zinc-8/50) data-[opened]:not-[[data-active]]:(bg-zinc-2/40 dark:bg-zinc-8/40) data-[active]:(bg-accent-2/30 dark:bg-accent-8/30)"
							type="button"
							onClick={() => props.handleSelectEntry(entry.slug)}
							data-opened={loadedModels.has(entry.slug) ? "" : undefined}
							data-active={entry.slug === props.openedSlug ? "" : undefined}
						>
							<div class="truncate">{title ?? "no title"}</div>
							<div class="op-70 truncate">{entry.slug}</div>
							<div class="flex gap-1">
								<div
									class="text-sm op-70 flex items-center gap-0.5"
									title={`Created at ${entry.createdAt}`}
								>
									<span class="shrink-0 inline-block i-material-symbols:edit-outline-rounded size-0.8lh" />

									<span class="truncate">
										{new Date(entry.createdAt).toLocaleDateString()}
									</span>
								</div>
								<div
									class="text-sm op-70 flex items-center gap-0.5"
									title={`Updated at ${entry.updatedAt}`}
								>
									<span class="shrink-0 inline-block i-material-symbols:sync-rounded size-0.8lh" />

									<span class="truncate">
										{new Date(entry.updatedAt).toLocaleDateString()}
									</span>
								</div>
							</div>
						</button>
					);
				}}
			</For>
		</div>
	);
};

export default Entries;

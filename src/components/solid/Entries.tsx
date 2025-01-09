import { type Component, For } from "solid-js";
import { createQueryGetPosts } from "../../libs/query";

const Entries: Component<{
	handleSelectEntry: (slug: string) => void;
}> = (props) => {
	const q = createQueryGetPosts();

	return (
		<div class="flex flex-col p-1">
			<For each={q.data}>
				{(entry) => (
					<button
						class="text-start w-full max-w-50 rounded px-2 py-1 hover:(bg-zinc-2/50 dark:bg-zinc-8/50) "
						type="button"
						onClick={() => props.handleSelectEntry(entry.slug)}
					>
						<div class="truncate">{entry.slug}</div>
						<div
							class="text-sm op-70 items-center flex items-center gap-1"
							title={`Created at ${entry.createdAt}`}
						>
							<span class="shrink-0 inline-block i-material-symbols:edit-outline-rounded size-0.8lh" />
							<span class="truncate">
								{new Date(entry.createdAt).toLocaleDateString()}
							</span>
						</div>
					</button>
				)}
			</For>
		</div>
	);
};

export default Entries;

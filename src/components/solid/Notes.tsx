// import { createViewportObserver } from "@solid-primitives/intersection-observer";
import { createRxForwardReq, now, uniq } from "rx-nostr";
import { map, scan } from "rxjs";
import { type Component, For, from, Match, onMount, Switch } from "solid-js";
import { useRxNostr } from "../../provider/nostr";
import { createInfiniteEvent } from "../../utils/nostr/createInfiniteEvent";
import { parseEventPacket } from "../../utils/nostr/parser";
import TextNote from "./TextNote";

const pageSize = 25;
const eyemonoPubkey =
	"dbe6fc932b40d3f322f3ce716b30b4e58737a5a1110908609565fb146f55f44a";

const toArrayScan = <T,>(reverse?: boolean) =>
	scan<T, T[]>((acc, x) => (reverse ? [x, ...acc] : [...acc, x]), []);

const Notes: Component = () => {
	const rxNostr = useRxNostr();

	const latestRxReq = createRxForwardReq();

	const latestEvents = from(
		rxNostr.use(latestRxReq).pipe(
			uniq(),
			map((e) => parseEventPacket(e)),
			toArrayScan(),
		),
	);

	const {
		data: oldEvents,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = createInfiniteEvent(rxNostr, pageSize, {
		kinds: [1],
		authors: [eyemonoPubkey],
	});

	onMount(() => {
		latestRxReq.emit({
			kinds: [1],
			authors: [eyemonoPubkey],
			since: now,
		});
		fetchNextPage();
	});

	// // @ts-ignore(6133) typescript can't detect `use` directive
	// const [intersectionObserver] = createViewportObserver();

	return (
		<div class="space-y-2">
			{/* @ts-ignore: latestEventsの中はShortTextNoteのみ */}
			<For each={latestEvents()}>{(event) => <TextNote event={event} />}</For>
			<For each={oldEvents.pages}>
				{(page) => (
					// @ts-ignore: eventはShortTextNoteのみ
					<For each={page}>{(event) => <TextNote event={event} />}</For>
				)}
			</For>
			{/* <div
  use:intersectionObserver={(e) => {
    if (hasNextPage() && !isFetching() && e.isIntersecting) {
      fetchNextPage();
      }
      }}
      /> */}
			<button
				class="rounded w-full text-center bg-transparent p-6 enabled:hover:(bg-zinc-50 dark:bg-zinc-8/50) transition-[background-color] disabled:opacity-50 data-[loading='true']:cursor-progress"
				type="button"
				onClick={fetchNextPage}
				disabled={!hasNextPage() || isFetching()}
				data-loading={isFetching()}
			>
				<Switch fallback="load more">
					<Match when={isFetching()}>loading...</Match>
					<Match when={!hasNextPage()}>No more events</Match>
				</Switch>
			</button>
		</div>
	);
};

export default Notes;

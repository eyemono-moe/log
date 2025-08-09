import type { Filter } from "nostr-tools";
import {
	compareEvents,
	createRxBackwardReq,
	type RxNostr,
	uniq,
} from "rx-nostr";
import { map } from "rxjs";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { type ParsedEventPacket, parseEventPacket } from "./parser";

export const createInfiniteEvent = (
	rxNostr: RxNostr,
	pageSize: number,
	filter: Filter,
) => {
	const [data, setData] = createStore<{
		pages: ParsedEventPacket[][];
	}>({
		pages: [],
	});
	const [isFetching, setIsFetching] = createSignal(false);
	const [hasNextPage, setHasNextPage] = createSignal(false);

	/** 取得済みイベントの中で最も古いイベントのcreated_at */
	let oldestCreatedAt: number | undefined = Math.floor(Date.now() / 1000);

	const fetchNextPage = async () => {
		const rxReq = createRxBackwardReq();
		setIsFetching(true);

		const page = await new Promise<ParsedEventPacket[]>((resolve) => {
			const events: ParsedEventPacket[] = [];
			rxNostr
				.use(rxReq)
				.pipe(
					uniq(),
					map(parseEventPacket), // 取得したイベントをパース
				)
				.subscribe({
					next: (e) => {
						events.push(e);
					},
					complete: () => {
						const sliced = events
							.sort((a, b) => -compareEvents(a.raw, b.raw))
							.slice(0, pageSize);

						oldestCreatedAt = sliced.at(-1)?.raw.created_at;

						resolve(sliced);
					},
				});

			if (oldestCreatedAt) {
				rxReq.emit({
					...filter,
					limit: pageSize,
					until: oldestCreatedAt - 1,
				});
			}
			rxReq.over();
		});
		if (page.length > 0) {
			setData("pages", data.pages.length, page);
		}
		setIsFetching(false);

		if (page.length < pageSize) {
			setHasNextPage(false);
		} else {
			setHasNextPage(true);
		}
	};

	return {
		data,
		isFetching,
		hasNextPage,
		fetchNextPage,
	};
};

import { createRxBackwardReq, uniq } from "rx-nostr";
import { map } from "rxjs";
import { createEffect, from } from "solid-js";
import { useRxNostr } from "../../provider/nostr";
import { type ParsedEventPacket, parseEventPacket } from "./parser";
import type { Metadata } from "./parser/0_metadata";

export const useProfile = (pubkey: () => string) => {
	const rxNostr = useRxNostr();
	const req = createRxBackwardReq();
	const user = from(
		rxNostr.use(req).pipe(
			uniq(),
			map((e) => parseEventPacket(e) as ParsedEventPacket<Metadata>),
		),
	);

	createEffect(() => {
		req.emit({
			kinds: [0],
			authors: [pubkey()],
		});
	});

	return user;
};

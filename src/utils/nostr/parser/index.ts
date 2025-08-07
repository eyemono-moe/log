import { kinds, type NostrEvent } from "nostr-tools";
import type { EventPacket } from "rx-nostr";
import { parseMetadata } from "./0_metadata";
import { parseShortTextNote } from "./1_shortTextNote";

export const parseNostrEvent = (input: NostrEvent) => {
	switch (input.kind) {
		case kinds.Metadata:
			return parseMetadata(input);
		case kinds.ShortTextNote:
			return parseShortTextNote(input);
		default:
			throw new Error(`[parseNostrEvent] unknown kind: ${input.kind}`);
	}
};

export const parseEventPacket = (input: EventPacket) => {
	return {
		from: input.from,
		raw: input.event,
		parsed: parseNostrEvent(input.event),
	};
};

export type ParsedEventPacket<T = ReturnType<typeof parseNostrEvent>> = {
	from: string;
	raw: NostrEvent;
	parsed: T;
};

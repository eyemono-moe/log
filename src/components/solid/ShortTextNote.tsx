import type { Component } from "solid-js";
import type { ParsedEventPacket } from "../../utils/nostr/parser/1_shortTextNote";

const ShortTextNote: Component<{
	event: ParsedEventPacket;
}> = (props) => {
	return (
		<div class="b-1 b-zinc-auto rounded p-2">
			<div class="break-anywhere whitespace-pre-wrap [line-break:strict] [word-break:normal]">
				{props.event.parsed.content}
			</div>
			<div class="text-sm c-secondary">
				{new Date(props.event.raw.created_at * 1000).toLocaleString()}
			</div>
		</div>
	);
};

export default ShortTextNote;

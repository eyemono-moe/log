import { neventEncode } from "nostr-tools/nip19";
import { type Component, For, Match, Switch } from "solid-js";
import type { ParsedEventPacket } from "../../utils/nostr/parser";
import type { ShortTextNote } from "../../utils/nostr/parser/1_shortTextNote";
import { parseTextContent } from "../../utils/nostr/parser/textContent";
import EmbedUser from "./EmbedUser";
import RichLink from "./RichLink";

const TextNote: Component<{
	event: ParsedEventPacket<ShortTextNote>;
}> = (props) => {
	const parsedContents = () =>
		parseTextContent(props.event.parsed.content, props.event.parsed.tags);

	return (
		<div class="b-1 b-zinc-auto rounded p-2">
			<div class="break-anywhere whitespace-pre-wrap [line-break:strict] [word-break:normal]">
				<For each={parsedContents()}>
					{(content) => (
						<Switch>
							<Match when={content.type === "text" && content}>
								{(c) => <span>{c().content}</span>}
							</Match>
							<Match when={content.type === "image" && content}>
								{(c) => (
									<a
										href={c().src}
										target="_blank"
										rel="noopener noreferrer"
										class="block"
									>
										<img
											class="b-1 b-zinc-auto h-auto w-full overflow-hidden rounded"
											src={c().src}
											alt={c().alt ?? ""}
											width={c().size?.width}
											height={c().size?.height}
											loading="lazy"
										/>
									</a>
								)}
							</Match>
							<Match when={content.type === "video" && content}>
								{(c) => (
									// biome-ignore lint/a11y/useMediaCaption: キャプションの投稿手段が無い
									<video
										class="b-1 b-zinc-auto h-auto w-full rounded object-contain"
										controls
										preload="metadata"
										src={c().href}
									/>
								)}
							</Match>
							<Match when={content.type === "emoji" && content}>
								{(c) => (
									<img
										class="inline-block h-6 w-auto max-w-full object-contain"
										src={c().url}
										alt={c().tag}
										title={c().tag}
										loading="lazy"
									/>
								)}
							</Match>
							<Match when={content.type === "link" && content}>
								{(c) => <RichLink href={c().href} content={c().content} />}
							</Match>
							<Match when={content.type === "mention" && content}>
								{(c) => <EmbedUser pubkey={c().pubkey} relay={c().relay} />}
							</Match>
							<Match when={content.type === "quoteByID" && content}>
								{(c) => (
									<span class="break-anywhere whitespace-pre-wrap text-link">
										nostr:
										{neventEncode({ id: c().id })}
									</span>
									// <Show
									// 	when={props.showQuoteEmbeds}
									// >
									// 	<div class="b-1 group/quote overflow-hidden rounded">
									// 		<EventByID id={c().id} small />
									// 	</div>
									// </Show>
								)}
							</Match>
							<Match when={content.type === "hashtag" && content}>
								{(c) => <span>#{c().tag}</span>}
							</Match>
						</Switch>
					)}
				</For>
			</div>
			<div class="text-sm c-secondary">
				{new Date(props.event.raw.created_at * 1000).toLocaleString()}
			</div>
		</div>
	);
};

export default TextNote;

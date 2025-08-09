import { npubEncode } from "nostr-tools/nip19";
import { type Component, createMemo, Show } from "solid-js";
import { useProfile } from "../../utils/nostr/query";

const EmbedUser: Component<{
	pubkey: string;
	relay?: string;
	class?: string;
}> = (props) => {
	const profile = useProfile(() => props.pubkey);
	const encodedPubkey = createMemo(() => npubEncode(props.pubkey));

	return (
		<a
			href={`https://njump.me/${encodedPubkey()}`}
			class="text-link"
			rel="noopener noreferrer"
			target="_blank"
		>
			<Show when={profile()} fallback={`@${encodedPubkey().slice(0, 12)}`}>
				{`@${profile()?.parsed.display_name || profile()?.parsed.name || encodedPubkey().slice(0, 12)}`}
			</Show>
		</a>
	);
};

export default EmbedUser;

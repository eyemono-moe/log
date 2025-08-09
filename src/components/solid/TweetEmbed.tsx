import { type Component, createEffect } from "solid-js";
import { convertToDetectableTwitterUrl } from "../../features/rich-link/utils";
import "../../features/rich-link/types";

const TweetEmbed: Component<{ url: string }> = (props) => {
	let twitterRef: HTMLDivElement | undefined;

	createEffect(() => {
		window.twttr?.widgets?.load(twitterRef);
	});

	return (
		<div ref={twitterRef}>
			<blockquote class="twitter-tweet" data-conversation="none">
				<a
					href={convertToDetectableTwitterUrl(props.url)}
					target="_blank"
					rel="noopener noreferrer"
					class="break-anywhere whitespace-pre-wrap text-link"
				>
					{props.url}
				</a>
			</blockquote>
		</div>
	);
};

export default TweetEmbed;

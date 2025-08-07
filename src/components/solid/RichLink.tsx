import { type Component, Match, Switch } from "solid-js";
import { RICH_LINK } from "../../features/rich-link/constants";
import { isTwitterUrl } from "../../features/rich-link/utils";
import { useQueryEmbed } from "../../utils/nostr/ogp";
import TweetEmbed from "./TweetEmbed";

const RichLink: Component<{
	href: string;
	content: string;
}> = (props) => {
	const embed = useQueryEmbed(() => props.href);

	return (
		<Switch
			fallback={
				<a
					href={props.href}
					target="_blank"
					rel="noopener noreferrer"
					class="break-anywhere line-clamp-4 text-ellipsis whitespace-pre-wrap text-link"
				>
					{props.content}
				</a>
			}
		>
			<Match when={isTwitterUrl(props.href)}>
				<TweetEmbed url={props.href} />
			</Match>
			<Match when={embed.data?.type === "oEmbed" && embed.data}>
				{(embed) => (
					<>
						<a
							href={props.href}
							target="_blank"
							rel="noopener noreferrer"
							class="break-anywhere line-clamp-2 text-ellipsis whitespace-pre-wrap text-link"
						>
							{props.content}
						</a>
						<div innerHTML={embed().value.html} />
					</>
				)}
			</Match>
			<Match when={embed.data?.type === "ogp" && embed.data}>
				{(embed) => (
					<>
						<a
							href={props.href}
							target="_blank"
							rel="noopener noreferrer"
							class="break-anywhere line-clamp-2 w-fit text-ellipsis whitespace-pre-wrap text-link"
						>
							{props.content}
						</a>
						<a
							class="rlc-container"
							href={embed().value.url ?? props.href}
							rel="noopener noreferrer"
							target="_blank"
						>
							<div class="rlc-info">
								<div class="rlc-title">{embed().value.title}</div>
								<div class="rlc-description"> {embed().value.description}</div>
								<div class="rlc-url-container">
									<img
										class="rlc-favicon"
										src={RICH_LINK.SITE_FAVICON_URL}
										alt={RICH_LINK.SITE_FAVICON_ALT}
										width="16"
										height="16"
									/>
									<span class="rlc-url">{embed().value.url}</span>
								</div>
							</div>
							<div class="rlc-image-container">
								<img
									class="rlc-image"
									src={embed().value.image}
									alt={embed().value.title}
								/>
							</div>
						</a>
					</>
				)}
			</Match>
		</Switch>
	);
};

export default RichLink;

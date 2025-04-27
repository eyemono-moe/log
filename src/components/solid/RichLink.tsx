import { type Component, Match, Show, Switch } from "solid-js";
import { useQueryEmbed } from "../../utils/nostr/ogp";
import TweetEmbed from "./TweetEmbed";

const twitterHostnameRegex = /(\.)?(twitter|x)\.com/i;

const isTwitterUrl = (url: string): boolean => {
	try {
		const host = new URL(url).hostname;
		return twitterHostnameRegex.test(host);
	} catch {
		return false;
	}
};

const RichLink: Component<{
	href: string;
	content: string;
}> = (props) => {
	const embed = useQueryEmbed(() => props.href);

	return (
		<>
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
									<div class="rlc-description">
										{" "}
										{embed().value.description}
									</div>
									<div class="rlc-url-container">
										<img
											class="rlc-favicon"
											src="https://www.google.com/s2/favicons?domain=log.eyemono.moe"
											alt="eyemono.log favicon"
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
		</>
	);
};

export default RichLink;

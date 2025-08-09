import { verifier } from "@rx-nostr/crypto";
import { createRxNostr, type RxNostr } from "rx-nostr";
import { createContext, type ParentComponent, useContext } from "solid-js";

const RxNostrContext = createContext<RxNostr>();

export const RxNostrProvider: ParentComponent = (props) => {
	const rxNostr = createRxNostr({
		verifier,
	});

	rxNostr.setDefaultRelays([
		"wss://yabu.me/",
		"wss://nos.lol/",
		"wss://nostr.compile-error.net/",
		// "ws://localhost:8080",
	]);

	return (
		<RxNostrContext.Provider value={rxNostr}>
			{props.children}
		</RxNostrContext.Provider>
	);
};

export const useRxNostr = () => {
	const ctx = useContext(RxNostrContext);
	if (!ctx) {
		throw new Error("useRxNostr must be used within a RxNostrProvider");
	}
	return ctx;
};

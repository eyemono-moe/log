import type {
	CancellationToken,
	ProviderResult,
	QuickDiffProvider,
	Uri,
} from "vscode";
import { toOriginalFileUri } from "../../util/uri";

export class CmsRepository implements QuickDiffProvider {
	provideOriginalResource(
		uri: Uri,
		_token: CancellationToken,
	): ProviderResult<Uri> {
		return toOriginalFileUri(uri);
	}
}

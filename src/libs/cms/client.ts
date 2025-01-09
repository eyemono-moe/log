import type { CMSClient } from ".";
import { createContentfulClient } from "./contentful/client";

export const cmsClient = (): CMSClient => createContentfulClient();
